<?php

class SessionManager
{
    private mysqli $db;
    private const SESSION_LIFETIME = 259200; // 3 days in seconds

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    /**
     * Get current session ID from cookie or generate new one
     */
    public function getSessionId(): string
    {
        $sessionName = session_name();

        if (isset($_COOKIE[$sessionName])) {
            return $_COOKIE[$sessionName];
        }


        return $this->generateSessionId();
    }

    /**
     * Generate a unique session ID
     */
    private function generateSessionId(): string
    {
        return bin2hex(random_bytes(32));
    }

    /**
     * Start or resume a session
     */
    public function startSession(?int $userId = null): void
    {
        $sessionId = $this->getSessionId();


        $this->cleanupExpiredSessions();


        $session = $this->getSessionData($sessionId);

        if ($session === null) {

            $this->createSession($sessionId, $userId);
        } else {

            $this->updateSessionExpiration($sessionId);
        }
    }

    /**
     * Get session data from database
     */
    public function getSessionData(string $sessionId): ?array
    {
        $stmt = $this->db->prepare("
            SELECT data, user_id 
            FROM sessions 
            WHERE id = ? AND expires_at > NOW()
        ");
        $stmt->bind_param("s", $sessionId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            $data = json_decode($row['data'], true);
            if ($row['user_id']) {
                $data['user_id'] = $row['user_id'];
            }
            return $data;
        }

        return null;
    }

    /**
     * Create a new session in database
     */
    private function createSession(string $sessionId, ?int $userId = null): void
    {
        $data = [];
        $expiresAt = date('Y-m-d H:i:s', time() + self::SESSION_LIFETIME);
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;

        $stmt = $this->db->prepare("
            INSERT INTO sessions (id, user_id, data, ip_address, user_agent, expires_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $dataJson = json_encode($data);
        $stmt->bind_param("sissss", $sessionId, $userId, $dataJson, $ipAddress, $userAgent, $expiresAt);
        $stmt->execute();
    }

    /**
     * Update session data
     */
    public function updateSession(string $sessionId, array $data): void
    {
        $expiresAt = date('Y-m-d H:i:s', time() + self::SESSION_LIFETIME);
        $dataJson = json_encode($data);

        $stmt = $this->db->prepare("
            UPDATE sessions 
            SET data = ?, expires_at = ?
            WHERE id = ? AND expires_at > NOW()
        ");
        $stmt->bind_param("sss", $dataJson, $expiresAt, $sessionId);
        $stmt->execute();
    }

    /**
     * Set user in session
     */
    public function setUser(string $sessionId, array $userData): void
    {
        $userId = $userData['id'] ?? null;


        $session = $this->getSessionData($sessionId);
        $data = $session ?? [];


        $data['user'] = $userData;


        $expiresAt = date('Y-m-d H:i:s', time() + self::SESSION_LIFETIME);
        $dataJson = json_encode($data);

        $stmt = $this->db->prepare("
            UPDATE sessions 
            SET data = ?, user_id = ?, expires_at = ?
            WHERE id = ?
        ");
        $stmt->bind_param("siss", $dataJson, $userId, $expiresAt, $sessionId);
        $stmt->execute();
    }

    /**
     * Get user from session
     */
    public function getUser(string $sessionId): ?array
    {
        $session = $this->getSessionData($sessionId);

        if ($session && isset($session['user'])) {
            return $session['user'];
        }

        return null;
    }

    /**
     * Clear user from session
     */
    public function clearUser(string $sessionId): void
    {
        $session = $this->getSessionData($sessionId);

        if ($session) {
            unset($session['user']);

            $dataJson = json_encode($session);

            $stmt = $this->db->prepare("
                UPDATE sessions 
                SET data = ?, user_id = NULL
                WHERE id = ?
            ");
            $stmt->bind_param("ss", $dataJson, $sessionId);
            $stmt->execute();
        }
    }

    /**
     * Destroy session
     */
    public function destroySession(string $sessionId): void
    {
        $stmt = $this->db->prepare("DELETE FROM sessions WHERE id = ?");
        $stmt->bind_param("s", $sessionId);
        $stmt->execute();
    }

    /**
     * Update session expiration time
     */
    private function updateSessionExpiration(string $sessionId): void
    {
        $expiresAt = date('Y-m-d H:i:s', time() + self::SESSION_LIFETIME);

        $stmt = $this->db->prepare("
            UPDATE sessions 
            SET expires_at = ?
            WHERE id = ? AND expires_at > NOW()
        ");
        $stmt->bind_param("ss", $expiresAt, $sessionId);
        $stmt->execute();
    }

    /**
     * Clean up expired sessions
     */
    public function cleanupExpiredSessions(): void
    {
        $stmt = $this->db->prepare("DELETE FROM sessions WHERE expires_at < NOW()");
        $stmt->execute();
    }

    /**
     * Destroy all sessions for a specific user
     */
    public function destroyUserSessions(int $userId): void
    {
        $stmt = $this->db->prepare("DELETE FROM sessions WHERE user_id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
    }
}
