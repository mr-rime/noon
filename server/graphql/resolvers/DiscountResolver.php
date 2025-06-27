<?php

require_once __DIR__ . '/../../models/Discount.php';

function createDiscount(mysqli $db, array $data)
{
    try {
        $model = new Discount($db);
        $discount = $model->create($data);


        return [
            'success' => true,
            'message' => "Discount created.",
            'discount' => $discount
        ];
    } catch (Exception $er) {
        error_log("Error create discount" . $er->getMessage());

        return [
            'success' => false,
            'message' => "Error" . $er->getMessage(),
            'discount' => null
        ];
    }
}

function getDiscount(mysqli $db, $id)
{
    try {
        $model = new Discount($db);
        $discount = $model->findById($id);

        return $discount;
    } catch (Exception $er) {
        error_log("Error get discount" . $er->getMessage());

        return [
            'success' => false,
            'message' => "Error" . $er->getMessage(),
            'discount' => null
        ];
    }
}