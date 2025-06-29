<?php

class ProductImage
{
    private mysqli $db;
    private string $table = 'product_images';

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function findByProductId(string $productId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE product_id = ?");
        $stmt->bind_param('s', $productId);

        if (!$stmt->execute()) {
            return [];
        }

        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function create(string $productId, string $imageUrl, bool $isPrimary = false): bool
    {
        if ($isPrimary) {
            $stmt = $this->db->prepare("UPDATE {$this->table} SET is_primary = FALSE WHERE product_id = ?");
            $stmt->bind_param('s', $productId);
            $stmt->execute();
        }

        $stmt = $this->db->prepare("
            INSERT INTO {$this->table} (product_id, image_url, is_primary) 
            VALUES (?, ?, ?)
        ");

        $isPrimaryInt = $isPrimary ? 1 : 0;

        $stmt->bind_param('ssi', $productId, $imageUrl, $isPrimaryInt);

        return $stmt->execute();
    }

    public function setPrimary(int $imageId, string $productId): bool
    {
        $stmt1 = $this->db->prepare("UPDATE {$this->table} SET is_primary = FALSE WHERE product_id = ?");
        $stmt1->bind_param('s', $productId);
        $stmt1->execute();

        $stmt2 = $this->db->prepare("UPDATE {$this->table} SET is_primary = TRUE WHERE id = ? AND product_id = ?");
        $stmt2->bind_param('is', $imageId, $productId);

        return $stmt2->execute();
    }

    public function delete(int $imageId): bool
    {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id = ?");
        $stmt->bind_param('i', $imageId);

        return $stmt->execute();
    }

    public function replaceForProduct(string $productId, array $images): void
    {
        $this->db->query("DELETE FROM product_images WHERE product_id = '$productId'");
        $stmt = $this->db->prepare("INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)");
        foreach ($images as $img) {
            $isPrimary = $img['is_primary'] ? 1 : 0;
            $stmt->bind_param('ssi', $productId, $img['image_url'], $isPrimary);
            $stmt->execute();
        }
    }

}
