<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

class Review
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function findByProductId(string $productId): array
    {
        $query = 'SELECT * FROM reviews WHERE product_id = ?';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return [];
        }
        $stmt->bind_param('s', $productId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function findById(int $id): ?array
    {
        $query = 'SELECT * FROM reviews WHERE id = ? LIMIT 1';
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
        $validator = v::key('product_id', v::stringType()->notEmpty())
            ->key('user_id', v::intType()->positive())
            ->key('rating', v::intType()->between(1, 5))
            ->key('comment', v::optional(v::stringType()))
            ->key('verified_purchase', v::optional(v::boolType()));

        try {
            $validator->assert($data);
        } catch (ValidationException $err) {
            error_log("Validation failed: " . $err->getMessage());
            return null;
        }

        $query = 'INSERT INTO reviews (product_id, user_id, rating, comment, verified_purchase) VALUES (?, ?, ?, ?, ?)';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $verified = $data['verified_purchase'] ?? false;
        $stmt->bind_param(
            'siisi',
            $data['product_id'],
            $data['user_id'],
            $data['rating'],
            $data['comment'],
            $verified
        );
        if ($stmt->execute()) {
            $id = $stmt->insert_id;
            return $this->findById($id);
        } else {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }
    }

    public function update(int $id, array $data): ?array
    {
        $fields = ['rating', 'comment', 'verified_purchase'];
        $set = [];
        $params = [];
        $types = '';

        foreach ($fields as $field) {
            if (isset($data[$field])) {
                $set[] = "$field = ?";
                if ($field === 'verified_purchase') {
                    $params[] = $data[$field] ? 1 : 0;
                    $types .= 'i';
                } elseif ($field === 'rating') {
                    $params[] = (int) $data[$field];
                    $types .= 'i';
                } else {
                    $params[] = $data[$field];
                    $types .= 's';
                }
            }
        }

        if (empty($set)) {
            return $this->findById($id);
        }

        $params[] = $id;
        $types .= 'i';

        $query = 'UPDATE reviews SET ' . implode(', ', $set) . ' WHERE id = ?';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param($types, ...$params);
        if ($stmt->execute()) {
            return $this->findById($id);
        }
        error_log("Execute failed: " . $stmt->error);
        return null;
    }

    public function delete(int $id): bool
    {
        $query = 'DELETE FROM reviews WHERE id = ?';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }
        $stmt->bind_param('i', $id);
        return $stmt->execute();
    }
}