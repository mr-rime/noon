<?php

require_once __DIR__ . '/../utils/generateHash.php';
require_once __DIR__ . '/Product.php';
require_once __DIR__ . '/ProductImage.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\NestedValidationException;

class Wishlist
{
    private mysqli $db;
    private Product $productModel;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
        $this->productModel = new Product($db);
    }

    public function create(string $user_id, string $name): string
    {
        $userIdValidator = v::stringType()->notEmpty()->alnum()->length(1, 36);
        $nameValidator = v::stringType()->notEmpty()->length(1, 255);

        try {
            $userIdValidator->assert($user_id);
            $nameValidator->assert($name);
        } catch (NestedValidationException $e) {
            throw new Exception("Validation failed: " . $e->getFullMessage());
        }


        $stmt = $this->db->prepare("SELECT id FROM wishlists WHERE user_id = ? AND name = ?");
        $stmt->bind_param("ss", $user_id, $name);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            $stmt->close();
            throw new Exception('Wishlist with the same name already exists.');
        }
        $stmt->close();

        $id = generateHash();
        $stmt = $this->db->prepare("INSERT INTO wishlists (id, user_id, name) VALUES (?, ?, ?)");
        $nameStr = strval($name);
        $stmt->bind_param('sss', $id, $user_id, $nameStr);
        $success = $stmt->execute();
        $stmt->close();

        if (!$success) {
            throw new Exception('Failed to create wishlist.');
        }

        return $id;
    }

    public function getItems(int $userId, string $wishlistId): array
    {
        $wishlistIdValidator = v::stringType()->notEmpty()->length(1, 21);
        try {
            $wishlistIdValidator->assert($wishlistId);
        } catch (NestedValidationException $e) {
            error_log("Validation failed in getItems(): " . $e->getFullMessage());
            return [];
        }

        $stmt = $this->db->prepare("
        SELECT wi.product_id, wi.added_at, p.*
        FROM wishlist_items wi
        JOIN products p ON wi.product_id = p.id
        JOIN wishlists w ON wi.wishlist_id = w.id
        WHERE w.user_id = ? AND w.id = ?
    ");

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return [];
        }

        $stmt->bind_param("is", $userId, $wishlistId);
        $stmt->execute();
        $result = $stmt->get_result();

        $items = [];
        $imageModel = new ProductImage($this->db);
        $productModel = new Product($this->db);

        while ($row = $result->fetch_assoc()) {
            $row['images'] = $imageModel->findByProductId($row['id']);

            $productModel->attachDiscountData($row, $row['price']);

            unset($row['discount']);

            $items[] = $row;
        }

        return $items;
    }

    public function getWishlists(int $userId): array
    {
        $stmt = $this->db->prepare('
        SELECT w.*, COUNT(wi.product_id) AS item_count
        FROM wishlists w
        LEFT JOIN wishlist_items wi ON wi.wishlist_id = w.id
        WHERE w.user_id = ?
        GROUP BY w.id ORDER BY w.is_default DESC
    ');

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return [];
        }

        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $wishlists = $result->fetch_all(MYSQLI_ASSOC);

        return $wishlists;
    }

    public function addItemToDefault(int $userId, string $productId): bool
    {
        if (!v::intVal()->min(1)->validate($userId)) {
            throw new Exception("Invalid user ID");
        }
        if (!v::stringType()->notEmpty()->length(1, 36)->validate($productId)) {
            throw new Exception("Invalid product ID");
        }

        $stmt = $this->db->prepare("
        SELECT id FROM wishlists 
        WHERE user_id = ? AND is_default = 1 
        LIMIT 1
    ");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt->bind_result($wishlistId);
        $stmt->fetch();
        $stmt->close();

        if (!$wishlistId) {
            throw new Exception("Default wishlist not found for this user");
        }

        $stmt = $this->db->prepare("
        SELECT COUNT(*) FROM wishlist_items 
        WHERE wishlist_id = ? AND product_id = ?
    ");
        $stmt->bind_param("ss", $wishlistId, $productId);
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();

        if ($count > 0) {
            throw new Exception("Product is already in the default wishlist");
        }

        $stmt = $this->db->prepare("
        INSERT INTO wishlist_items (wishlist_id, product_id) 
        VALUES (?, ?)
    ");
        $stmt->bind_param("ss", $wishlistId, $productId);
        $success = $stmt->execute();
        $stmt->close();

        if (!$success) {
            throw new Exception("Failed to add product to default wishlist");
        }

        return true;
    }

    public function addItemToWishlist(int $userId, string $wishlistId, string $productId): bool
    {
        if (!v::intVal()->min(1)->validate($userId)) {
            throw new Exception("Invalid user ID");
        }
        if (!v::stringType()->notEmpty()->length(1, 21)->validate($wishlistId)) {
            throw new Exception("Invalid wishlist ID");
        }
        if (!v::stringType()->notEmpty()->length(1, 36)->validate($productId)) {
            throw new Exception("Invalid product ID");
        }

        $stmt = $this->db->prepare("SELECT id FROM wishlists WHERE id = ? AND user_id = ? LIMIT 1");
        $stmt->bind_param("si", $wishlistId, $userId);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows === 0) {
            $stmt->close();
            throw new Exception("Wishlist not found for this user");
        }
        $stmt->close();

        $stmt = $this->db->prepare("SELECT COUNT(*) FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?");
        $stmt->bind_param("ss", $wishlistId, $productId);
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();

        if ($count > 0) {
            throw new Exception("Product is already in the wishlist");
        }

        $stmt = $this->db->prepare("INSERT INTO wishlist_items (wishlist_id, product_id) VALUES (?, ?)");
        $stmt->bind_param("ss", $wishlistId, $productId);
        $success = $stmt->execute();
        $stmt->close();

        if (!$success) {
            throw new Exception("Failed to add product to wishlist");
        }

        return true;
    }

    public function removeItem(int $userId, string $productId, string $wishlistId): bool
    {
        $idValidator = v::stringType()->notEmpty()->length(1, 36);

        try {
            $idValidator->assert($productId);
            $idValidator->assert($wishlistId);
        } catch (NestedValidationException $e) {
            error_log("Validation failed in removeItem(): " . $e->getFullMessage());
            return false;
        }

        $stmt = $this->db->prepare("
        DELETE FROM wishlist_items
        WHERE wishlist_id = ? AND product_id = ?
          AND wishlist_id IN (
            SELECT id FROM wishlists WHERE user_id = ?
          )
    ");

        $stmt->bind_param("ssi", $wishlistId, $productId, $userId);
        return $stmt->execute();
    }

    public function clear(int $userId, string $wishlistId): bool
    {
        if (!v::stringVal()->notEmpty()->min(1)->validate($wishlistId)) {
            error_log("Validation failed in clear(): Invalid wishlistId");
            return false;
        }

        $stmt = $this->db->prepare("DELETE FROM wishlist_items WHERE wishlist_id = ?");
        $stmt->bind_param("s", $wishlistId);
        return $stmt->execute();
    }

    public function delete(int $userId, string $wishlistId): bool
    {
        if (!v::intVal()->notEmpty()->min(1)->validate($userId) || !v::stringVal()->notEmpty()->min(1)->validate($wishlistId)) {
            error_log("Validation failed in delete(): Invalid userId or wishlistId");
            return false;
        }

        $stmt = $this->db->prepare("DELETE FROM wishlists WHERE user_id = ? AND id = ?");
        if (!$stmt) {
            error_log("Prepare failed in delete(): " . $this->db->error);
            return false;
        }
        $stmt->bind_param("is", $userId, $wishlistId);
        $success = $stmt->execute();
        $stmt->close();

        return $success;
    }

    public function update(string $wishlistId, array $args): bool
    {
        $wishlistIdValidator = v::stringType()->notEmpty()->length(1, 21);

        try {
            $wishlistIdValidator->assert($wishlistId);
        } catch (NestedValidationException $e) {
            error_log("Validation failed in update(): " . $e->getFullMessage());
            return false;
        }

        $nameValidator = v::stringType()->notEmpty()->length(1, 255);
        $isPrivateValidator = v::boolType();
        $isDefaultValidator = v::boolType();

        try {
            $nameValidator->assert($args["name"]);
            $isPrivateValidator->assert($args["is_private"]);
            $isDefaultValidator->assert($args["is_default"]);
        } catch (NestedValidationException $e) {
            error_log("Validation failed in update(): " . $e->getFullMessage());
            return false;
        }

        if ($args["is_default"]) {
            $stmt = $this->db->prepare(
                "SELECT user_id FROM wishlists WHERE id = ?"
            );
            $stmt->bind_param("s", $wishlistId);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $userId = $row["user_id"] ?? null;

            if ($userId) {
                $stmt = $this->db->prepare(
                    "UPDATE wishlists SET is_default = 0 WHERE user_id = ? AND id != ?"
                );
                $stmt->bind_param("ss", $userId, $wishlistId);
                $stmt->execute();
            }
        }

        $stmt = $this->db->prepare(
            "UPDATE wishlists SET name = ?, is_private = ?, is_default = ? WHERE id = ?"
        );

        $stmt->bind_param(
            "siis",
            $args["name"],
            $args["is_private"],
            $args["is_default"],
            $wishlistId
        );

        return $stmt->execute();
    }

    public function isInWishlist(int $userId, string $productId): bool
    {
        $idValidator = v::stringType()->notEmpty()->length(1, 36);
        try {
            $idValidator->assert($productId);
        } catch (NestedValidationException $e) {
            error_log("Validation failed in isInWishlist(): " . $e->getFullMessage());
            return false;
        }

        $stmt = $this->db->prepare("SELECT 1 FROM wishlists WHERE user_id = ? AND product_id = ?");
        $stmt->bind_param("is", $userId, $productId);
        $stmt->execute();
        $result = $stmt->get_result();

        return (bool) $result->fetch_row();
    }
}