<?php

require_once __DIR__ . '/RedisService.php';

class CacheManager
{
    private RedisService $redis;

    public function __construct()
    {
        $this->redis = RedisService::getInstance();
    }


    public function getProduct(string $productId, callable $callback): array
    {
        $cacheKey = "product:{$productId}";
        return $this->redis->remember($cacheKey, 3600, $callback);
    }

    public function invalidateProduct(string $productId): void
    {
        $this->redis->delete("product:{$productId}");
        $this->redis->delete("products:list");
    }


    public function getProductsList(string $cacheKey, callable $callback): array
    {
        return $this->redis->remember($cacheKey, 1800, $callback);
    }

    public function invalidateProductsList(): void
    {
        $this->redis->clearPattern("products:*");
    }


    public function getCategory(string $categoryId, callable $callback): array
    {
        $cacheKey = "category:{$categoryId}";
        return $this->redis->remember($cacheKey, 3600, $callback);
    }

    public function getCategoriesTree(callable $callback): array
    {
        $cacheKey = "categories:tree";
        return $this->redis->remember($cacheKey, 1800, $callback);
    }

    public function invalidateCategory(string $categoryId): void
    {
        $this->redis->delete("category:{$categoryId}");
        $this->redis->delete("categories:tree");
        $this->redis->delete("categories:list");
    }


    public function getCart(string $cartId, callable $callback): array
    {
        $cacheKey = "cart:{$cartId}";
        return $this->redis->remember($cacheKey, 600, $callback);
    }

    public function invalidateCart(string $cartId): void
    {
        $this->redis->delete("cart:{$cartId}");
    }


    public function getUser(int $userId, callable $callback): array
    {
        $cacheKey = "user:{$userId}";
        return $this->redis->remember($cacheKey, 1800, $callback);
    }

    public function invalidateUser(int $userId): void
    {
        $this->redis->delete("user:{$userId}");
    }


    public function remember(string $key, int $ttl, callable $callback): mixed
    {
        return $this->redis->remember($key, $ttl, $callback);
    }

    public function put(string $key, mixed $value, int $ttl = 3600): bool
    {
        return $this->redis->set($key, $value, $ttl);
    }

    public function get(string $key): mixed
    {
        return $this->redis->get($key);
    }

    public function forget(string $key): bool
    {
        return $this->redis->delete($key);
    }

    public function flush(): bool
    {
        return $this->redis->flush();
    }


    public function clearProducts(): void
    {
        $this->redis->clearPattern("product:*");
        $this->redis->clearPattern("products:*");
    }

    public function clearCategories(): void
    {
        $this->redis->clearPattern("category:*");
        $this->redis->clearPattern("categories:*");
    }

    public function clearCarts(): void
    {
        $this->redis->clearPattern("cart:*");
    }

    public function clearUsers(): void
    {
        $this->redis->clearPattern("user:*");
    }

    public function clearAll(): void
    {
        $this->redis->flush();
    }
}
