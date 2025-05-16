<?php

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;


$UserType = new ObjectType([
    'name' => 'user',
    'fields' => [
        'id' => Type::nonNull(Type::id()),
        'hash' => Type::nonNull(Type::string()),
        'first_name' => Type::nonNull(Type::string()),
        'last_name' => Type::string(),
        'birthday' => Type::string(),
        'email' => Type::nonNull(Type::string())
    ]
]);


$QueryType = new ObjectType([
    'name' => 'query',
    'fields' => [
        ''
    ]
]);


return new Schema(config: [
    'query' => $QueryType
]);