<?php

function getCart(mysqli $db, array $args, array $context): array
{
    try {
        $cart = new Cart($db);

        $userId = $_SESSION['user']['id'] ?? null;
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
        $userId = $_SESSION['user']['id'] ?? null;

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

        $userId = $_SESSION['user']['id'] ?? null;
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