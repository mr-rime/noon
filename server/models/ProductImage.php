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
        if (!$stmt) {
            error_log("Prepare failed (findByProductId): " . $this->db->error);
            return [];
        }

        $stmt->bind_param('s', $productId);

        if (!$stmt->execute()) {
            error_log("Execute failed (findByProductId): " . $stmt->error);
            return [];
        }

        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function create(string $productId, string $imageUrl, bool $isPrimary = false): bool
    {
        // Unset primary if needed
        if ($isPrimary && !$this->unsetPrimary($productId)) {
            return false;
        }

        $stmt = $this->db->prepare("
            INSERT INTO {$this->table} (product_id, image_url, is_primary) 
            VALUES (?, ?, ?)
        ");

        if (!$stmt) {
            error_log("Prepare failed (create): " . $this->db->error);
            return false;
        }

        $isPrimaryInt = $isPrimary ? 1 : 0;
        $stmt->bind_param('ssi', $productId, $imageUrl, $isPrimaryInt);

        return $stmt->execute();
    }

    public function setPrimary(int $imageId, string $productId): bool
    {
        if (!$this->unsetPrimary($productId)) {
            return false;
        }

        $stmt = $this->db->prepare("UPDATE {$this->table} SET is_primary = TRUE WHERE id = ? AND product_id = ?");
        if (!$stmt) {
            error_log("Prepare failed (setPrimary): " . $this->db->error);
            return false;
        }

        $stmt->bind_param('is', $imageId, $productId);
        return $stmt->execute();
    }

    public function delete(int $imageId): bool
    {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id = ?");
        if (!$stmt) {
            error_log("Prepare failed (delete): " . $this->db->error);
            return false;
        }

        $stmt->bind_param('i', $imageId);
        return $stmt->execute();
    }

    public function replaceForProduct(string $productId, array $images): void
    {
        // Delete images safely using prepared statement
        $delStmt = $this->db->prepare("DELETE FROM {$this->table} WHERE product_id = ?");
        if ($delStmt) {
            $delStmt->bind_param('s', $productId);
            $delStmt->execute();
        } else {
            error_log("Prepare failed (replaceForProduct - delete): " . $this->db->error);
            return;
        }

        $insStmt = $this->db->prepare("INSERT INTO {$this->table} (product_id, image_url, is_primary) VALUES (?, ?, ?)");
        if (!$insStmt) {
            error_log("Prepare failed (replaceForProduct - insert): " . $this->db->error);
            return;
        }

        foreach ($images as $img) {
            $isPrimary = !empty($img['is_primary']) ? 1 : 0;
            $insStmt->bind_param('ssi', $productId, $img['image_url'], $isPrimary);
            $insStmt->execute();
        }
    }

    private function unsetPrimary(string $productId): bool
    {
        $stmt = $this->db->prepare("UPDATE {$this->table} SET is_primary = FALSE WHERE product_id = ?");
        if (!$stmt) {
            error_log("Prepare failed (unsetPrimary): " . $this->db->error);
            return false;
        }

        $stmt->bind_param('s', $productId);
        return $stmt->execute();
    }
}
