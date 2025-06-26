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

    public function findByProductId(string $id)
    {
        $validator = v::key('id', v::stringType()->notEmpty());

        try {
            $validator->assert(['id' => $id]);
        } catch (ValidationException $err) {
            error_log("Validation failed DscFindById: " . $err->getMessage());
            return null;
        }

        $stmt = $this->db->prepare('SELECT * FROM discounts WHERE product_id IS NOT NULL AND product_id = ?');

        if (!$stmt) {
            error_log("Prepare failed" . $this->db->error);

            return null;
        }

        $stmt->bind_param('s', $id);

        if (!$stmt->execute()) {
            error_log("Execute failed" . $stmt->error);

            return null;
        }

        $result = $stmt->get_result();

        return $result->fetch_assoc() ?: null;
    }

    public function create(array $data)
    {

        $validator = v::key('type', v::stringType()->notEmpty())
            ->key('value', v::numericVal()->positive())
            ->key('starts_at', v::stringType()->notEmpty())
            ->key('ends_at', v::stringType()->notEmpty())
            ->key('product_id', v::stringType()->notEmpty());

        try {
            $validator->assert($data);
        } catch (ValidationException $err) {
            error_log("Validation failed Discount: " . $err->getMessage());
            return null;
        }

        $startsAt = date('Y-m-d H:i:s', strtotime($data['starts_at']));
        $endsAt = date('Y-m-d H:i:s', strtotime($data['ends_at']));

        $stmt = $this->db->prepare('INSERT INTO discounts (id, product_id, type, value, starts_at, ends_at) VALUES (?, ?, ?, ?, ?, ?)');

        if (!$stmt) {
            error_log("Prepare failed" . $this->db->error);
            return null;
        }

        $id = generateHash();

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
            error_log("Execute failded" . $stmt->error);
            return null;
        }

        return $this->findById($id);
    }
}