<?php

function requireAuth($resolver)
{
    return function ($root, $args, $context) use ($resolver) {
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
    };
}
