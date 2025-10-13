<?php

use GraphQL\GraphQL;
use GraphQL\Error\FormattedError;
use GraphQL\Error\DebugFlag;
use Symfony\Component\HttpFoundation\Request;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/db.php';

$db = new Database();
$conn = $db->getConnection();

$schema = require_once __DIR__ . '/../graphql/schema.php';

$request = Request::createFromGlobals();

if (strpos($request->headers->get('Content-Type'), 'multipart/form-data') !== false) {
    $operations = json_decode($request->request->get('operations'), true);
    $map = json_decode($request->request->get('map'), true);

    foreach ($map as $key => $paths) {
        foreach ($paths as $path) {
            $segments = explode('.', $path);
            $ref = &$operations;
            foreach ($segments as $segment) {
                $ref = &$ref[$segment];
            }
            $ref = $_FILES[$key];
        }
    }

    $query = $operations['query'];
    $variables = $operations['variables'];
} else {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    $query = $input['query'] ?? null;
    $variables = $input['variables'] ?? [];
}

try {
    $result = GraphQL::executeQuery($schema, $query, null, ['db' => $conn], $variables);
    $output = $result->toArray(DebugFlag::INCLUDE_DEBUG_MESSAGE | DebugFlag::INCLUDE_TRACE);
} catch (Throwable $e) {
    http_response_code(500);
    error_log("GraphQL Error: " . $e->getMessage());
    error_log("GraphQL Stack Trace: " . $e->getTraceAsString());
    $output = ['error' => FormattedError::createFromException($e)];
}

echo json_encode($output);
