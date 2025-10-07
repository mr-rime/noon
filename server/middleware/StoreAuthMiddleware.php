<?php

function requireStoreAuth($resolver)
{
    return function ($root, $args, $context) use ($resolver) {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            // Try to start session based on dashboard or regular session name
            $sessionName = 'NOON_STORE_SESSION_ID';
            if (isset($_COOKIE[$sessionName])) {
                session_name($sessionName);
                session_start();
            } else {
                // Fallback to regular session
                session_start();
            }
        }

        if (!isset($_SESSION['store'])) {
            return [
                'success' => false,
                'message' => 'Unauthorized - Store session required',
                'store' => null,
            ];
        }

        // Add store info to context for resolvers
        $context['store'] = $_SESSION['store'];

        return $resolver($root, $args, $context);
    };
}

function requireStoreOrUserAuth($resolver)
{
    return function ($root, $args, $context) use ($resolver) {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        $authenticated = false;
        $userType = null;

        // Check for store authentication
        if (isset($_SESSION['store'])) {
            $authenticated = true;
            $userType = 'store';
            $context['store'] = $_SESSION['store'];
        }
        // Check for user authentication
        elseif (isset($_SESSION['user'])) {
            $authenticated = true;
            $userType = 'user';
            $context['user'] = $_SESSION['user'];
        }

        if (!$authenticated) {
            return [
                'success' => false,
                'message' => 'Unauthorized - Authentication required',
                'store' => null,
                'user' => null,
            ];
        }

        // Add user type to context
        $context['userType'] = $userType;

        return $resolver($root, $args, $context);
    };
}
