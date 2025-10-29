<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;
require_once __DIR__ . '/../utils/generateHash.php';
require_once __DIR__ . '/../log/logger.php';
require_once __DIR__ . '/../models/SessionManager.php';


class AuthService
{
    private mysqli|null $db;
    private SessionManager $sessionManager;

    public function __construct(mysqli|null $db)
    {
        $this->db = $db;
        $this->sessionManager = new SessionManager($db);
    }

    public function login(string $email, string $password)
    {
        $start = microtime(true);

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


        $sessionId = $this->sessionManager->getSessionId();
        $this->sessionManager->startSession($currentUser['id']);
        $this->sessionManager->setUser($sessionId, $currentUser);


        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
        $_SESSION['user'] = $currentUser;

        // Merge guest cart into user cart without duplicating existing items
        try {
            require_once __DIR__ . '/../models/Cart.php';
            $cart = new Cart($this->db);
            $cart->mergeGuestCartWithUserCart((int) $currentUser['id']);
        } catch (Throwable $e) {
            // Non-fatal for login; log and continue
            error_log('Cart merge on login failed: ' . $e->getMessage());
        }

        $duration = round((microtime(true) - $start) * 1000, 2);

        app_log("Login attempt", [
            "email" => $email,
            "success" => true,
            "duration_ms" => $duration
        ]);

        return [
            'success' => true,
            'message' => 'Login successful',
            'user' => $currentUser,
        ];
    }

    public function register(array $data)
    {
        $start = microtime(true);
        $userModel = new User($this->db);


        $existingUser = $userModel->findByEmail($data['email']);
        if ($existingUser) {
            $this->logRegister($data['email'], false, $start, "Duplicate email");
            return [
                'success' => false,
                'message' => 'Email is already registered',
                'user' => null,
            ];
        }

        try {
            $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

            $newUser = $userModel->create([
                'hash' => generateHash(),
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'] ?? '',
                'email' => $data['email'],
                'password' => $hashedPassword,
            ]);

            if (!$newUser) {
                $this->logRegister($data['email'], false, $start);
                return [
                    'success' => false,
                    'message' => 'User registration failed',
                    'user' => null,
                ];
            }


            $sessionId = $this->sessionManager->getSessionId();
            $this->sessionManager->startSession($newUser['id']);
            $this->sessionManager->setUser($sessionId, $newUser);


            if (session_status() !== PHP_SESSION_ACTIVE) {
                session_start();
            }
            $_SESSION['user'] = $newUser;

            $this->logRegister($data['email'], true, $start);

            return [
                'success' => true,
                'message' => 'Registration successful',
                'user' => $newUser,
            ];

        } catch (\Exception $e) {
            $this->logRegister($data['email'], false, $start, $e->getMessage());
            throw $e;
        }
    }

    private function logRegister(string $email, bool $success, float $start, string $note = '')
    {
        $duration = round((microtime(true) - $start) * 1000, 2);
        app_log("Register attempt", [
            "email" => $email,
            "success" => $success,
            "duration_ms" => $duration,
            "note" => $note
        ]);
    }


    public function logout()
    {
        $sessionId = $this->sessionManager->getSessionId();


        $user = $this->sessionManager->getUser($sessionId);


        if ($user) {
            $this->sessionManager->clearUser($sessionId);
        }


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
        }

        return [
            'success' => true,
            'message' => 'Logged out successfully',
            'user' => null
        ];
    }
}