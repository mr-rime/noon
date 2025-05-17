<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

class Product
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function findAll(): array
    {
        $query = 'SELECT * FROM products';
        $result = $this->db->query($query);

        if (!$result) {
            error_log("Query failed: " . $this->db->error);
            return [];
        }

        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function findById(string $id): ?array
    {
        $query = 'SELECT * FROM products WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param('s', $id);

        if (!$stmt->execute()) {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }

        $result = $stmt->get_result();
        return $result->fetch_assoc() ?: null;
    }

    public function create(array $data): ?array
    {
        $validator = v::key('id', v::stringType()->notEmpty()->length(1, 21))
            ->key('user_id', v::intVal()->positive())
            ->key('name', v::stringType()->notEmpty()->length(1, 100))
            ->key('price', v::floatVal()->positive())
            ->key('currency', v::stringType()->notEmpty()->length(3, 4))
            ->key('product_overview', v::optional(v::stringType()));

        try {
            $validator->assert($data);
        } catch (ValidationException $err) {
            error_log("Validation failed: " . $err->getMessage());
            return null;
        }

        $query = 'INSERT INTO products (id, user_id, name, price, currency, product_overview) VALUES (?, ?, ?, ?, ?, ?)';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $productOverview = $data['product_overview'] ?? null;

        $stmt->bind_param(
            'sisdss',
            $data['id'],
            $data['user_id'],
            $data['name'],
            $data['price'],
            $data['currency'],
            $productOverview
        );

        if ($stmt->execute()) {
            return $this->findById($data['id']);
        } else {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }
    }

    public function update(string $id, array $data): ?array
    {
        $validator = v::keySet(
            v::key('user_id', v::intVal()->positive(), false),
            v::key('name', v::stringType()->notEmpty()->length(1, 100), false),
            v::key('price', v::floatVal()->positive(), false),
            v::key('currency', v::stringType()->notEmpty()->length(3, 4), false),
            v::key('product_overview', v::optional(v::stringType()), false)
        );

        try {
            $validator->assert($data);
        } catch (ValidationException $err) {
            error_log("Validation failed: " . $err->getMessage());
            return null;
        }

        $fields = [];
        $types = '';
        $values = [];

        foreach ($data as $key => $value) {
            $fields[] = "$key = ?";
            if ($key === 'user_id') {
                $types .= 'i';
            } elseif ($key === 'price') {
                $types .= 'd';
            } else {
                $types .= 's';
            }
            $values[] = $value;
        }

        if (empty($fields)) {
            error_log("No fields to update.");
            return null;
        }

        $query = 'UPDATE products SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $types .= 's';
        $values[] = $id;

        $bind_names[] = $types;
        foreach ($values as $key => $value) {
            $bind_names[] = &$values[$key];
        }
        call_user_func_array([$stmt, 'bind_param'], $bind_names);

        if ($stmt->execute()) {
            return $this->findById($id);
        } else {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }
    }

    public function delete(string $id): bool
    {
        $query = 'DELETE FROM products WHERE id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param('s', $id);

        if ($stmt->execute()) {
            return $stmt->affected_rows > 0;
        } else {
            error_log("Execute failed: " . $stmt->error);
            return false;
        }
    }
}
