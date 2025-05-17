<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

class Order
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function findAll(): array
    {
        $query = 'SELECT * FROM orders';
        $result = $this->db->query($query);

        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    public function findById(int $id): ?array
    {
        $query = 'SELECT * FROM orders WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_assoc() ?: null;
    }

    public function create(array $data): ?array
    {
        $validator = v::key('user_id', v::intType()->positive())
            ->key('total_amount', v::numericVal()->positive())
            ->key('currency', v::stringType()->length(3, 4))
            ->key('status', v::stringType()->oneOf(
                v::equals('pending'),
                v::equals('processing'),
                v::equals('shipped'),
                v::equals('delivered'),
                v::equals('cancelled')
            ))
            ->key('shipping_address', v::stringType()->notEmpty())
            ->key('payment_method', v::stringType()->notEmpty())
            ->key('payment_status', v::stringType()->oneOf(
                v::equals('unpaid'),
                v::equals('paid'),
                v::equals('refunded')
            ));

        try {
            $validator->assert($data);
        } catch (ValidationException $e) {
            error_log("Validation failed: " . $e->getMessage());
            return null;
        }

        $query = "INSERT INTO orders 
            (user_id, total_amount, currency, status, shipping_address, payment_method, payment_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param(
            'idsssss',
            $data['user_id'],
            $data['total_amount'],
            $data['currency'],
            $data['status'],
            $data['shipping_address'],
            $data['payment_method'],
            $data['payment_status']
        );

        if ($stmt->execute()) {
            return $this->findById($this->db->insert_id);
        } else {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }
    }

    public function update(int $id, array $data): bool
    {
        $validator = v::key('status', v::stringType()->oneOf(
            v::equals('pending'),
            v::equals('processing'),
            v::equals('shipped'),
            v::equals('delivered'),
            v::equals('cancelled')
        ))
            ->key('payment_status', v::stringType()->oneOf(
                v::equals('unpaid'),
                v::equals('paid'),
                v::equals('refunded')
            ));

        try {
            $validator->assert($data);
        } catch (ValidationException $e) {
            error_log("Validation failed: " . $e->getMessage());
            return false;
        }

        $query = 'UPDATE orders SET status = ?, payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param('ssi', $data['status'], $data['payment_status'], $id);

        return $stmt->execute();
    }

    public function delete(int $id): bool
    {
        $query = 'DELETE FROM orders WHERE id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param('i', $id);

        return $stmt->execute();
    }
}
