<?php

class ProductVariant
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function create(string $productId, string $sku, array $optionCombination, ?float $price, ?int $stock, ?string $imageUrl): ?array
    {
        $stmt = $this->db->prepare('INSERT INTO product_variants (product_id, sku, option_combination, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)');
        if (!$stmt) {
            error_log('Prepare failed (variant create): ' . $this->db->error);
            return null;
        }

        $json = json_encode($optionCombination, JSON_UNESCAPED_UNICODE);
        $priceParam = $price !== null ? $price : null;
        $stockParam = $stock !== null ? $stock : null;
        $imageParam = $imageUrl !== null ? $imageUrl : null;

        $stmt->bind_param('sssdis', $productId, $sku, $json, $priceParam, $stockParam, $imageParam);
        if (!$stmt->execute()) {
            error_log('Execute failed (variant create): ' . $stmt->error);
            return null;
        }

        return $this->findById($stmt->insert_id);
    }

    public function findByProductId(string $productId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM product_variants WHERE product_id = ?');
        if (!$stmt) {
            return [];
        }
        $stmt->bind_param('s', $productId);
        $stmt->execute();
        $res = $stmt->get_result();
        $rows = $res->fetch_all(MYSQLI_ASSOC);
        return $rows;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM product_variants WHERE id = ? LIMIT 1');
        if (!$stmt) {
            return null;
        }
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $res = $stmt->get_result();
        return $res->fetch_assoc() ?: null;
    }
}


