<?php
require_once __DIR__ . '/../../models/Category.php';

function getAllCategories(mysqli $db): array
{
    try {
        $model = new Category($db);
        $categories = $model->findAll();

        return [
            'success' => true,
            'message' => 'Categories retrieved.',
            'categories' => $categories
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'categories' => []
        ];
    }
}

function createCategory(mysqli $db, array $data): array
{
    try {
        $model = new Category($db);
        $category = $model->create($data);

        return [
            'success' => true,
            'message' => 'Category created.',
            'category' => $category
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'category' => null
        ];
    }
}