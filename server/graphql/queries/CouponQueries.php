<?php

use GraphQL\Type\Definition\Type;

return [
    'getCoupons' => [
        'type' => $CouponsResponseType,
        'args' => [
            'limit' => Type::int(),
            'offset' => Type::int(),
            'search' => Type::string()
        ],
        'resolve' => function ($root, $args) {
            global $db;
            $resolver = new CouponResolver($db->getConnection());
            return $resolver->getCoupons($root, $args);
        }
    ],
    'getCoupon' => [
        'type' => $CouponResponseType,
        'args' => [
            'id' => Type::nonNull(Type::id())
        ],
        'resolve' => function ($root, $args) {
            global $db;
            $resolver = new CouponResolver($db->getConnection());
            return $resolver->getCoupon($root, $args);
        }
    ],
    'validateCoupon' => [
        'type' => $CouponResponseType,
        'args' => [
            'code' => Type::nonNull(Type::string())
        ],
        'resolve' => function ($root, $args) {
            global $db;
            $resolver = new CouponResolver($db->getConnection());
            return $resolver->validateCoupon($root, $args);
        }
    ]
];
