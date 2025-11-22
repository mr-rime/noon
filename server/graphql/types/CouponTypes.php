<?php

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

$CouponType = new ObjectType([
    'name' => "Coupon",
    'fields' => [
        'id' => Type::nonNull(Type::id()),
        'code' => Type::nonNull(Type::string()),
        'type' => Type::nonNull(Type::string()),
        'value' => Type::nonNull(Type::float()),
        'starts_at' => Type::nonNull(Type::string()),
        'ends_at' => Type::nonNull(Type::string()),
        'usage_limit' => Type::int(),
        'used_count' => Type::int(),
        'status' => Type::string(),
        'created_at' => Type::string(),
        'updated_at' => Type::string()
    ]
]);

$CouponInputType = new InputObjectType([
    'name' => "CouponInput",
    'fields' => [
        'code' => Type::nonNull(Type::string()),
        'type' => Type::nonNull(Type::string()),
        'value' => Type::nonNull(Type::float()),
        'starts_at' => Type::nonNull(Type::string()),
        'ends_at' => Type::nonNull(Type::string()),
        'usage_limit' => Type::int(),
        'status' => Type::string()
    ]
]);

$CouponUpdateInputType = new InputObjectType([
    'name' => "CouponUpdateInput",
    'fields' => [
        'code' => Type::string(),
        'type' => Type::string(),
        'value' => Type::float(),
        'starts_at' => Type::string(),
        'ends_at' => Type::string(),
        'usage_limit' => Type::int(),
        'status' => Type::string()
    ]
]);

$CouponResponseType = new ObjectType([
    'name' => 'CouponResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string(),
        'coupon' => $CouponType
    ]
]);

$CouponsResponseType = new ObjectType([
    'name' => 'CouponsResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string(),
        'coupons' => Type::listOf($CouponType),
        'total' => Type::int(),
        'limit' => Type::int(),
        'offset' => Type::int()
    ]
]);

$DeleteCouponResponseType = new ObjectType([
    'name' => 'DeleteCouponResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string()
    ]
]);
