<?php

require_once __DIR__ . '/../../models/Wishlist.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Exceptions\NestedValidationException;
use Respect\Validation\Exceptions\ValidationException;
use Respect\Validation\Validator as v;

function addItemToWishlist(mysqli $db, array $args): array
{
    try {
        $productIdValidator = v::stringType()->notEmpty()->length(1, 36);

        if (!isset($args['product_id'])) {
            throw new Exception('Missing required fields: product_id');
        }

        $productIdValidator->assert($args['product_id']);

        $userId = $_SESSION['user']['id'];

        $wishlistModel = new Wishlist($db);
        $wishlistModel->addItemToDefault($userId, $args['product_id']);

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
        $id = $wishlistModel->create($userId, $name);

        return [
            'success' => true,
            'message' => 'Wishlist has been created successfully',
            'data' => [
                'id' => $id,
                'name' => $name
            ]
        ];
    } catch (Respect\Validation\Exceptions\ValidationException $e) {
        return [
            'success' => false,
            'message' => 'Validation error: ' . $e->getMessage(),
            'data' => null
        ];
    } catch (Throwable $e) {
        return [
            'success' => false,
            'message' => $e->getMessage(),
            'data' => null
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


function removeItemFromWishlist(mysqli $db, array $args): array
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

        if (!isset($args['wishlist_id'], $args['product_id'])) {
            throw new Exception('Missing required fields: wishlist_id, product_id');
        }

        $wishlistIdValidator = v::stringType()->notEmpty()->length(1, 21);
        $productIdValidator = v::stringType()->notEmpty()->length(1, 36);

        $wishlistIdValidator->assert($args['wishlist_id']);
        $productIdValidator->assert($args['product_id']);

        $wishlistModel = new Wishlist($db);
        $removed = $wishlistModel->removeItem((int) $userId, $args['product_id'], $args['wishlist_id']);

        if (!$removed) {
            throw new Exception('Failed to remove product from wishlist');
        }

        return [
            'success' => true,
            'message' => 'Product removed from wishlist successfully',
            'data' => true
        ];

    } catch (NestedValidationException $e) {
        return [
            'success' => false,
            'message' => 'Validation error: ' . $e->getFullMessage(),
            'data' => []
        ];
    } catch (Throwable $e) {
        error_log("Error in removeItemFromWishlist: " . $e->getMessage());
        return [
            'success' => false,
            'message' => $e->getMessage(),
            'data' => []
        ];
    }
}


function clearWishlist(mysqli $db, string $wishlistId): array
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
        $cleared = $wishlistModel->clear($userId, $wishlistId);

        if (!$cleared) {
            throw new Exception('Failed to clear wishlist');
        }

        return [
            'success' => true,
            'message' => 'Wishlist cleared successfully',
            'data' => true
        ];
    } catch (ValidationException $e) {
        return [
            'success' => false,
            'message' => 'Validation error: ' . $e->getMessage(),
            'data' => []
        ];
    } catch (Throwable $e) {
        error_log("Error in clearWishlist: " . $e->getMessage());
        return [
            'success' => false,
            'message' => $e->getMessage(),
            'data' => []
        ];
    }
}


function deleteWishlist(mysqli $db, string $wishlistId): array
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
        $deleted = $wishlistModel->delete((int) $userId, $wishlistId);

        if (!$deleted) {
            throw new Exception('Failed to delete wishlist');
        }

        return [
            'success' => true,
            'message' => 'Wishlist deleted successfully',
            'data' => true
        ];
    } catch (Respect\Validation\Exceptions\ValidationException $e) {
        return [
            'success' => false,
            'message' => 'Validation error: ' . $e->getMessage(),
            'data' => []
        ];
    } catch (Throwable $e) {
        error_log("Error in deleteWishlist: " . $e->getMessage());
        return [
            'success' => false,
            'message' => $e->getMessage(),
            'data' => []
        ];
    }
}