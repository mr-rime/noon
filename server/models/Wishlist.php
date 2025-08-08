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

    public function create(string $user_id, string $name): bool
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
        $stmt->bind_param('sss', $id, $user_id, $name);
        $success = $stmt->execute();
        $stmt->close();

        if (!$success) {
            throw new Exception('Failed to create wishlist.');
        }

        return true;
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
        GROUP BY w.id
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

    public function addItem(string $productId, string $wishlistId): bool
    {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM wishlist_items WHERE product_id = ? AND wishlist_id = ?");
        $stmt->bind_param("ss", $productId, $wishlistId);
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();

        if ($count > 0) {
            throw new Exception('Product is already in the wishlist.');
        }

        $stmt = $this->db->prepare("INSERT INTO wishlist_items (product_id, wishlist_id) VALUES (?, ?)");
        $stmt->bind_param("ss", $productId, $wishlistId);
        $success = $stmt->execute();
        $stmt->close();

        if (!$success) {
            throw new Exception('Failed to add product to wishlist.');
        }

        return true;
    }


    public function removeItem(int $userId, string $productId): bool
    {
        $idValidator = v::stringType()->notEmpty()->length(1, 36);
        try {
            $idValidator->assert($productId);
        } catch (NestedValidationException $e) {
            error_log("Validation failed in removeItem(): " . $e->getFullMessage());
            return false;
        }

        $stmt = $this->db->prepare("DELETE FROM wishlists WHERE user_id = ? AND product_id = ?");
        $stmt->bind_param("is", $userId, $productId);
        return $stmt->execute();
    }

    public function clear(int $userId): bool
    {
        if (!v::intVal()->min(1)->validate($userId)) {
            error_log("Validation failed in clear(): Invalid user ID");
            return false;
        }

        $stmt = $this->db->prepare("DELETE FROM wishlists WHERE user_id = ?");
        $stmt->bind_param("i", $userId);
        return $stmt->execute();
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