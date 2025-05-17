<?php

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\UnionType;

$UserType = new ObjectType([
    'name' => 'user',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'hash' => Type::nonNull(Type::string()),
        'first_name' => Type::nonNull(Type::string()),
        'last_name' => Type::string(),
        'birthday' => Type::string(),
        'email' => Type::nonNull(Type::string())
    ]
]);

$UserOrUserListType = new UnionType([
    'name' => 'UserOrUserList',
    'types' => [$UserType, Type::listOf($UserType)],
    'resolveType' => function ($value) use ($UserType) {
        if (is_array($value)) {
            return Type::listOf($UserType);
        }
        return $UserType;
    }
]);

$UserResponseType = new ObjectType([
    'name' => 'UserResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'user' => Type::listOf($UserType),
    ]
]);

$UsersResponseType = new ObjectType([
    'name' => 'UsersResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'users' => Type::listOf($UserType),
    ]
]);