<?php

require_once __DIR__ . '/../utils/generateHash.php';

class TrackingDetails
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function create(array $data): ?array
    {
        $orderId = $data['order_id'];
        $shippingProvider = $data['shipping_provider'];
        $trackingNumber = $data['tracking_number'] ?? $this->generateTrackingNumber();
        $status = $data['status'] ?? 'processing';
        $estimatedDeliveryDate = $data['estimated_delivery_date'] ?? null;

        $query = "INSERT INTO tracking_details (id, order_id, shipping_provider, tracking_number, status, estimated_delivery_date) 
                  VALUES (?, ?, ?, ?, ?, ?)";

        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Tracking details prepare failed: " . $this->db->error);
            return null;
        }

        $id = generateHash();
        $stmt->bind_param("ssssss", $id, $orderId, $shippingProvider, $trackingNumber, $status, $estimatedDeliveryDate);

        if (!$stmt->execute()) {
            error_log("Tracking details insert failed: " . $stmt->error);
            $stmt->close();
            return null;
        }

        $stmt->close();

        return [
            'id' => $id,
            'order_id' => $orderId,
            'shipping_provider' => $shippingProvider,
            'tracking_number' => $trackingNumber,
            'status' => $status,
            'estimated_delivery_date' => $estimatedDeliveryDate,
        ];
    }

    public function getByOrderId(string $orderId): ?array
    {
        $query = "SELECT * FROM tracking_details WHERE order_id = ? ORDER BY created_at DESC LIMIT 1";
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Tracking details select prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param("s", $orderId);
        $stmt->execute();
        $result = $stmt->get_result();
        $tracking = $result->fetch_assoc();
        $stmt->close();

        return $tracking ?: null;
    }

    public function getAllByOrderId(string $orderId): array
    {
        $query = "SELECT * FROM tracking_details WHERE order_id = ? ORDER BY created_at ASC";
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Tracking details select all prepare failed: " . $this->db->error);
            return [];
        }

        $stmt->bind_param("s", $orderId);
        $stmt->execute();
        $result = $stmt->get_result();
        $trackings = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        return $trackings;
    }

    public function update(string $id, array $data): bool
    {
        $fields = [];
        $values = [];
        $types = '';

        if (isset($data['status'])) {
            $fields[] = 'status = ?';
            $values[] = $data['status'];
            $types .= 's';
        }

        if (isset($data['estimated_delivery_date'])) {
            $fields[] = 'estimated_delivery_date = ?';
            $values[] = $data['estimated_delivery_date'];
            $types .= 's';
        }

        if (isset($data['shipping_provider'])) {
            $fields[] = 'shipping_provider = ?';
            $values[] = $data['shipping_provider'];
            $types .= 's';
        }

        if (isset($data['tracking_number'])) {
            $fields[] = 'tracking_number = ?';
            $values[] = $data['tracking_number'];
            $types .= 's';
        }

        if (empty($fields)) {
            return false;
        }

        $fields[] = 'updated_at = CURRENT_TIMESTAMP';
        $values[] = $id;
        $types .= 's';

        $query = "UPDATE tracking_details SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Tracking details update prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param($types, ...$values);
        $result = $stmt->execute();
        $stmt->close();

        return $result;
    }

    public function getTrackingTimeline(string $orderId): array
    {
        $tracking = $this->getByOrderId($orderId);
        if (!$tracking) {
            return [];
        }


        $timeline = [
            [
                'status' => 'placed',
                'description' => 'Order placed',
                'completed' => true,
                'date' => $tracking['created_at'],
            ],
            [
                'status' => 'processing',
                'description' => 'Order is being processed',
                'completed' => in_array($tracking['status'], ['processing', 'confirmed', 'dispatched', 'delivered']),
                'date' => $tracking['status'] === 'processing' ? $tracking['created_at'] : null,
            ],
            [
                'status' => 'confirmed',
                'description' => 'Order confirmed',
                'completed' => in_array($tracking['status'], ['confirmed', 'dispatched', 'delivered']),
                'date' => $tracking['status'] === 'confirmed' ? $tracking['created_at'] : null,
            ],
            [
                'status' => 'dispatched',
                'description' => 'Order dispatched',
                'completed' => in_array($tracking['status'], ['dispatched', 'delivered']),
                'date' => $tracking['status'] === 'dispatched' ? $tracking['created_at'] : null,
            ],
            [
                'status' => 'delivered',
                'description' => 'Order delivered',
                'completed' => $tracking['status'] === 'delivered',
                'date' => $tracking['status'] === 'delivered' ? $tracking['created_at'] : null,
                'estimated_delivery_date' => $tracking['estimated_delivery_date'],
            ],
        ];

        return $timeline;
    }

    private function generateTrackingNumber(): string
    {

        $prefix = 'NEGH';
        $suffix = strtoupper(substr(uniqid(), -8));
        return $prefix . $suffix;
    }

    public function findByTrackingNumber(string $trackingNumber): ?array
    {
        $query = "SELECT * FROM tracking_details WHERE tracking_number = ?";
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Tracking details find by number prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param("s", $trackingNumber);
        $stmt->execute();
        $result = $stmt->get_result();
        $tracking = $result->fetch_assoc();
        $stmt->close();

        return $tracking ?: null;
    }
}