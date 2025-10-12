<?php

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

$DiscountType = new ObjectType([
    'name' => "Discount",
    'fields' => [
        'id' => Type::nonNull(Type::id()),
        'product_id' => Type::nonNull(Type::string()),
        'type' => Type::nonNull(Type::string()),
        'value' => Type::nonNull(Type::float()),
        'starts_at' => Type::nonNull(Type::string()),
        'ends_at' => Type::nonNull(Type::string()),
        'product_name' => Type::string(),
        'psku' => Type::string(),
        'product_price' => Type::float(),
        'currency' => Type::string()
    ]
]);

$DiscountInputType = new InputObjectType([
    'name' => "DiscountInput",
    'fields' => [
        'product_id' => Type::nonNull(Type::string()),
        'type' => Type::nonNull(Type::string()),
        'value' => Type::nonNull(Type::float()),
        'starts_at' => Type::nonNull(Type::string()),
        'ends_at' => Type::nonNull(Type::string())
    ]
]);

$DiscountUpdateInputType = new InputObjectType([
    'name' => "DiscountUpdateInput",
    'fields' => [
        'type' => Type::string(),
        'value' => Type::float(),
        'starts_at' => Type::string(),
        'ends_at' => Type::string()
    ]
]);

$DiscountResponseType = new ObjectType([
    'name' => 'DiscountResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string(),
        'discount' => $DiscountType
    ]
]);

$DiscountsResponseType = new ObjectType([
    'name' => 'DiscountsResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string(),
        'discounts' => Type::listOf($DiscountType),
        'total' => Type::int(),
        'limit' => Type::int(),
        'offset' => Type::int()
    ]
]);

$DeleteDiscountResponseType = new ObjectType([
    'name' => 'DeleteDiscountResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string()
    ]
]);