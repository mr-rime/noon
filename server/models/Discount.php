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
}
