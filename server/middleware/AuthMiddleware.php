<?php

require_once __DIR__ . '/../models/SessionManager.php';

function requireAuth($resolver)
{
    return function ($root, $args, $context) use ($resolver) {

        $db = $context['db'] ?? null;
        if (!$db || !($db instanceof mysqli)) {

            if (session_status() !== PHP_SESSION_ACTIVE) {
                if (isset($_COOKIE['NOON_SESSION_ID'])) {
                    session_start();
                }
            }

            if (!isset($_SESSION['user'])) {
                return [
                    'success' => false,
                    'message' => 'Unauthorized',
                    'user' => null,
                ];
            }

            $context['user_id'] = $_SESSION['user']['id'];
            return $resolver($root, $args, $context);
        }

        $sessionManager = new SessionManager($db);
        $sessionId = $sessionManager->getSessionId();


        $user = $sessionManager->getUser($sessionId);


        if (!$user) {
            if (session_status() !== PHP_SESSION_ACTIVE) {
                if (isset($_COOKIE['NOON_SESSION_ID'])) {
                    session_start();
                }
            }

            if (!isset($_SESSION['user'])) {
                return [
                    'success' => false,
                    'message' => 'Unauthorized',
                    'user' => null,
                ];
            }

            $user = $_SESSION['user'];
        }

        $context['user_id'] = $user['id'];

        return $resolver($root, $args, $context);
    };
}
