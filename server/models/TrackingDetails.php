<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

class TrackingDetails
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function findAll(): array
    {
        $query = 'SELECT * FROM tracking_details';
        $result = $this->db->query($query);

        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    public function findById(int $id): ?array
    {
        $query = 'SELECT * FROM tracking_details WHERE id = ? LIMIT 1';
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
        $validator = v::key('order_id', v::intVal()->positive())
            ->key('shipping_provider', v::stringType()->notEmpty()->length(null, 100))
            ->key('tracking_number', v::stringType()->notEmpty()->length(null, 100))
            ->key('status', v::optional(v::stringType()->length(null, 100)))
            ->key('estimated_delivery_date', v::optional(v::date('Y-m-d')));

        try {
            $validator->assert($data);
        } catch (ValidationException $e) {
            error_log("Validation failed: " . $e->getMessage());
            return null;
        }

        $orderId = $data['order_id'];
        $shippingProvider = $data['shipping_provider'];
        $trackingNumber = $data['tracking_number'];
        $status = $data['status'] ?? null;
        $estimatedDeliveryDate = $data['estimated_delivery_date'] ?? null;

        $query = "INSERT INTO tracking_details (order_id, shipping_provider, tracking_number, status, estimated_delivery_date)
                  VALUES (?, ?, ?, ?, ?)";

        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param(
            'issss',
            $orderId,
            $shippingProvider,
            $trackingNumber,
            $status,
            $estimatedDeliveryDate
        );

        if (!$stmt->execute()) {
            error_log("Insert failed: " . $stmt->error);
            return null;
        }

        $insertedId = $stmt->insert_id;
        $stmt->close();

        return $this->findById($insertedId);
    }

    public function update(int $id, array $data): bool
    {
        $validator = v::key('shipping_provider', v::optional(v::stringType()->length(null, 100)))
            ->key('tracking_number', v::optional(v::stringType()->length(null, 100)))
            ->key('status', v::optional(v::stringType()->length(null, 100)))
            ->key('estimated_delivery_date', v::optional(v::date('Y-m-d')));

        try {
            $validator->assert($data);
        } catch (ValidationException $e) {
            error_log("Validation failed: " . $e->getMessage());
            return false;
        }

        $fields = [];
        $types = '';
        $values = [];

        if (isset($data['shipping_provider'])) {
            $fields[] = 'shipping_provider = ?';
            $types .= 's';
            $values[] = $data['shipping_provider'];
        }
        if (isset($data['tracking_number'])) {
            $fields[] = 'tracking_number = ?';
            $types .= 's';
            $values[] = $data['tracking_number'];
        }
        if (isset($data['status'])) {
            $fields[] = 'status = ?';
            $types .= 's';
            $values[] = $data['status'];
        }
        if (isset($data['estimated_delivery_date'])) {
            $fields[] = 'estimated_delivery_date = ?';
            $types .= 's';
            $values[] = $data['estimated_delivery_date'];
        }

        if (empty($fields)) {
            return false;
        }

        $query = "UPDATE tracking_details SET " . implode(', ', $fields) . ", updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        $types .= 'i';
        $values[] = $id;

        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param($types, ...$values);

        return $stmt->execute();
    }

    public function delete(int $id): bool
    {
        $query = 'DELETE FROM tracking_details WHERE id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param('i', $id);

        return $stmt->execute();
    }

    public function findByOrderId(int $orderId): array
    {
        $query = 'SELECT * FROM tracking_details WHERE order_id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return [];
        }

        $stmt->bind_param('i', $orderId);
        $stmt->execute();

        $result = $stmt->get_result();

        return $result->fetch_all(MYSQLI_ASSOC);
    }
}
