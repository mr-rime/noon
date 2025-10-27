<?php

require_once __DIR__ . '/../utils/generateHash.php';
require_once __DIR__ . '/Product.php';
require_once __DIR__ . '/../services/CacheManager.php';

class Cart
{
    private mysqli $db;
    private Product $productModel;
    private CacheManager $cache;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
        $this->productModel = new Product($db);
        $this->cache = new CacheManager();
    }

    private function isGuest(?int $userId): bool
    {
        return !$userId || !isset($_SESSION['user']);
    }


    private function generateGuestCartId(): string
    {

        $sessionId = session_id();
        if ($sessionId) {
            return 'guest_' . substr(md5($sessionId), 0, 16);
        }


        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
        return 'guest_' . substr(md5($ip . $userAgent), 0, 16);
    }

    public function getCartItems(?int $userId): array
    {
        $this->cleanupExpiredGuestCarts();

        if (!$this->isGuest($userId)) {
            $cacheKey = "cart:user:{$userId}";
            return $this->cache->getCart($cacheKey, function () use ($userId) {
                return $this->getCartItemsFromDatabase($userId);
            });
        } else {
            $guestCartId = $this->generateGuestCartId();
            $cacheKey = "cart:guest:{$guestCartId}";
            return $this->cache->getCart($cacheKey, function () {
                return $this->getCartItemsFromGuestCart();
            });
        }
    }

    private function getCartItemsFromDatabase(int $userId): array
    {
        $cartId = $this->getOrCreateCart($userId);

        $query = "
            SELECT ci.*, p.name, p.stock, p.price as original_price, p.currency, p.id as product_id
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = ?
        ";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param("s", $cartId);
        $stmt->execute();
        $result = $stmt->get_result();

        $items = [];
        while ($row = $result->fetch_assoc()) {
            $product = $this->productModel->findById($row['product_id']);
            $items[] = [
                'id' => $row['id'],
                'product_id' => $row['product_id'],
                'name' => $row['name'],
                'quantity' => (int) $row['quantity'],
                'currency' => $row['currency'],
                'price' => (float) $row['price'],
                'final_price' => $product['final_price'] ?? $row['price'],
                'discount_percentage' => $product['discount_percentage'] ?? null,
                'images' => $product['images'] ?? [],
                'stock' => (int) $product['stock'],
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at']
            ];
        }

        return $items;
    }

    private function getCartItemsFromGuestCart(): array
    {
        $guestCartId = $this->generateGuestCartId();
        $cartId = $this->getOrCreateGuestCart($guestCartId);

        $query = "
            SELECT ci.*, p.name, p.stock, p.price as original_price, p.currency, p.id as product_id
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = ?
        ";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param("s", $cartId);
        $stmt->execute();
        $result = $stmt->get_result();

        $items = [];
        while ($row = $result->fetch_assoc()) {
            $product = $this->productModel->findById($row['product_id']);
            $items[] = [
                'id' => $row['id'],
                'product_id' => $row['product_id'],
                'name' => $row['name'],
                'quantity' => (int) $row['quantity'],
                'currency' => $row['currency'],
                'price' => (float) $row['price'],
                'final_price' => $product['final_price'] ?? $row['price'],
                'discount_percentage' => $product['discount_percentage'] ?? null,
                'images' => $product['images'] ?? [],
                'stock' => (int) $product['stock'],
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at']
            ];
        }

        return $items;
    }

    public function addItem(?int $userId, string $productId, int $quantity): ?array
    {
        if ($quantity <= 0)
            return null;

        $product = $this->productModel->findById($productId);
        if (!$product)
            return null;

        if ($product['stock'] < $quantity)
            return null;

        if ($this->isGuest($userId)) {
            $guestCartId = $this->generateGuestCartId();
            $cartId = $this->getOrCreateGuestCart($guestCartId);
        } else {
            $cartId = $this->getOrCreateCart($userId);
        }

        $price = $product['final_price'] ?? $product['price'];
        $currency = $product['currency'];

        $check = $this->db->prepare("SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?");
        $check->bind_param("ss", $cartId, $productId);
        $check->execute();
        $result = $check->get_result();

        if ($row = $result->fetch_assoc()) {
            $newQuantity = $row['quantity'] + $quantity;
            $update = $this->db->prepare("UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $update->bind_param("is", $newQuantity, $row['id']);
            $update->execute();
        } else {
            $id = generateHash();
            $insert = $this->db->prepare("
                INSERT INTO cart_items (id, cart_id, product_id, quantity, price, currency)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $insert->bind_param("sssids", $id, $cartId, $productId, $quantity, $price, $currency);
            $insert->execute();
        }

        $items = $this->getCartItems($userId);


        if ($this->isGuest($userId)) {
            $guestCartId = $this->generateGuestCartId();
            $this->cache->invalidateCart("cart:guest:{$guestCartId}");
        } else {
            $this->cache->invalidateCart("cart:user:{$userId}");
        }

        return $items;
    }

    public function updateItemQuantity(?int $userId, string $productId, int $newQuantity): bool
    {
        if ($newQuantity < 1)
            return false;

        if ($this->isGuest($userId)) {
            $guestCartId = $this->generateGuestCartId();
            $cartId = $this->getOrCreateGuestCart($guestCartId);
        } else {
            $cartId = $this->getOrCreateCart($userId);
        }

        $stmt = $this->db->prepare("UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE cart_id = ? AND product_id = ?");
        $result = $stmt->execute();

        if ($result) {

            if ($this->isGuest($userId)) {
                $guestCartId = $this->generateGuestCartId();
                $this->cache->invalidateCart("cart:guest:{$guestCartId}");
            } else {
                $this->cache->invalidateCart("cart:user:{$userId}");
            }
        }

        return $result;
    }

    public function removeItem(?int $userId, string $productId): bool
    {
        if ($this->isGuest($userId)) {
            $guestCartId = $this->generateGuestCartId();
            $cartId = $this->getOrCreateGuestCart($guestCartId);
        } else {
            $cartId = $this->getOrCreateCart($userId);
        }

        $stmt = $this->db->prepare("DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?");
        $result = $stmt->execute();

        if ($result) {

            if ($this->isGuest($userId)) {
                $guestCartId = $this->generateGuestCartId();
                $this->cache->invalidateCart("cart:guest:{$guestCartId}");
            } else {
                $this->cache->invalidateCart("cart:user:{$userId}");
            }
        }

        return $result;
    }

    public function clearCart(?int $userId): bool
    {
        if ($this->isGuest($userId)) {
            $guestCartId = $this->generateGuestCartId();
            $cartId = $this->getOrCreateGuestCart($guestCartId);
        } else {
            $cartId = $this->getOrCreateCart($userId);
        }

        $stmt = $this->db->prepare("DELETE FROM cart_items WHERE cart_id = ?");
        $result = $stmt->execute();

        if ($result) {

            if ($this->isGuest($userId)) {
                $guestCartId = $this->generateGuestCartId();
                $this->cache->invalidateCart("cart:guest:{$guestCartId}");
            } else {
                $this->cache->invalidateCart("cart:user:{$userId}");
            }
        }

        return $result;
    }

    public function deleteCart(int $userId): bool
    {
        $cartId = $this->getOrCreateCart($userId);
        $stmt = $this->db->prepare("DELETE FROM carts WHERE id = ?");
        $stmt->bind_param("s", $cartId);
        return $stmt->execute();
    }

    public function mergeGuestCartWithUserCart(int $userId): void
    {
        $guestCartId = $this->generateGuestCartId();
        $guestCartId = $this->getOrCreateGuestCart($guestCartId);


        $guestItems = $this->getCartItemsFromGuestCart();

        if (empty($guestItems)) {
            return;
        }


        foreach ($guestItems as $item) {
            $this->addItem($userId, $item['product_id'], $item['quantity']);
        }


        $this->clearGuestCart($guestCartId);
    }

    private function getOrCreateCart(int $userId): string
    {
        $stmt = $this->db->prepare("SELECT id FROM carts WHERE user_id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            return $row['id'];
        }

        $cartId = generateHash();
        $insert = $this->db->prepare("INSERT INTO carts (id, user_id) VALUES (?, ?)");
        $insert->bind_param("si", $cartId, $userId);
        $insert->execute();

        return $cartId;
    }

    private function getOrCreateGuestCart(string $guestCartId): string
    {
        $stmt = $this->db->prepare("SELECT id FROM carts WHERE guest_cart_id = ? AND is_guest_cart = 1");
        $stmt->bind_param("s", $guestCartId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {

            $update = $this->db->prepare("UPDATE carts SET expires_at = DATE_ADD(NOW(), INTERVAL 7 DAY) WHERE id = ?");
            $update->bind_param("s", $row['id']);
            $update->execute();
            return $row['id'];
        }

        $cartId = generateHash();
        $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));
        $insert = $this->db->prepare("INSERT INTO carts (id, guest_cart_id, is_guest_cart, expires_at) VALUES (?, ?, 1, ?)");
        $insert->bind_param("sss", $cartId, $guestCartId, $expiresAt);
        $insert->execute();

        return $cartId;
    }

    private function clearGuestCart(string $cartId): void
    {
        $stmt = $this->db->prepare("DELETE FROM cart_items WHERE cart_id = ?");
        $stmt->bind_param("s", $cartId);
        $stmt->execute();
    }

    private function cleanupExpiredGuestCarts(): void
    {
        $stmt = $this->db->prepare("DELETE FROM carts WHERE is_guest_cart = 1 AND expires_at < NOW()");
        $stmt->execute();
    }
}
