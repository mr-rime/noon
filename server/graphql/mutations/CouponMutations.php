<?php

use GraphQL\Type\Definition\Type;

return [
    'createCoupon' => [
        'type' => $CouponResponseType,
        'args' => [
            'input' => Type::nonNull($CouponInputType)
        ],
        'resolve' => function ($root, $args) {
            global $db;
            $resolver = new CouponResolver($db->getConnection());
            return $resolver->createCoupon($root, $args);
        }
    ],
    'updateCoupon' => [
        'type' => $CouponResponseType,
        'args' => [
            'id' => Type::nonNull(Type::id()),
            'input' => Type::nonNull($CouponUpdateInputType)
        ],
        'resolve' => function ($root, $args) {
            global $db;
            $resolver = new CouponResolver($db->getConnection());
            return $resolver->updateCoupon($root, $args);
        }
    ],
    'deleteCoupon' => [
        'type' => $DeleteCouponResponseType,
        'args' => [
            'id' => Type::nonNull(Type::id())
        ],
        'resolve' => function ($root, $args) {
            global $db;
            $resolver = new CouponResolver($db->getConnection());
            return $resolver->deleteCoupon($root, $args);
        }
    ]
];
