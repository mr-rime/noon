<?php

require_once __DIR__ . '/../../models/Order.php';
require_once __DIR__ . '/../../models/TrackingDetails.php';
require_once __DIR__ . '/../../services/StripeService.php';

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

function createCheckoutSession(mysqli $db, array $data)
{
    try {
        $userId = $_SESSION['user']['id'] ?? null;
        if (!$userId) {
            return [
                'success' => false,
                'message' => 'User must be logged in to checkout',
                'session_url' => null
            ];
        }


        $cart = new Cart($db);
        $cartItems = $cart->getCartItems($userId);

        if (empty($cartItems)) {
            return [
                'success' => false,
                'message' => 'Cart is empty',
                'session_url' => null
            ];
        }


        $stripeService = new StripeService();
        $orderData = [
            'user_id' => $userId,
            'customer_email' => $_SESSION['user']['email'] ?? null,
            'items' => array_map(function ($item) {

                $description = !empty($item['product_overview'])
                    ? $item['product_overview']
                    : (!empty($item['name']) ? "Product: " . $item['name'] : null);

                return [
                    'product_id' => $item['product_id'],
                    'name' => $item['name'],
                    'description' => $description,
                    'price' => $item['final_price'] ?? $item['price'],
                    'currency' => $item['currency'],
                    'quantity' => $item['quantity'],
                    'images' => !empty($item['image_url']) ? [$item['image_url']] : []
                ];
            }, $cartItems),
            'success_url' => $data['success_url'] ?? 'http://localhost:3000/orders?payment=success',
            'cancel_url' => $data['cancel_url'] ?? 'http://localhost:3000/cart?payment=cancelled'
        ];

        $result = $stripeService->createCheckoutSession($orderData);

        if ($result['success']) {
            return [
                'success' => true,
                'message' => 'Checkout session created',
                'session_url' => $result['url'],
                'session_id' => $result['session_id']
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Failed to create checkout session: ' . $result['error'],
                'session_url' => null
            ];
        }
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'session_url' => null
        ];
    }
}

function getUserOrders(mysqli $db, array $args)
{
    try {
        $userId = $_SESSION['user']['id'] ?? null;
        if (!$userId) {
            return [
                'success' => false,
                'message' => 'User must be logged in',
                'orders' => []
            ];
        }

        $limit = $args['limit'] ?? 10;
        $offset = $args['offset'] ?? 0;

        $orderModel = new Order($db);
        $orders = $orderModel->getByUserId($userId, $limit, $offset);


        $trackingModel = new TrackingDetails($db);
        foreach ($orders as &$order) {
            $tracking = $trackingModel->getByOrderId($order['id']);
            $order['tracking'] = $tracking;
        }

        return [
            'success' => true,
            'message' => 'Orders retrieved successfully',
            'orders' => $orders
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'orders' => []
        ];
    }
}

function getOrderDetails(mysqli $db, array $args)
{
    try {
        $orderId = $args['order_id'] ?? null;
        if (!$orderId) {
            return [
                'success' => false,
                'message' => 'Order ID is required',
                'order' => null
            ];
        }

        $userId = $_SESSION['user']['id'] ?? null;
        if (!$userId) {
            return [
                'success' => false,
                'message' => 'User must be logged in',
                'order' => null
            ];
        }

        $orderModel = new Order($db);
        $order = $orderModel->getOrderWithItems($orderId);

        if (!$order) {
            return [
                'success' => false,
                'message' => 'Order not found',
                'order' => null
            ];
        }


        if ($order['user_id'] != $userId) {
            return [
                'success' => false,
                'message' => 'Access denied',
                'order' => null
            ];
        }


        $trackingModel = new TrackingDetails($db);
        $tracking = $trackingModel->getByOrderId($orderId);
        $order['tracking'] = $tracking;

        return [
            'success' => true,
            'message' => 'Order details retrieved successfully',
            'order' => $order
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'order' => null
        ];
    }
}

function getOrderTracking(mysqli $db, array $args)
{
    try {
        $orderId = $args['order_id'] ?? null;
        if (!$orderId) {
            return [
                'success' => false,
                'message' => 'Order ID is required',
                'tracking' => null
            ];
        }

        $userId = $_SESSION['user']['id'] ?? null;
        if (!$userId) {
            return [
                'success' => false,
                'message' => 'User must be logged in',
                'tracking' => null
            ];
        }


        $orderModel = new Order($db);
        $order = $orderModel->findByIdString($orderId);

        if (!$order || $order['user_id'] != $userId) {
            return [
                'success' => false,
                'message' => 'Order not found or access denied',
                'tracking' => null
            ];
        }

        $trackingModel = new TrackingDetails($db);
        $tracking = $trackingModel->getByOrderId($orderId);

        if (!$tracking) {
            return [
                'success' => false,
                'message' => 'No tracking information available',
                'tracking' => null
            ];
        }

        $timeline = $trackingModel->getTrackingTimeline($orderId);

        return [
            'success' => true,
            'message' => 'Tracking information retrieved successfully',
            'tracking' => array_merge($tracking, ['timeline' => $timeline])
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'tracking' => null
        ];
    }
}


