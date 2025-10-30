<?php

use GraphQL\GraphQL;
use GraphQL\Error\FormattedError;
use GraphQL\Error\DebugFlag;
use Symfony\Component\HttpFoundation\Request;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/session.php';

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

    // Support batched multipart operations
    if (is_array($operations) && array_is_list($operations)) {
        $responses = [];
        foreach ($operations as $op) {
            $query = $op['query'] ?? null;
            $variables = $op['variables'] ?? [];
            $operationName = $op['operationName'] ?? null;

            try {
                $context = ['db' => $conn];
                if (isset($_SESSION['user']['id'])) {
                    $context['user_id'] = $_SESSION['user']['id'];
                }

                $result = GraphQL::executeQuery($schema, $query, null, $context, $variables, $operationName);
                $responses[] = $result->toArray(DebugFlag::INCLUDE_DEBUG_MESSAGE | DebugFlag::INCLUDE_TRACE);
            } catch (Throwable $e) {
                error_log("GraphQL Multipart Batch Error: " . $e->getMessage());
                $responses[] = ['error' => FormattedError::createFromException($e)];
            }
        }

        echo json_encode($responses);
        exit;
    }

    $query = $operations['query'] ?? null;
    $variables = $operations['variables'] ?? [];
} else {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    // if batching is enabled Apollo sends an array of operations
    if (is_array($input) && array_is_list($input)) {
        $responses = [];
        foreach ($input as $op) {
            $query = $op['query'] ?? null;
            $variables = $op['variables'] ?? [];
            $operationName = $op['operationName'] ?? null;

            try {
                $context = ['db' => $conn];
                if (isset($_SESSION['user']['id'])) {
                    $context['user_id'] = $_SESSION['user']['id'];
                }

                $result = GraphQL::executeQuery($schema, $query, null, $context, $variables, $operationName);
                $responses[] = $result->toArray(DebugFlag::INCLUDE_DEBUG_MESSAGE | DebugFlag::INCLUDE_TRACE);
            } catch (Throwable $e) {
                error_log("GraphQL Batch Error: " . $e->getMessage());
                $responses[] = ['error' => FormattedError::createFromException($e)];
            }
        }

        echo json_encode($responses);
        exit;
    }

    $query = $input['query'] ?? null;
    $variables = $input['variables'] ?? [];
    $operationName = $input['operationName'] ?? null;
}

try {
    $context = ['db' => $conn];
    if (isset($_SESSION['user']['id'])) {
        $context['user_id'] = $_SESSION['user']['id'];
    }

    $result = GraphQL::executeQuery($schema, $query, null, $context, $variables, $operationName ?? null);
    $output = $result->toArray(DebugFlag::INCLUDE_DEBUG_MESSAGE | DebugFlag::INCLUDE_TRACE);
} catch (Throwable $e) {
    http_response_code(500);
    error_log("GraphQL Error: " . $e->getMessage());
    error_log("GraphQL Stack Trace: " . $e->getTraceAsString());
    $output = ['error' => FormattedError::createFromException($e)];
}

echo json_encode($output);
