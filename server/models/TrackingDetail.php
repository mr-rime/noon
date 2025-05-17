<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

class TrackingDetail
{
    private mysqli $conn;
    private string $table = 'tracking_details';

    public function __construct(mysqli $db)
    {
        $this->conn = $db;
    }

    public function findByOrderId(int $orderId): ?array
    {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE order_id = ? LIMIT 1");
        if (!$stmt) {
            error_log("Prepare failed: " . $this->conn->error);
            return null;
        }

        $stmt->bind_param('i', $orderId);

        if (!$stmt->execute()) {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }

        $result = $stmt->get_result();
        return $result->fetch_assoc() ?: null;
    }

    public function create(array $data): ?array
    {
        $validator = v::key('order_id', v::intType()->positive())
            ->key('shipping_provider', v::stringType()->notEmpty()->length(1, 100))
            ->key('tracking_number', v::stringType()->notEmpty()->length(1, 100))
            ->key('status', v::stringType()->notEmpty()->length(1, 50))
            ->key('estimated_delivery_date', v::date('Y-m-d'));

        try {
            $validator->assert($data);
        } catch (ValidationException $e) {
            error_log("Validation failed: " . $e->getMessage());
            return null;
        }

        $stmt = $this->conn->prepare("
            INSERT INTO {$this->table} 
            (order_id, shipping_provider, tracking_number, status, estimated_delivery_date) 
            VALUES (?, ?, ?, ?, ?)
        ");

        if (!$stmt) {
            error_log("Prepare failed: " . $this->conn->error);
            return null;
        }

        $stmt->bind_param(
            'issss',
            $data['order_id'],
            $data['shipping_provider'],
            $data['tracking_number'],
            $data['status'],
            $data['estimated_delivery_date']
        );

        if ($stmt->execute()) {
            return $this->findByOrderId($data['order_id']);
        } else {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }
    }

    public function update(int $orderId, array $data): bool
    {
        $validator = v::key('shipping_provider', v::stringType()->notEmpty()->length(1, 100))
            ->key('tracking_number', v::stringType()->notEmpty()->length(1, 100))
            ->key('status', v::stringType()->notEmpty()->length(1, 50))
            ->key('estimated_delivery_date', v::date('Y-m-d'));

        try {
            $validator->assert($data);
        } catch (ValidationException $e) {
            error_log("Validation failed: " . $e->getMessage());
            return false;
        }

        $stmt = $this->conn->prepare("
            UPDATE {$this->table}
            SET shipping_provider = ?, tracking_number = ?, status = ?, estimated_delivery_date = ?, updated_at = NOW()
            WHERE order_id = ?
        ");

        if (!$stmt) {
            error_log("Prepare failed: " . $this->conn->error);
            return false;
        }

        $stmt->bind_param(
            'ssssi',
            $data['shipping_provider'],
            $data['tracking_number'],
            $data['status'],
            $data['estimated_delivery_date'],
            $orderId
        );

        if (!$stmt->execute()) {
            error_log("Execute failed: " . $stmt->error);
            return false;
        }

        return true;
    }

    public function deleteByOrderId(int $orderId): bool
    {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE order_id = ?");
        if (!$stmt) {
            error_log("Prepare failed: " . $this->conn->error);
            return false;
        }

        $stmt->bind_param('i', $orderId);

        if (!$stmt->execute()) {
            error_log("Execute failed: " . $stmt->error);
            return false;
        }

        return true;
    }
}
