<?php

require_once __DIR__ . '/../utils/generateHash.php';
require_once __DIR__ . '/Product.php';

class Wishlist
{
    private mysqli $db;
    private Product $productModel;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
        $this->productModel = new Product($db);
    }

    public function getItems(int $userId): array
    {
        $stmt = $this->db->prepare("
            SELECT w.product_id, w.added_at, p.*
            FROM wishlists w
            JOIN products p ON w.product_id = p.id
            WHERE w.user_id = ?
        ");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        $items = [];
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }

        return $items;
    }

    public function addItem(int $userId, string $productId): bool
    {
        $product = $this->productModel->findById($productId);
        if (!$product) {
            error_log("Wishlist: Product not found - $productId");
            return false;
        }

        $stmt = $this->db->prepare("INSERT IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)");
        $stmt->bind_param("is", $userId, $productId);
        return $stmt->execute();
    }

    public function removeItem(int $userId, string $productId): bool
    {
        $stmt = $this->db->prepare("DELETE FROM wishlists WHERE user_id = ? AND product_id = ?");
        $stmt->bind_param("is", $userId, $productId);
        return $stmt->execute();
    }

    public function clear(int $userId): bool
    {
        $stmt = $this->db->prepare("DELETE FROM wishlists WHERE user_id = ?");
        $stmt->bind_param("i", $userId);
        return $stmt->execute();
    }

    public function isInWishlist(int $userId, string $productId): bool
    {
        $stmt = $this->db->prepare("SELECT 1 FROM wishlists WHERE user_id = ? AND product_id = ?");
        $stmt->bind_param("is", $userId, $productId);
        $stmt->execute();
        $result = $stmt->get_result();

        return (bool) $result->fetch_row();
    }
}
