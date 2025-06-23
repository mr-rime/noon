<?php

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

$ProductSpecificationType = new ObjectType([
    'name' => 'ProductSpecification',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'spec_name' => Type::nonNull(Type::string()),
        'spec_value' => Type::nonNull(Type::string()),
    ],
]);
