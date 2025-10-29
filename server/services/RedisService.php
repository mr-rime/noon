<?php

class RedisService
{
    private $redis = null;
    private static ?RedisService $instance = null;
    private string $prefix = 'noon:';
    private static bool $disabled = false;

    private function __construct()
    {
        $this->loadPredis();
        $enabled = ($_ENV['REDIS_ENABLED'] ?? getenv('REDIS_ENABLED') ?? 'true') === 'true';
        if ($enabled) {
            $this->connect();
        } else {
            self::$disabled = true;
        }
    }

    private function loadPredis(): void
    {

        if (!class_exists('Predis\\Client')) {
            $autoloadPath = __DIR__ . '/../../vendor/autoload.php';
            if (file_exists($autoloadPath)) {
                require_once $autoloadPath;
            } else {
                $autoloadPath = __DIR__ . '/../vendor/autoload.php';
                if (file_exists($autoloadPath)) {
                    require_once $autoloadPath;
                }
            }
        }
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function connect(): void
    {
        if (self::$disabled) {
            $this->redis = null;
            return;
        }

        try {
            $host = $_ENV['REDIS_HOST'] ?? getenv('REDIS_HOST') ?? '127.0.0.1';
            $port = (int) ($_ENV['REDIS_PORT'] ?? getenv('REDIS_PORT') ?? 6379);


            if ($host === 'redis' && !$this->isDockerEnvironment()) {
                $host = '127.0.0.1';
            }

            if (!class_exists('Predis\\Client')) {
                error_log("Predis class not found - Redis caching disabled");
                $this->redis = null;
                return;
            }

            $this->redis = new \Predis\Client([
                'scheme' => 'tcp',
                'host' => $host,
                'port' => $port,
                'timeout' => 0.05,
            ], [
                'prefix' => $this->prefix,
            ]);


            $this->redis->ping();

        } catch (Exception $e) {
            self::$disabled = true;
            $this->redis = null;
        }
    }

    private function isDockerEnvironment(): bool
    {

        return getenv('DOCKER_CONTAINER') !== false ||
            getenv('REDIS_HOST') === 'redis' ||
            file_exists('/.dockerenv');
    }

    public function isConnected(): bool
    {
        return $this->redis !== null;
    }

    public function getClient()
    {
        return $this->redis;
    }


    public function get(string $key, ?callable $callback = null): mixed
    {
        if ($this->redis === null) {
            $this->connect();
        }

        if (!$this->isConnected()) {
            return $callback ? $callback() : null;
        }

        try {
            $value = $this->redis->get($key);
            if ($value !== null && $value !== false) {
                return json_decode($value, true);
            }

            if ($callback) {
                $value = $callback();
                $this->set($key, $value);
                return $value;
            }

            return null;
        } catch (Exception $e) {
            error_log("Redis get error: " . $e->getMessage());
            return $callback ? $callback() : null;
        }
    }


    public function set(string $key, mixed $value, ?int $ttl = null): bool
    {
        if (!$this->isConnected()) {
            return false;
        }

        try {
            $serialized = json_encode($value);
            if ($ttl !== null && $ttl > 0) {
                $this->redis->setex($key, $ttl, $serialized);
                return true;
            }
            $this->redis->set($key, $serialized);
            return true;
        } catch (Exception $e) {
            error_log("Redis set error: " . $e->getMessage());
            return false;
        }
    }


    public function delete(string $key): bool
    {
        if (!$this->isConnected()) {
            return false;
        }

        try {
            $result = $this->redis->del([$key]);
            return $result > 0;
        } catch (Exception $e) {
            error_log("Redis delete error: " . $e->getMessage());
            return false;
        }
    }


    public function deleteMultiple(array $keys): bool
    {
        if (!$this->isConnected() || empty($keys)) {
            return false;
        }

        try {
            $result = $this->redis->del($keys);
            return $result > 0;
        } catch (Exception $e) {
            error_log("Redis deleteMultiple error: " . $e->getMessage());
            return false;
        }
    }


    public function exists(string $key): bool
    {
        if (!$this->isConnected()) {
            return false;
        }

        try {
            return $this->redis->exists($key) > 0;
        } catch (Exception $e) {
            return false;
        }
    }


    public function increment(string $key, int $value = 1): int|false
    {
        if (!$this->isConnected()) {
            return false;
        }

        try {
            return $this->redis->incrby($key, $value);
        } catch (Exception $e) {
            error_log("Redis increment error: " . $e->getMessage());
            return false;
        }
    }


    public function remember(string $key, int $ttl, callable $callback): mixed
    {
        return $this->get($key, function () use ($key, $ttl, $callback) {
            $value = $callback();
            $this->set($key, $value, $ttl);
            return $value;
        });
    }


    public function flush(): bool
    {
        if (!$this->isConnected()) {
            return false;
        }

        try {
            $this->redis->flushdb();
            return true;
        } catch (Exception $e) {
            error_log("Redis flush error: " . $e->getMessage());
            return false;
        }
    }


    public function getKeys(string $pattern): array
    {
        if (!$this->isConnected()) {
            return [];
        }

        try {
            return $this->redis->keys($pattern);
        } catch (Exception $e) {
            error_log("Redis keys error: " . $e->getMessage());
            return [];
        }
    }


    public function clearPattern(string $pattern): int
    {
        if (!$this->isConnected()) {
            return 0;
        }

        try {
            $keys = $this->redis->keys($pattern);
            if (empty($keys)) {
                return 0;
            }
            return $this->redis->del($keys);
        } catch (Exception $e) {
            error_log("Redis clearPattern error: " . $e->getMessage());
            return 0;
        }
    }


    public function expire(string $key, int $ttl): bool
    {
        if (!$this->isConnected()) {
            return false;
        }

        try {
            return $this->redis->expire($key, $ttl);
        } catch (Exception $e) {
            return false;
        }
    }
}
