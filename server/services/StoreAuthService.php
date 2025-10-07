<?php

require_once __DIR__ . '/../models/Store.php';
require_once __DIR__ . '/../log/logger.php';

class StoreAuthService
{
    private mysqli|null $db;

    public function __construct(mysqli|null $db)
    {
        $this->db = $db;
    }

    public function login(string $email, string $password)
    {
        $start = microtime(true);

        if (empty($email) || empty($password)) {
            return [
                'success' => false,
                'message' => 'Email and password are required',
                'store' => null,
            ];
        }

        $storeModel = new Store($this->db);
        $stmt = $this->db->prepare('SELECT * FROM stores WHERE email = ? LIMIT 1');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $currentStore = $stmt->get_result()->fetch_assoc();

        if (!$currentStore || !password_verify($password, $currentStore['password'])) {
            $this->logAuth("Login", $email, false, $start);
            return [
                'success' => false,
                'message' => 'Invalid email or password',
                'store' => null,
            ];
        }

        // Start session and store the store data
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
            session_regenerate_id(true);
        }

        // Remove password from session data
        unset($currentStore['password']);
        $_SESSION['store'] = $currentStore;

        $this->logAuth("Login", $email, true, $start);

        return [
            'success' => true,
            'message' => 'Login successful',
            'store' => $currentStore,
        ];
    }

    public function register(array $data)
    {
        $start = microtime(true);
        $storeModel = new Store($this->db);

        // Validate required fields
        if (empty($data['email']) || empty($data['password']) || empty($data['name'])) {
            return [
                'success' => false,
                'message' => 'Store name, email and password are required',
                'store' => null,
            ];
        }

        try {
            // Check if email already exists
            $stmt = $this->db->prepare('SELECT id FROM stores WHERE email = ? LIMIT 1');
            $stmt->bind_param('s', $data['email']);
            $stmt->execute();
            if ($stmt->get_result()->fetch_assoc()) {
                $this->logAuth("Register", $data['email'], false, $start, "Email already exists");
                return [
                    'success' => false,
                    'message' => 'Email is already registered',
                    'store' => null,
                ];
            }

            // Create the store
            $newStore = $storeModel->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'number' => $data['number'] ?? null,
                'thumbnail_url' => $data['thumbnail_url'] ?? null,
            ]);

            if (!$newStore) {
                $this->logAuth("Register", $data['email'], false, $start);
                return [
                    'success' => false,
                    'message' => 'Store registration failed',
                    'store' => null,
                ];
            }

            // Start session and store the store data
            if (session_status() !== PHP_SESSION_ACTIVE) {
                session_start();
            }
            $_SESSION['store'] = $newStore;

            $this->logAuth("Register", $data['email'], true, $start);

            return [
                'success' => true,
                'message' => 'Registration successful',
                'store' => $newStore,
            ];

        } catch (Exception $e) {
            $this->logAuth("Register", $data['email'], false, $start, $e->getMessage());
            return [
                'success' => false,
                'message' => 'Registration failed: ' . $e->getMessage(),
                'store' => null,
            ];
        }
    }

    public function logout()
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        if (isset($_SESSION['store'])) {
            unset($_SESSION['store']);
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
                'store' => null
            ];
        }

        return [
            'success' => false,
            'message' => 'No active session to destroy',
            'store' => null,
        ];
    }

    private function logAuth(string $action, string $email, bool $success, float $start, string $note = '')
    {
        $duration = round((microtime(true) - $start) * 1000, 2);
        app_log("Store $action attempt", [
            "email" => $email,
            "success" => $success,
            "duration_ms" => $duration,
            "note" => $note
        ]);
    }
}
