<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

class User
{
    private $db;


    public function __construct($db)
    {
        $this->db = $db;
    }


    public function find()
    {
        $query = 'SELECT * FROM users';

        $result = $this->db->query($query);

        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function create($hash, $first_name, $last_name, $email, $passowrd)
    {

        $hashValidator = v::stringType()->notEmpty()->length(1, 21);
        $firstNameValidator = v::stringType()->notEmpty()->length(1, 50);
        $lastNameValidator = v::stringType()->length(1, 50);
        $emailValidator = v::email()->notEmpty();
        $passwordValidator = v::stringType()->notEmpty()->length(6, null);

        try {
            $hashValidator->assert($hash);
            $firstNameValidator->assert($first_name);
            $lastNameValidator->assert($last_name);
            $emailValidator->assert($email);
            $passwordValidator->assert($passowrd);
        } catch (ValidationException $e) {
            error_log("Validation failed: " . $e->getMessage());

            return null;
        }

        $hashedpassord = password_hash($passowrd, PASSWORD_DEFAULT);

        $query = 'INSERT INTO users (hash, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: ", $this->db->error);
            return null;
        }

        $stmt->bind_param('sssss', $hash, $first_name, $last_name, $email, $hashedpassord);


        if ($stmt->execute()) {
            return $this->db->insert_id;
        } else {
            error_log("Excute failed: " . $stmt->error);

            return null;
        }
    }
}