<?php

require_once __DIR__ . '/../../models/Discount.php';

function createDiscount(mysqli $db, array $data)
{
    try {
        $model = new Discount($db);
        $discount = $model->create($data);

        return [
            'success' => true,
            'message' => "Discount created successfully.",
            'discount' => $discount
        ];
    } catch (Exception $er) {
        error_log("Error create discount: " . $er->getMessage());

        return [
            'success' => false,
            'message' => "Error creating discount: " . $er->getMessage(),
            'discount' => null
        ];
    }
}

function getDiscount(mysqli $db, $id)
{
    try {
        $model = new Discount($db);
        $discount = $model->findById($id);

        return [
            'success' => true,
            'message' => $discount ? "Discount found." : "Discount not found.",
            'discount' => $discount
        ];
    } catch (Exception $er) {
        error_log("Error get discount: " . $er->getMessage());

        return [
            'success' => false,
            'message' => "Error retrieving discount: " . $er->getMessage(),
            'discount' => null
        ];
    }
}

function getAllDiscounts(mysqli $db, array $args)
{
    try {
        $model = new Discount($db);
        $limit = $args['limit'] ?? 10;
        $offset = $args['offset'] ?? 0;
        $search = $args['search'] ?? '';
        $productId = $args['productId'] ?? null;

        $discounts = $model->findAll($limit, $offset, $search, $productId);
        $total = $model->getTotalCount($search, $productId);

        return [
            'success' => true,
            'message' => "Discounts retrieved successfully.",
            'discounts' => $discounts,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset
        ];
    } catch (Exception $er) {
        error_log("Error get all discounts: " . $er->getMessage());

        return [
            'success' => false,
            'message' => "Error retrieving discounts: " . $er->getMessage(),
            'discounts' => [],
            'total' => 0,
            'limit' => $args['limit'] ?? 10,
            'offset' => $args['offset'] ?? 0
        ];
    }
}

function updateDiscount(mysqli $db, array $data)
{
    try {
        $model = new Discount($db);
        $id = $data['id'];
        unset($data['id']);

        $discount = $model->update($id, $data);

        return [
            'success' => true,
            'message' => "Discount updated successfully.",
            'discount' => $discount
        ];
    } catch (Exception $er) {
        error_log("Error update discount: " . $er->getMessage());

        return [
            'success' => false,
            'message' => "Error updating discount: " . $er->getMessage(),
            'discount' => null
        ];
    }
}

function deleteDiscount(mysqli $db, array $data)
{
    try {
        $model = new Discount($db);
        $success = $model->delete($data['id']);

        return [
            'success' => $success,
            'message' => $success ? "Discount deleted successfully." : "Failed to delete discount.",
            'discount' => null
        ];
    } catch (Exception $er) {
        error_log("Error delete discount: " . $er->getMessage());

        return [
            'success' => false,
            'message' => "Error deleting discount: " . $er->getMessage(),
            'discount' => null
        ];
    }
}