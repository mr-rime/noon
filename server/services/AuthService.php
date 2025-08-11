<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;
require_once __DIR__ . '/../utils/generateHash.php';



class AuthService
{
    private mysqli|null $db;

    public function __construct(mysqli|null $db)
    {
        $this->db = $db;
    }

    public function login(string $email, string $password)
    {

        $emailValidator = v::email()->notEmpty();
        $passwordValidator = v::stringType()->notEmpty()->length(6, null);

        try {
            $emailValidator->assert($email);
            $passwordValidator->assert($password);
        } catch (ValidationException $err) {
            error_log("Validation failed: " . $err->getMessage());

            return null;
        }

        $userModel = new User($this->db);
        $currentUser = $userModel->findByEmail($email);

        if (!$currentUser || !$userModel->verifyPassword($password, $currentUser['password'])) {
            return [
                'success' => false,
                'message' => 'Invalid email or password',
                'user' => null,
            ];
        }

        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
            session_regenerate_id(true);
        }


        $_SESSION['user'] = $currentUser;

        return [
            'success' => true,
            'message' => 'Login successful',
            'user' => $currentUser,
        ];
    }

    public function register(array $data)
    {
        $userModel = new User($this->db);
        $existingUser = $userModel->findByEmail($data['email']);

        if ($existingUser) {
            return [
                'success' => false,
                'message' => 'Email is already registered',
                'user' => null,
            ];
        }

        $newUser = $userModel->create([
            'hash' => generateHash(),
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);



        if (!$newUser) {
            return [
                'success' => false,
                'message' => 'User registration failed',
                'user' => null,
            ];
        }

        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        $_SESSION['user'] = $newUser;

        return [
            'success' => true,
            'message' => 'Registration successful',
            'user' => [$newUser] ?? null,
        ];
    }

    public function logout()
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        if (session_status() === PHP_SESSION_ACTIVE) {
            $_SESSION = [];

            session_unset();
            session_destroy();

            if (ini_get("session.use_cookies")) {
                $params = session_get_cookie_params();
                setcookie(
                    session_name(),
                    '',
                    time() - 42000,
                    $params['path'],
                    $params['domain'],
                    $params['secure'],
                    $params['httponly']
                );
            }

            return [
                'success' => true,
                'message' => 'Logged out successfully',
                'user' => null
            ];
        }

        return [
            'success' => false,
            'message' => 'No active session to destroy',
            'user' => null,
        ];
    }
}