<?php

use GraphQL\Type\Definition\Type;

return [
    'uploadImage' => [
        'type' => $UploadResponseType,
        'args' => [
            'file' => Type::nonNull($FileInputType),
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => uploadImageResolver($args))
    ],

    'batchUploadImages' => [
        'type' => $BatchUploadResponseType,
        'args' => [
            'files' => Type::nonNull(Type::listOf($FileInputType)),
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => batchUploadImagesResolver($args))
    ],

    'deleteImages' => [
        'type' => $DeleteImageResponseType,
        'args' => [
            'fileKeys' => Type::listOf(Type::string()),
            'imageIds' => Type::listOf(Type::int()),
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => deleteImagesResolver($args, $context))
    ],
];
