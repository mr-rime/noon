<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

class User
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function find(): array
    {
        $query = 'SELECT * FROM users';
        $result = $this->db->query($query);
        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    public function findByEmail(string $email): ?array
    {
        try {
            v::email()->notEmpty()->assert($email);
        } catch (ValidationException $err) {
            error_log("Validation failed: " . $err->getMessage());
            return null;
        }

        $query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc() ?: null;
    }

    public function findById(int $id): ?array
    {
        $query = "SELECT * FROM users WHERE id = ? LIMIT 1";
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc() ?: null;
    }

    public function findByHash(string $hash): ?array
    {
        $query = "SELECT * FROM users WHERE hash = ? LIMIT 1";
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }
        $stmt->bind_param("s", $hash);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc() ?: null;
    }

    public function create(array $data): ?array
    {
        $validator = v::key('hash', v::stringType()->notEmpty()->length(1, 21))
            ->key('first_name', v::stringType()->notEmpty()->length(1, 50))
            ->key('last_name', v::optional(v::stringType()->length(0, 50)))
            ->key('email', v::email()->notEmpty())
            ->key('password', v::stringType()->notEmpty()->length(6, null));

        try {
            $validator->assert($data);
        } catch (ValidationException $err) {
            error_log("Validation failed: " . $err->getMessage());
            return null;
        }

        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

        $query = 'INSERT INTO users (hash, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param(
            'sssss',
            $data['hash'],
            $data['first_name'],
            $data['last_name'],
            $data['email'],
            $hashedPassword
        );

        if ($stmt->execute()) {
            $userId = $this->db->insert_id;
            return $this->findById($userId);
        } else {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }
    }

    public function update(int $id, array $data): ?array
    {
        $allowedFields = ['hash', 'first_name', 'last_name', 'email', 'password'];
        $setParts = [];
        $params = [];
        $types = '';

        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $data)) {
                if ($field === 'password') {
                    $params[] = password_hash($data[$field], PASSWORD_DEFAULT);
                } else {
                    $params[] = $data[$field];
                }
                $setParts[] = "$field = ?";
                $types .= 's';
            }
        }

        if (empty($setParts)) {
            return $this->findById($id);
        }

        $query = 'UPDATE users SET ' . implode(', ', $setParts) . ' WHERE id = ?';
        $types .= 'i';
        $params[] = $id;

        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param($types, ...$params);
        if ($stmt->execute()) {
            return $this->findById($id);
        } else {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }
    }

    public function delete(int $id): bool
    {
        $query = 'DELETE FROM users WHERE id = ?';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }
        $stmt->bind_param('i', $id);
        return $stmt->execute();
    }

    public function verifyPassword(string $password, string $hashedPassword): bool
    {
        return password_verify($password, $hashedPassword);
    }
}
