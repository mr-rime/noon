<?php

function requireAuth($resolver)
{
    return function ($root, $args, $context) use ($resolver) {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        if (!isset($_SESSION['user'])) {
            return [
                'success' => false,
                'message' => 'Unauthorized',
                'user' => null,
            ];
        }

        return $resolver($root, $args, $context);
    };
}