<?php

require_once __DIR__ . '/../models/Store.php';
require_once __DIR__ . '/../log/logger.php';
require_once __DIR__ . '/../models/SessionManager.php';

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


        $sessionManager = new SessionManager($this->db);
        $sessionId = $sessionManager->getSessionId();
        error_log('StoreAuthService.login: session id before start ' . json_encode([
            'session_name' => session_name(),
            'session_id_prefix' => substr((string) $sessionId, 0, 8)
        ]));
        $sessionManager->startSession(null);
        unset($currentStore['password']);
        $sessionManager->setStore($sessionId, $currentStore);
        error_log('StoreAuthService.login: store set ' . json_encode([
            'session_id_prefix' => substr((string) $sessionId, 0, 8),
            'store_id' => $currentStore['id'] ?? null
        ]));

        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
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


        if (empty($data['email']) || empty($data['password']) || empty($data['name'])) {
            return [
                'success' => false,
                'message' => 'Store name, email and password are required',
                'store' => null,
            ];
        }

        try {

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


            // Create DB-backed session and cookie
            $sessionManager = new SessionManager($this->db);
            $sessionId = $sessionManager->getSessionId();
            error_log('StoreAuthService.register: session id before start ' . json_encode([
                'session_name' => session_name(),
                'session_id_prefix' => substr((string) $sessionId, 0, 8)
            ]));
            $sessionManager->startSession(null);
            $sessionManager->setStore($sessionId, $newStore);
            error_log('StoreAuthService.register: store set ' . json_encode([
                'session_id_prefix' => substr((string) $sessionId, 0, 8),
                'store_id' => $newStore['id'] ?? null
            ]));

            // Maintain PHP session for backward compatibility
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
        // Clear DB-backed session store data
        $sessionManager = new SessionManager($this->db);
        $sessionId = $sessionManager->getSessionId();
        error_log('StoreAuthService.logout: clearing store ' . json_encode([
            'session_id_prefix' => substr((string) $sessionId, 0, 8)
        ]));
        $sessionManager->clearStore($sessionId);

        // Maintain PHP session cleanup
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
        if (isset($_SESSION['store'])) {
            unset($_SESSION['store']);
        }

        return [
            'success' => true,
            'message' => 'Logged out successfully',
            'store' => null
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
