<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;
require_once __DIR__ . '/../utils/generateHash.php';

class Coupon
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

    public function findById(string $id): ?array
    {
        if (!$this->validateId($id)) {
            return null;
        }

        return $this->fetchSingleRow('SELECT * FROM coupons WHERE id = ?', $id);
    }

    public function findByCode(string $code): ?array
    {
        return $this->fetchSingleRow('SELECT * FROM coupons WHERE code = ?', $code);
    }

    public function create(array $data): ?array
    {
        $validator = v::key('code', v::stringType()->notEmpty())
            ->key('type', v::in(['percentage', 'fixed']))
            ->key('value', v::numericVal()->positive())
            ->key('starts_at', v::stringType()->notEmpty())
            ->key('ends_at', v::stringType()->notEmpty());

        try {
            $validator->assert($data);
        } catch (ValidationException $err) {
            error_log("Validation failed (create coupon): " . $err->getMessage());
            return null;
        }

        // Check if code exists
        if ($this->findByCode($data['code'])) {
            error_log("Coupon code already exists: " . $data['code']);
            return null;
        }

        $startsAt = date('Y-m-d H:i:s', strtotime($data['starts_at']));
        $endsAt = date('Y-m-d H:i:s', strtotime($data['ends_at']));
        $id = generateHash();
        $usageLimit = isset($data['usage_limit']) ? (int) $data['usage_limit'] : null;
        $status = $data['status'] ?? 'active';

        $stmt = $this->db->prepare('
            INSERT INTO coupons (id, code, type, value, starts_at, ends_at, usage_limit, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ');

        if (!$stmt) {
            error_log("Prepare failed (create coupon): " . $this->db->error);
            return null;
        }

        $stmt->bind_param(
            'sssissis',
            $id,
            $data['code'],
            $data['type'],
            $data['value'],
            $startsAt,
            $endsAt,
            $usageLimit,
            $status
        );

        if (!$stmt->execute()) {
            error_log("Execute failed (create coupon): " . $stmt->error);
            return null;
        }

        return $this->findById($id);
    }

    public function findAll(int $limit = 10, int $offset = 0, string $search = ''): array
    {
        $whereConditions = [];
        $params = [];
        $types = '';

        if (!empty(trim($search))) {
            $whereConditions[] = "code LIKE CONCAT('%', ?, '%')";
            $params[] = $search;
            $types .= 's';
        }

        $where = empty($whereConditions) ? '' : 'WHERE ' . implode(' AND ', $whereConditions);

        $query = "
            SELECT *
            FROM coupons
            $where
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        ";

        $params = array_merge($params, [$limit, $offset]);
        $types .= 'ii';

        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed (findAll coupons): " . $this->db->error);
            return [];
        }

        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }

        if (!$stmt->execute()) {
            error_log("Execute failed (findAll coupons): " . $stmt->error);
            return [];
        }

        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC) ?: [];
    }

    public function getTotalCount(string $search = ''): int
    {
        $whereConditions = [];
        $params = [];
        $types = '';

        if (!empty(trim($search))) {
            $whereConditions[] = "code LIKE CONCAT('%', ?, '%')";
            $params[] = $search;
            $types .= 's';
        }

        $where = empty($whereConditions) ? '' : 'WHERE ' . implode(' AND ', $whereConditions);

        $query = "SELECT COUNT(*) as total FROM coupons $where";

        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed (getTotalCount coupons): " . $this->db->error);
            return 0;
        }

        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }

        if (!$stmt->execute()) {
            error_log("Execute failed (getTotalCount coupons): " . $stmt->error);
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

        $fields = [];
        $types = '';
        $values = [];

        foreach ($data as $key => $value) {
            if (in_array($key, ['code', 'type', 'value', 'starts_at', 'ends_at', 'usage_limit', 'status'])) {
                $fields[] = "$key = ?";

                if ($key === 'value') {
                    $types .= 'd';
                    $values[] = $value;
                } elseif ($key === 'usage_limit') {
                    $types .= 'i';
                    $values[] = $value;
                } elseif (in_array($key, ['starts_at', 'ends_at'])) {
                    $types .= 's';
                    $values[] = date('Y-m-d H:i:s', strtotime($value));
                } else {
                    $types .= 's';
                    $values[] = $value;
                }
            }
        }

        if (empty($fields)) {
            return $this->findById($id);
        }

        $query = 'UPDATE coupons SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed (update coupon): " . $this->db->error);
            return null;
        }

        $types .= 's';
        $values[] = $id;

        $stmt->bind_param($types, ...$values);

        if (!$stmt->execute()) {
            error_log("Execute failed (update coupon): " . $stmt->error);
            return null;
        }

        return $this->findById($id);
    }

    public function delete(string $id): bool
    {
        if (!$this->validateId($id)) {
            return false;
        }

        $stmt = $this->db->prepare('DELETE FROM coupons WHERE id = ?');
        if (!$stmt) {
            error_log("Prepare failed (delete coupon): " . $this->db->error);
            return false;
        }

        $stmt->bind_param('s', $id);

        if (!$stmt->execute()) {
            error_log("Execute failed (delete coupon): " . $stmt->error);
            return false;
        }

        return $stmt->affected_rows > 0;
    }
}
