<?php

require_once __DIR__ . '/../../models/Order.php';

function createOrder(mysqli $db, array $data)
{
    try {
        $model = new Order($db);
        $order = $model->create($data);

        error_log(json_encode($order));



        return [
            'success' => true,
            'message' => 'Order created.',
            'order' => $order
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'order' => []
        ];
    }
}