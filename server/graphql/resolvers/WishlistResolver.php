<?php

require_once __DIR__ . '/../../models/Wishlist.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;

function addItemToWishlist(mysqli $db, array $args): array
{
    try {
        $productIdValidator = v::stringType()->notEmpty()->length(1, 36);
        $wishlistIdValidator = v::stringType()->notEmpty()->length(1, 21);

        if (!isset($args['product_id'], $args['wishlist_id'])) {
            throw new Exception('Missing required fields: product_id or wishlist_id');
        }

        $productIdValidator->assert($args['product_id']);
        $wishlistIdValidator->assert($args['wishlist_id']);

        $wishlistModel = new Wishlist($db);
        $wishlistModel->addItem($args['product_id'], $args['wishlist_id']);

        return [
            'success' => true,
            'message' => 'Product has been added to the wishlist',
            'data' => true
        ];

    } catch (Respect\Validation\Exceptions\ValidationException $e) {
        return [
            'success' => false,
            'message' => 'Validation error: ' . $e->getMessage(),
            'data' => []
        ];
    } catch (Throwable $e) {
        return [
            'success' => false,
            'message' => $e->getMessage(),
            'data' => []
        ];
    }
}


function createWishlist(mysqli $db, string $name): array
{
    try {
        $userId = $_SESSION['user']['id'] ?? null;

        if (!$userId) {
            throw new Exception('Unauthorized! User not logged in');
        }

        $nameValidator = v::stringType()->notEmpty()->length(1, 255);
        $nameValidator->assert($name);

        $wishlistModel = new Wishlist($db);
        $wishlistModel->create($userId, $name);

        return [
            'success' => true,
            'message' => 'Wishlist has been created successfully',
            'data' => true
        ];
    } catch (Respect\Validation\Exceptions\ValidationException $e) {
        return [
            'success' => false,
            'message' => 'Validation error: ' . $e->getMessage(),
            'data' => []
        ];
    } catch (Throwable $e) {
        return [
            'success' => false,
            'message' => $e->getMessage(),
            'data' => []
        ];
    }
}

function getWishlistItems(mysqli $db, string $wishlistId): array
{
    try {
        $userId = $_SESSION['user']['id'] ?? null;

        if (!$userId) {
            return [
                'success' => false,
                'message' => 'Unauthorized: User not logged in',
                'data' => []
            ];
        }

        $wishlistIdValidator = v::stringType()->notEmpty()->length(1, 21);
        $wishlistIdValidator->assert($wishlistId);

        $wishlistModel = new Wishlist($db);
        $data = $wishlistModel->getItems((int) $userId, $wishlistId);

        return [
            'success' => true,
            'message' => 'Wishlist items retrieved successfully',
            'data' => $data
        ];
    } catch (Respect\Validation\Exceptions\ValidationException $e) {
        return [
            'success' => false,
            'message' => 'Validation error: ' . $e->getMessage(),
            'data' => []
        ];
    } catch (Throwable $e) {
        error_log("Error in getWishlistItems: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Something went wrong while retrieving wishlist items',
            'data' => []
        ];
    }
}


function updateWishlist(mysqli $db, array $args): array
{
    try {
        $userId = $_SESSION['user']['id'] ?? null;

        if (!$userId) {
            return [
                'success' => false,
                'message' => 'Unauthorized: User not logged in',
                'data' => []
            ];
        }

        if (!isset($args['wishlist_id'], $args['name'], $args['is_private'], $args['is_default'])) {
            throw new Exception('Missing required fields: wishlist_id, name, is_private, or is_default');
        }

        $wishlistIdValidator = v::stringType()->notEmpty()->length(1, 21);
        $nameValidator = v::stringType()->notEmpty()->length(1, 255);
        $isPrivateValidator = v::boolType();
        $isDefaultValidator = v::boolType();

        $wishlistIdValidator->assert($args['wishlist_id']);
        $nameValidator->assert($args['name']);
        $isPrivateValidator->assert($args['is_private']);
        $isDefaultValidator->assert($args['is_default']);

        $wishlistModel = new Wishlist($db);
        $updated = $wishlistModel->update(
            $args['wishlist_id'],
            [
                'name' => $args['name'],
                'is_private' => $args['is_private'],
                'is_default' => $args['is_default']
            ]
        );

        if ($updated === false) {
            throw new Exception('Failed to update wishlist');
        }

        return [
            'success' => true,
            'message' => 'Wishlist updated successfully',
            'data' => []
        ];

    } catch (Respect\Validation\Exceptions\ValidationException $e) {
        return [
            'success' => false,
            'message' => 'Validation error: ' . $e->getMessage(),
            'data' => []
        ];
    } catch (Throwable $e) {
        error_log("Error in updateWishlist: " . $e->getMessage());
        return [
            'success' => false,
            'message' => $e->getMessage(),
            'data' => []
        ];
    }
}


function getWishlists(mysqli $db)
{
    try {
        $userId = $_SESSION['user']['id'] ?? null;

        if (!$userId) {
            return [
                'success' => false,
                'message' => 'Unauthorized: User not logged in',
                'data' => []
            ];
        }

        $wishlistModel = new Wishlist($db);
        $data = $wishlistModel->getWishlists($userId);

        return [
            'success' => true,
            'message' => 'Wishlists retrieved successfully',
            'data' => $data
        ];
    } catch (Respect\Validation\Exceptions\ValidationException $e) {
        return [
            'success' => false,
            'message' => 'Validation error: ' . $e->getMessage(),
            'data' => []
        ];
    } catch (Throwable $e) {
        error_log("Error in getWishlists: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Something went wrong while retrieving wishlists',
            'data' => []
        ];
    }
}