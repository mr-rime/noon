<?php

use GraphQL\Type\Definition\Type;

return [
    'getRecentBrowsingHistory' => [
        'type' => $BrowsingHistoryListResponseType,
        'args' => [
            'limit' => Type::int()
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => getRecentBrowsingHistory($context['db'], $args))
    ],
];
