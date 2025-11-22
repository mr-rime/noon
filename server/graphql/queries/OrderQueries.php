<?php

use GraphQL\Type\Definition\Type;

return [
    'getUserOrders' => [
        'type' => $OrdersListResponseType,
        'args' => [
            'limit' => Type::int(),
            'offset' => Type::int()
        ],
        'resolve' => requireAuth(fn($root, $args, $context) => getUserOrders($context['db'], $args))
    ],

    'getOrderDetails' => [
        'type' => $OrderResponseType,
        'args' => [
            'order_id' => Type::nonNull(Type::string())
        ],
        'resolve' => requireAuth(fn($root, $args, $context) => getOrderDetails($context['db'], $args))
    ],

    'getOrderTracking' => [
        'type' => $TrackingResponseType,
        'args' => [
            'order_id' => Type::nonNull(Type::string())
        ],
        'resolve' => requireAuth(fn($root, $args, $context) => getOrderTracking($context['db'], $args))
    ],
    'getAllOrders' => [
        'type' => $AdminOrdersListResponseType,
        'args' => [
            'limit' => Type::int(),
            'offset' => Type::int(),
            'status' => Type::string(),
            'payment_status' => Type::string()
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => getAllOrders($context['db'], $args))
    ],
];
