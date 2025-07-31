<?php

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;


$Wishlist = new ObjectType([
    'name' => 'Wishlist',
    'fields' => [
        'id' => Type::nonNull(Type::ID()),
        'user_id' => Type::nonNull(Type::string()),
        'name' => Type::nonNull(Type::string()),
        'is_private' => Type::nonNull(Type::boolean()),
        'is_default' => Type::nonNull(Type::boolean()),
        'item_count' => Type::int(),
        'created_at' => Type::string()
    ]
]);

$WishlistItem = new ObjectType([
    'name' => 'WishlistItem',
    'fields' => [
        'wishlist_id' => Type::nonNull(Type::string()),
        'product_id' => Type::nonNull(Type::string()),
        'added_at' => Type::string(),
    ]
]);


$WishlistResponse = new ObjectType([
    'name' => 'WishlistResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string(),
        'data' => $Wishlist
    ]
]);

$WishlistsResponse = new ObjectType([
    'name' => 'WishlistsResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string(),
        'data' => Type::listOf($Wishlist)
    ]
]);

$WishlistItemsResponse = new ObjectType([
    'name' => 'WihslistItemsResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string(),
        'data' => Type::listOf($ProductType)
    ]
]);