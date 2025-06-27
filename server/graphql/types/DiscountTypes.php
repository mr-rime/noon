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
        'ends_at' => Type::nonNull(Type::string())
    ]
]);

$DiscountInputType = new InputObjectType([
    'name' => "DiscountInput",
    'fields' => [
        'type' => Type::nonNull(Type::string()),
        'value' => Type::nonNull(Type::float()),
        'starts_at' => Type::nonNull(Type::string()),
        'ends_at' => Type::nonNull(Type::string())
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