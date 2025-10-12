<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;
require_once __DIR__ . '/../utils/generateHash.php';

class Discount
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    private function validateId(string $id): bool
    {
        try {
            v::stringType()->notEmpty()->assert($id);
            return true;
        } catch (ValidationException $err) {
            error_log("Validation failed: " . $err->getMessage());
            return false;
        }
    }

    private function fetchSingleRow(string $query, string $param): ?array
    {
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param('s', $param);

        if (!$stmt->execute()) {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }

        $result = $stmt->get_result();
        return $result->fetch_assoc() ?: null;
    }

    public function findByProductId(string $id): ?array
    {
        if (!$this->validateId($id)) {
            return null;
        }

        return $this->fetchSingleRow('SELECT * FROM discounts WHERE product_id = ?', $id);
    }

    public function findById(string $id): ?array
    {
        if (!$this->validateId($id)) {
            return null;
        }

        return $this->fetchSingleRow('SELECT * FROM discounts WHERE id = ?', $id);
    }

    public function create(array $data): ?array
    {
        $validator = v::key('type', v::stringType()->notEmpty())
            ->key('value', v::numericVal()->positive())
            ->key('starts_at', v::stringType()->notEmpty())
            ->key('ends_at', v::stringType()->notEmpty())
            ->key('product_id', v::stringType()->notEmpty());

        try {
            $validator->assert($data);
        } catch (ValidationException $err) {
            error_log("Validation failed (create): " . $err->getMessage());
            return null;
        }

        $startsAt = date('Y-m-d H:i:s', strtotime($data['starts_at']));
        $endsAt = date('Y-m-d H:i:s', strtotime($data['ends_at']));
        $id = generateHash();

        $stmt = $this->db->prepare('
            INSERT INTO discounts (id, product_id, type, value, starts_at, ends_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ');

        if (!$stmt) {
            error_log("Prepare failed (create): " . $this->db->error);
            return null;
        }

        $stmt->bind_param(
            'sssiss',
            $id,
            $data['product_id'],
            $data['type'],
            $data['value'],
            $startsAt,
            $endsAt
        );

        if (!$stmt->execute()) {
            error_log("Execute failed (create): " . $stmt->error);
            return null;
        }

        return $this->findById($id);
    }

    public function findAll(int $limit = 10, int $offset = 0, string $search = '', ?string $productId = null): array
    {
        $whereConditions = [];
        $params = [];
        $types = '';

        if (!empty(trim($search))) {
            $whereConditions[] = "p.name LIKE CONCAT('%', ?, '%') OR p.psku LIKE CONCAT('%', ?, '%')";
            $params = array_merge($params, [$search, $search]);
            $types .= 'ss';
        }

        if ($productId !== null) {
            $whereConditions[] = "d.product_id = ?";
            $params[] = $productId;
            $types .= 's';
        }

        $where = empty($whereConditions) ? '' : 'WHERE ' . implode(' AND ', $whereConditions);

        $query = "
            SELECT d.*, p.name as product_name, p.psku, p.price as product_price, p.currency
            FROM discounts d
            LEFT JOIN products p ON d.product_id = p.id
            $where
            ORDER BY d.id DESC
            LIMIT ? OFFSET ?
        ";

        $params = array_merge($params, [$limit, $offset]);
        $types .= 'ii';

        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed (findAll): " . $this->db->error);
            return [];
        }

        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }

        if (!$stmt->execute()) {
            error_log("Execute failed (findAll): " . $stmt->error);
            return [];
        }

        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC) ?: [];
    }

    public function getTotalCount(string $search = '', ?string $productId = null): int
    {
        $whereConditions = [];
        $params = [];
        $types = '';

        if (!empty(trim($search))) {
            $whereConditions[] = "p.name LIKE CONCAT('%', ?, '%') OR p.psku LIKE CONCAT('%', ?, '%')";
            $params = array_merge($params, [$search, $search]);
            $types .= 'ss';
        }

        if ($productId !== null) {
            $whereConditions[] = "d.product_id = ?";
            $params[] = $productId;
            $types .= 's';
        }

        $where = empty($whereConditions) ? '' : 'WHERE ' . implode(' AND ', $whereConditions);

        $query = "
            SELECT COUNT(*) as total
            FROM discounts d
            LEFT JOIN products p ON d.product_id = p.id
            $where
        ";

        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed (getTotalCount): " . $this->db->error);
            return 0;
        }

        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }

        if (!$stmt->execute()) {
            error_log("Execute failed (getTotalCount): " . $stmt->error);
            return 0;
        }

        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        return (int) ($row['total'] ?? 0);
    }

    public function update(string $id, array $data): ?array
    {
        if (!$this->validateId($id)) {
            return null;
        }

        $validator = v::key('type', v::optional(v::stringType()->notEmpty()))
            ->key('value', v::optional(v::numericVal()->positive()))
            ->key('starts_at', v::optional(v::stringType()->notEmpty()))
            ->key('ends_at', v::optional(v::stringType()->notEmpty()));

        try {
            $validator->assert($data);
        } catch (ValidationException $err) {
            error_log("Validation failed (update): " . $err->getMessage());
            return null;
        }

        $fields = [];
        $types = '';
        $values = [];

        foreach ($data as $key => $value) {
            if (in_array($key, ['type', 'value', 'starts_at', 'ends_at'])) {
                $fields[] = "$key = ?";
                if ($key === 'value') {
                    $types .= 'd';
                } else {
                    $types .= 's';
                }

                if (in_array($key, ['starts_at', 'ends_at'])) {
                    $values[] = date('Y-m-d H:i:s', strtotime($value));
                } else {
                    $values[] = $value;
                }
            }
        }

        if (empty($fields)) {
            error_log("No fields to update.");
            return null;
        }

        $query = 'UPDATE discounts SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed (update): " . $this->db->error);
            return null;
        }

        $types .= 's';
        $values[] = $id;

        $stmt->bind_param($types, ...$values);

        if (!$stmt->execute()) {
            error_log("Execute failed (update): " . $stmt->error);
            return null;
        }

        return $this->findById($id);
    }

    public function delete(string $id): bool
    {
        if (!$this->validateId($id)) {
            return false;
        }

        $stmt = $this->db->prepare('DELETE FROM discounts WHERE id = ?');
        if (!$stmt) {
            error_log("Prepare failed (delete): " . $this->db->error);
            return false;
        }

        $stmt->bind_param('s', $id);

        if (!$stmt->execute()) {
            error_log("Execute failed (delete): " . $stmt->error);
            return false;
        }

        return $stmt->affected_rows > 0;
    }
}
