<?php

require_once __DIR__ . '/../../models/Product.php';


function getAllProducts(mysqli $db, array $data): array
{
    try {
        $model = new Product($db);
        $userId = $_SESSION['user']['id'];
        $products = $model->findAll($userId, $data['limit'], $data['offset'], $data['search']);


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
        error_log('createProduct error: ' . $e->getMessage());

        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'product' => null
        ];
    }
}


function updateProduct(mysqli $db, array $args): array
{
    $id = $args['id'];

    try {
        if (!empty($args['images'])) {
            $args['images'] = array_map(fn($image) => [
                'image_url' => $image['image_url'],
                'is_primary' => $image['is_primary'] ?? false,
            ], $args['images']);
        }

        if (!empty($args['productOptions'])) {
            $args['productOptions'] = array_map(fn($opt) => [
                'name' => $opt['name'],
                'value' => $opt['value'],
                'type' => $opt['type'],
                'image_url' => $opt['image_url'] ?? '',
            ], $args['productOptions']);
        }

        if (!empty($args['productSpecifications'])) {
            $args['productSpecifications'] = array_map(fn($spec) => [
                'spec_name' => $spec['spec_name'],
                'spec_value' => $spec['spec_value'],
            ], $args['productSpecifications']);
        }

        $model = new Product($db);
        $product = $model->update($id, $args);

        if (!$product) {
            return [
                'success' => false,
                'message' => 'Failed to update product.',
                'product' => null,
            ];
        }

        if (!empty($args['images'])) {
            $imageModel = new ProductImage($db);
            $imageModel->replaceForProduct($id, $args['images']);
        }

        if (!empty($args['productOptions'])) {
            $optionModel = new ProductOption($db);
            $optionModel->replaceForProduct($id, $args['productOptions']);
        }

        if (!empty($args['productSpecifications'])) {
            $specModel = new ProductSpecification($db);
            $specModel->replaceForProduct($id, $args['productSpecifications']);
        }

        $updated = $model->findById($id);

        return [
            'success' => true,
            'message' => 'Product updated successfully.',
            'product' => $updated,
        ];
    } catch (Exception $e) {
        error_log('updateProduct error: ' . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'product' => null,
        ];
    }
}


