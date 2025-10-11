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

        if (!$category) {
            return [
                'success' => false,
                'message' => 'Failed to create category. Please check if the slug is unique and all required fields are valid.',
                'category' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Category created successfully.',
            'category' => $category
        ];
    } catch (Exception $e) {
        error_log("createCategory error: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Error creating category: ' . $e->getMessage(),
            'category' => null
        ];
    }
}