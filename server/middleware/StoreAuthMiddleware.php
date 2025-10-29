<?php

require_once __DIR__ . '/../models/SessionManager.php';
require_once __DIR__ . '/../log/logger.php';

function requireStoreAuth($resolver)
{
    return function ($root, $args, $context) use ($resolver) {
        $db = $context['db'] ?? null;
        if ($db instanceof mysqli) {
            $sessionManager = new SessionManager($db);
            $sessionId = $sessionManager->getSessionId();
            error_log('StoreAuthMiddleware.requireStoreAuth: checking session ' . json_encode([
                'session_id_present' => (bool) $sessionId,
            ]));
            $store = $sessionManager->getStore($sessionId);
            if ($store) {
                error_log('StoreAuthMiddleware.requireStoreAuth: store found ' . json_encode([
                    'store_id' => $store['id'] ?? null,
                    'store_email' => $store['email'] ?? null,
                ]));
                $context['store'] = $store;
                return $resolver($root, $args, $context);
            }
            error_log('StoreAuthMiddleware.requireStoreAuth: store not found ' . json_encode([
                'session_id' => substr($sessionId, 0, 8) . '...'
            ]));
        }

        return [
            'success' => false,
            'message' => 'Unauthorized - Store session required',
            'store' => null,
        ];
    };
}

function requireStoreOrUserAuth($resolver)
{
    return function ($root, $args, $context) use ($resolver) {
        $db = $context['db'] ?? null;
        if ($db instanceof mysqli) {
            $sessionManager = new SessionManager($db);
            $sessionId = $sessionManager->getSessionId();
            error_log('StoreAuthMiddleware.requireStoreOrUserAuth: checking session ' . json_encode([
                'session_id_present' => (bool) $sessionId,
            ]));

            $store = $sessionManager->getStore($sessionId);
            if ($store) {
                error_log('StoreAuthMiddleware.requireStoreOrUserAuth: store session ' . json_encode([
                    'store_id' => $store['id'] ?? null,
                    'store_email' => $store['email'] ?? null,
                ]));
                $context['store'] = $store;
                $context['userType'] = 'store';
                return $resolver($root, $args, $context);
            }

            $user = $sessionManager->getUser($sessionId);
            if ($user) {
                error_log('StoreAuthMiddleware.requireStoreOrUserAuth: user session ' . json_encode([
                    'user_id' => $user['id'] ?? null,
                    'user_email' => $user['email'] ?? null,
                ]));
                $context['user'] = $user;
                $context['userType'] = 'user';
                return $resolver($root, $args, $context);
            }
            error_log('StoreAuthMiddleware.requireStoreOrUserAuth: no session found ' . json_encode([
                'session_id' => substr($sessionId, 0, 8) . '...'
            ]));
        }

        return [
            'success' => false,
            'message' => 'Unauthorized - Authentication required',
            'store' => null,
            'user' => null,
        ];
    };
}
