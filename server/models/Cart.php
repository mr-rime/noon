<?php

require_once __DIR__ . '/../utils/generateHash.php';
require_once __DIR__ . '/Product.php';

class Cart
{
    private mysqli $db;
    private Product $productModel;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
        $this->productModel = new Product($db);

        if (!isset($_SESSION['guest_cart'])) {
            $_SESSION['guest_cart'] = []; // [productId => quantity]
        }
    }

    private function isGuest(?int $userId): bool
    {
        return !$userId || !isset($_SESSION['user']);
    }

    public function getCartItems(?int $userId): array
    {
        return $this->isGuest($userId)
            ? $this->getCartItemsFromSession()
            : $this->getCartItemsFromDatabase($userId);
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

    private function getCartItemsFromSession(): array
    {
        $items = [];

        foreach ($_SESSION['guest_cart'] as $productId => $quantity) {
            $product = $this->productModel->findById($productId);
            if (!$product)
                continue;

            $items[] = [
                'product_id' => $productId,
                'name' => $product['name'],
                'quantity' => $quantity,
                'currency' => $product['currency'],
                'price' => $product['price'],
                'final_price' => $product['final_price'],
                'discount_percentage' => $product['discount_percentage'],
                'images' => $product['images'] ?? [],
                'stock' => $product['stock'],
            ];
        }

        return $items;
    }

    public function addItem(?int $userId, string $productId, int $quantity): ?array
    {
        if ($quantity <= 0)
            return null;

        $product = $this->productModel->findById($productId);
        if (!$product || $product['stock'] < $quantity)
            return null;

        if ($this->isGuest($userId)) {
            $_SESSION['guest_cart'][$productId] = ($_SESSION['guest_cart'][$productId] ?? 0) + $quantity;
            return $this->getCartItemsFromSession();
        }

        $cartId = $this->getOrCreateCart($userId);

        $price = $product['final_price'] ?? $product['price'];
        $currency = $product['currency'];

        // Check if item exists
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

        return $this->getCartItemsFromDatabase($userId);
    }

    public function updateItemQuantity(?int $userId, string $productId, int $newQuantity): bool
    {
        if ($newQuantity < 1)
            return false;

        if ($this->isGuest($userId)) {
            if (isset($_SESSION['guest_cart'][$productId])) {
                $_SESSION['guest_cart'][$productId] = $newQuantity;
                return true;
            }
            return false;
        }

        $cartId = $this->getOrCreateCart($userId);
        $stmt = $this->db->prepare("UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE cart_id = ? AND product_id = ?");
        $stmt->bind_param("iss", $newQuantity, $cartId, $productId);
        return $stmt->execute();
    }

    public function removeItem(?int $userId, string $productId): bool
    {
        if ($this->isGuest($userId)) {
            unset($_SESSION['guest_cart'][$productId]);
            return true;
        }

        $cartId = $this->getOrCreateCart($userId);
        $stmt = $this->db->prepare("DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?");
        $stmt->bind_param("ss", $cartId, $productId);
        return $stmt->execute();
    }

    public function clearCart(?int $userId): bool
    {
        if ($this->isGuest($userId)) {
            $_SESSION['guest_cart'] = [];
            return true;
        }

        $cartId = $this->getOrCreateCart($userId);
        $stmt = $this->db->prepare("DELETE FROM cart_items WHERE cart_id = ?");
        $stmt->bind_param("s", $cartId);
        return $stmt->execute();
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
        foreach ($_SESSION['guest_cart'] as $productId => $quantity) {
            $this->addItem($userId, $productId, $quantity);
        }

        $_SESSION['guest_cart'] = [];
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
}
