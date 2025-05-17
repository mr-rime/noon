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


    public function find()
    {
        $query = 'SELECT * FROM users';

        $result = $this->db->query($query);

        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function findByEmail(string $email)
    {
        $emailValidator = v::email()->notEmpty();

        try {
            $emailValidator->assert($email);
        } catch (ValidationException $err) {
            error_log("Validation failed: " . $err->getMessage());
            return null;
        }

        $query = 'SELECT * FROM users WHERE email = ?';

        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: ", $this->db->error);
            return null;
        }

        $stmt->bind_param('s', $email);

        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public function findById(string $id)
    {
        $query = "SELECT * FROM users WHERE id = ?";

        $stmt = $this->db->prepare($query);

        $stmt->bind_param("i", $id);

        $stmt->execute();

        $result = $stmt->get_result();

        return $result->fetch_assoc();
    }


    public function create(array $data)
    {
        $validator = v::key('hash', v::stringType()->notEmpty()->length(1, 21))
            ->key('first_name', v::stringType()->notEmpty()->length(1, 50))
            ->key('last_name', v::stringType()->length(1, 50))
            ->key('email', v::email()->notEmpty())
            ->key('password', v::stringType()->notEmpty()->length(6, null));

        try {
            $validator->assert($data);
        } catch (ValidationException $err) {
            error_log("Validation failed: " . $err->getMessage());
            return null;
        }


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
            $data['password']
        );


        if ($stmt->execute()) {
            $userId = $this->db->insert_id;
            $user = $this->findById($userId);
            return $user;
        } else {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }
    }

    public function verifyPassword(string $password, string $hashedPassword)
    {
        return password_verify($password, $hashedPassword);
    }
}