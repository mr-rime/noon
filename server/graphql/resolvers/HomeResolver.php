<?php

require_once __DIR__ . '/../../models/Product.php';

function getHome(mysqli $db, array $data): array
{
    try {
        $productModel = new Product($db);
        $products = $productModel->findAll($data['limit'], $data['offset'], $data['search']);

        return [
            'success' => true,
            'message' => 'Home page loaded successfully.',
            'home' => [
                'recommendedForYou' => $products
            ]
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'home' => []
        ];
    }
}