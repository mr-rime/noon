<?php

require_once __DIR__ . "/../../models/Cart.php";
require_once __DIR__ . "/../../models/SessionManager.php";

function getUserId(): ?int
{

    if (isset($GLOBALS['db']) && $GLOBALS['db'] instanceof mysqli) {
        $sessionManager = new SessionManager($GLOBALS['db']);
        $sessionId = $sessionManager->getSessionId();
        $user = $sessionManager->getUser($sessionId);

        if ($user && isset($user['id'])) {
            return $user['id'];
        }
    }


    if (isset($_SESSION['user']) && isset($_SESSION['user']['id'])) {
        return $_SESSION['user']['id'];
    }

    return null;
}

function getCart(mysqli $db): array
{
    try {
        $cart = new Cart($db);


        $userId = getUserId();
        $items = $cart->getCartItems($userId);

        return [
            'success' => true,
            'message' => 'Cart retrieved.',
            'cartItems' => $items
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'cartItems' => []
        ];
    }
}

function removeFromCart(mysqli $db, array $args, array $context): array
{
    try {
        $cart = new Cart($db);
        $userId = getUserId();

        $success = $cart->removeItem($userId, $args['product_id']);
        return [
            'success' => $success,
            'message' => $success ? 'Item removed.' : 'Item not found.',
            'cartItems' => $cart->getCartItems($userId)
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'cartItems' => []
        ];
    }
}

function addToCart(mysqli $db, array $args): array
{
    try {
        $cart = new Cart($db);

        $userId = getUserId();
        $productId = $args['product_id'] ?? null;
        $quantity = $args['quantity'] ?? 1;

        if (!$productId || $quantity <= 0) {
            return [
                'success' => false,
                'message' => 'Invalid product ID or quantity.',
                'cartItems' => []
            ];
        }

        $items = $cart->addItem($userId, $productId, $quantity);

        if (!$items) {
            return [
                'success' => false,
                'message' => 'Failed to add item to cart.',
                'cartItems' => []
            ];
        }

        return [
            'success' => true,
            'message' => 'Item added to cart.',
            'cartItems' => $items
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'cartItems' => []
        ];
    }
}

function updateCartItemQuantity(mysqli $db, array $args): array
{
    try {
        $cart = new Cart($db);
        $userId = getUserId();
        $productId = $args['product_id'] ?? null;
        $quantity = $args['quantity'] ?? 1;

        if (!$productId || $quantity < 1) {
            return [
                'success' => false,
                'message' => 'Invalid product ID or quantity.',
                'cartItems' => []
            ];
        }

        $success = $cart->updateItemQuantity($userId, $productId, $quantity);

        return [
            'success' => $success,
            'message' => $success ? 'Quantity updated.' : 'Failed to update quantity.',
            'cartItems' => $cart->getCartItems($userId)
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'cartItems' => []
        ];
    }
}

function mergeGuestCart(mysqli $db): array
{
    try {
        $cart = new Cart($db);

        $userId = getUserId();

        if (!$userId) {
            return [
                'success' => false,
                'message' => 'User must be logged in to merge cart.',
                'cartItems' => []
            ];
        }

        $cart->mergeGuestCartWithUserCart($userId);

        $items = $cart->getCartItems($userId);

        return [
            'success' => true,
            'message' => 'Guest cart merged successfully.',
            'cartItems' => $items
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'cartItems' => []
        ];
    }
}

