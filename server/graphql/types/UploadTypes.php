<?php
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

use GraphQL\Type\Definition\ScalarType;
use GraphQL\Language\AST\ValueNode;

class UploadType extends ScalarType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Upload',
            'description' => 'The `Upload` scalar type represents a file upload.',
        ]);
    }

    public function serialize($value)
    {
        throw new \Exception('Upload cannot be serialized.');
    }

    public function parseValue($value)
    {
        return $value;
    }

    public function parseLiteral(\GraphQL\Language\AST\Node $valueNode, ?array $variables = null)
    {
        return null;
    }
}


$UploadScalar = new UploadType();

$UploadResponseType = new ObjectType([
    'name' => 'UploadResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'url' => Type::string(),
    ],
]);

