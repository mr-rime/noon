<?php

require_once __DIR__ . '/../../models/Product.php';


function getAllProducts(mysqli $db, array $data): array
{
    try {
        $model = new Product($db);
        $products = $model->findAll($data['limit'], $data['offset']);

        return [
            'success' => true,
            'message' => 'Products retrieved.',
            'products' => $products
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'products' => []
        ];
    }
}

function getProductById(mysqli $db, string $id): array
{
    try {
        $model = new Product($db);
        $product = $model->findById($id);

        return [
            'success' => $product !== null,
            'message' => $product ? 'Product found.' : 'Product not found.',
            'product' => $product
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'product' => null
        ];
    }
}

function createProduct(mysqli $db, array $data): array
{
    try {
        $model = new Product($db);
        $product = $model->create($data);

        return [
            'success' => true,
            'message' => 'Product created.',
            'product' => $product
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'product' => null
        ];
    }
}