function getAllOrders(mysqli $db, array $args)
{
    try {

        $limit = $args['limit'] ?? 50;
        $offset = $args['offset'] ?? 0;
        $status = $args['status'] ?? null;
        $paymentStatus = $args['payment_status'] ?? null;

        $orderModel = new Order($db);

        $query = "
            SELECT o.*, 
                   GROUP_CONCAT(
                       JSON_OBJECT(
                           'id', oi.id,
                           'product_id', oi.product_id,
                           'quantity', oi.quantity,
                           'price', oi.price,
                           'currency', oi.currency,
                           'product_name', p.name,
                           'product_description', p.product_overview,
                           'product_image', pi.image_url
                       )
                   ) as items_json
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
            WHERE 1=1
        ";

        $params = [];
        $types = '';

        if ($status) {
            $query .= " AND o.status = ?";
            $params[] = $status;
            $types .= 's';
        }

        if ($paymentStatus) {
            $query .= " AND o.payment_status = ?";
            $params[] = $paymentStatus;
            $types .= 's';
        }

        $query .= " GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        $types .= 'ii';

        $stmt = $db->prepare($query);
        if (!$stmt) {
            error_log("Get all orders prepare failed: " . $db->error);
            return [
                'success' => false,
                'message' => 'Database error',
                'orders' => []
            ];
        }

        if ($params) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $orders = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();


        foreach ($orders as &$order) {
            if ($order['items_json']) {
                $itemsArray = explode(',', $order['items_json']);
                $order['items'] = [];
                foreach ($itemsArray as $itemJson) {
                    $decodedItem = json_decode($itemJson, true);
                    if ($decodedItem !== null) {
                        $order['items'][] = $decodedItem;
                    }
                }
            } else {
                $order['items'] = [];
            }
            unset($order['items_json']);


            $trackingModel = new TrackingDetails($db);
            $tracking = $trackingModel->getByOrderId($order['id']);
            $order['tracking'] = $tracking;
        }

        return [
            'success' => true,
            'message' => 'Orders retrieved successfully',
            'orders' => $orders
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'orders' => []
        ];
    }
}

function updateOrderStatus(mysqli $db, array $args)
{
    try {
        $orderId = $args['order_id'] ?? null;
        $status = $args['status'] ?? null;
        $paymentStatus = $args['payment_status'] ?? null;

        if (!$orderId) {
            return [
                'success' => false,
                'message' => 'Order ID is required'
            ];
        }

        if (!$status && !$paymentStatus) {
            return [
                'success' => false,
                'message' => 'At least one status must be provided'
            ];
        }

        $orderModel = new Order($db);
        $result = $orderModel->updateStatus($orderId, $status, $paymentStatus);

        if ($result) {
            return [
                'success' => true,
                'message' => 'Order status updated successfully'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Failed to update order status'
            ];
        }
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ];
    }
}

function updateTrackingDetails(mysqli $db, array $args)
{
    try {
        $orderId = $args['order_id'] ?? null;
        $shippingProvider = $args['shipping_provider'] ?? null;
        $trackingNumber = $args['tracking_number'] ?? null;
        $status = $args['status'] ?? null;
        $estimatedDeliveryDate = $args['estimated_delivery_date'] ?? null;

        if (!$orderId) {
            return [
                'success' => false,
                'message' => 'Order ID is required'
            ];
        }

        $trackingModel = new TrackingDetails($db);
        $orderModel = new Order($db);


        $existingTracking = $trackingModel->getByOrderId($orderId);


        if ($status) {
            $orderModel->updateByStringId($orderId, ['status' => $status]);
        } else if ($existingTracking && $existingTracking['status']) {

            $orderModel->updateByStringId($orderId, ['status' => $existingTracking['status']]);
        }

        if ($existingTracking) {
            $updateData = [];
            if ($shippingProvider !== null)
                $updateData['shipping_provider'] = $shippingProvider;
            if ($trackingNumber !== null)
                $updateData['tracking_number'] = $trackingNumber;
            if ($status !== null)
                $updateData['status'] = $status;
            if ($estimatedDeliveryDate !== null)
                $updateData['estimated_delivery_date'] = $estimatedDeliveryDate;

            $result = $trackingModel->update($existingTracking['id'], $updateData);
        } else {
            $createData = [
                'order_id' => $orderId,
                'shipping_provider' => $shippingProvider ?: 'Standard Shipping',
                'tracking_number' => $trackingNumber ?: '',
                'status' => $status ?: 'processing',
                'estimated_delivery_date' => $estimatedDeliveryDate
            ];

            $result = $trackingModel->create($createData);
        }

        if ($result) {

            $finalTracking = $trackingModel->getByOrderId($orderId);
            json_encode($finalTracking);
            if ($finalTracking && $finalTracking['status']) {
                $orderModel->updateByStringId($orderId, ['status' => $finalTracking['status']]);
            }

            return [
                'success' => true,
                'message' => 'Tracking details updated successfully'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Failed to update tracking details'
            ];
        }
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ];
    }
}