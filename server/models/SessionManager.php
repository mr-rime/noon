<?php

require_once __DIR__ . '/../services/RedisService.php';

class SessionManager
{
    private mysqli $db;
    private RedisService $redis;
    private const SESSION_LIFETIME = 259200;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
        $this->redis = RedisService::getInstance();
    }


    public function getSessionId(): string
    {
        $sessionName = session_name();
        error_log('SessionManager.getSessionId: using session name ' . $sessionName);

        if (isset($_COOKIE[$sessionName])) {
            return $_COOKIE[$sessionName];
        }


        $newId = $this->generateSessionId();
        error_log('SessionManager.getSessionId: no cookie found, generated id ' . substr($newId, 0, 8) . '...');
        return $newId;
    }


    private function generateSessionId(): string
    {
        return bin2hex(random_bytes(32));
    }


    public function startSession(?int $userId = null): void
    {
        $sessionId = $this->getSessionId();
        $sessionName = session_name();
        error_log('SessionManager.startSession: ensuring cookie ' . json_encode([
            'session_name' => $sessionName,
            'id_prefix' => substr($sessionId, 0, 8)
        ]));

        if (!isset($_COOKIE[$sessionName])) {
            $cookieParams = session_get_cookie_params();

            setcookie(
                $sessionName,
                $sessionId,
                [
                    'expires' => time() + self::SESSION_LIFETIME,
                    'path' => $cookieParams['path'] ?: '/',
                    'domain' => $cookieParams['domain'] ?: '',
                    'secure' => (bool) $cookieParams['secure'],
                    'httponly' => true,
                    'samesite' => $cookieParams['samesite'] ?: 'Lax',
                ]
            );
            $_COOKIE[$sessionName] = $sessionId;
            error_log('SessionManager.startSession: cookie set');
        }


        $this->cleanupExpiredSessions();


        $session = $this->getSessionData($sessionId);
        error_log('SessionManager.setStore: current session data keys ' . json_encode(array_keys($session ?? [])));

        if ($session === null) {

            $this->createSession($sessionId, $userId);
        } else {

            $this->updateSessionExpiration($sessionId);
        }
    }


    public function getSessionData(string $sessionId): ?array
    {

        $cacheKey = "session:{$sessionId}";
        $session = $this->redis->get($cacheKey);

        if ($session !== null) {
            return $session;
        }


        $stmt = $this->db->prepare("
            SELECT data, user_id, expires_at
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


            $ttl = max(1, strtotime($row['expires_at']) - time());
            $this->redis->set($cacheKey, $data, $ttl);

            return $data;
        }

        return null;
    }


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


        $cacheKey = "session:{$sessionId}";
        $this->redis->set($cacheKey, $data, self::SESSION_LIFETIME);
        error_log('SessionManager.setStore: store saved ' . json_encode([
            'id_prefix' => substr($sessionId, 0, 8)
        ]));
    }


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


        $cacheKey = "session:{$sessionId}";
        $this->redis->set($cacheKey, $data, self::SESSION_LIFETIME);
    }


    public function setStore(string $sessionId, array $storeData): void
    {
        $session = $this->getSessionData($sessionId);
        $data = $session ?? [];

        $data['store'] = $storeData;

        $expiresAt = date('Y-m-d H:i:s', time() + self::SESSION_LIFETIME);
        $dataJson = json_encode($data);

        $stmt = $this->db->prepare("
            UPDATE sessions 
            SET data = ?, expires_at = ?
            WHERE id = ?
        ");
        $stmt->bind_param("sss", $dataJson, $expiresAt, $sessionId);
        $stmt->execute();

        $cacheKey = "session:{$sessionId}";
        $this->redis->set($cacheKey, $data, self::SESSION_LIFETIME);
    }


    public function getStore(string $sessionId): ?array
    {
        $session = $this->getSessionData($sessionId);
        error_log('SessionManager.getStore: data present ' . json_encode([
            'has_session' => (bool) $session,
            'keys' => $session ? array_keys($session) : []
        ]));

        if ($session && isset($session['store'])) {
            return $session['store'];
        }

        return null;
    }


    public function clearStore(string $sessionId): void
    {
        $session = $this->getSessionData($sessionId);

        if ($session) {
            unset($session['store']);

            $dataJson = json_encode($session);

            $stmt = $this->db->prepare("
                UPDATE sessions 
                SET data = ?
                WHERE id = ?
            ");
            $stmt->bind_param("ss", $dataJson, $sessionId);
            $stmt->execute();

            $cacheKey = "session:{$sessionId}";
            $this->redis->set($cacheKey, $session, self::SESSION_LIFETIME);
        }
    }


    public function getUser(string $sessionId): ?array
    {
        $session = $this->getSessionData($sessionId);

        if ($session && isset($session['user'])) {
            return $session['user'];
        }

        return null;
    }


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


            $cacheKey = "session:{$sessionId}";
            $this->redis->set($cacheKey, $session, self::SESSION_LIFETIME);
        }
    }


    public function destroySession(string $sessionId): void
    {
        $stmt = $this->db->prepare("DELETE FROM sessions WHERE id = ?");
        $stmt->bind_param("s", $sessionId);
        $stmt->execute();


        $cacheKey = "session:{$sessionId}";
        $this->redis->delete($cacheKey);
    }


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


    public function cleanupExpiredSessions(): void
    {
        $stmt = $this->db->prepare("DELETE FROM sessions WHERE expires_at < NOW()");
        $stmt->execute();
    }


    public function destroyUserSessions(int $userId): void
    {
        $stmt = $this->db->prepare("DELETE FROM sessions WHERE user_id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
    }
}
