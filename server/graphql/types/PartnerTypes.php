<?php

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

$ParnterType = new ObjectType([
    'name' => 'Partner',
    'fields' => [
        'id' => Type::nonNull(Type::string()),
        'user_id' => Type::nonNull(Type::string()),
        'store_name' => Type::nonNull(Type::string()),
        'business_email' => Type::nonNull(Type::string()),
        'business_phone' => Type::string(),
        'status' => Type::string(),
        'created_at' => Type::string(),
        'updated_at' => Type::string(),
    ]
]);

$PartnerResponseType = new ObjectType([
    'name' => 'PartnerResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string(),
        'partner' => $ParnterType,
    ]
]);