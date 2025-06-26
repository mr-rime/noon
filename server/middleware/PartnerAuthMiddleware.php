<?php

function requirePartnerAuth($resolver)
{
    return function ($root, $args, $context) use ($resolver) {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            if (isset($_COOKIE['PARTNER_SESSION'])) {
                session_start();
            }
        }

        if (!isset($_SESSION['partner_authenticated']) || $_SESSION['partner_authenticated'] !== true) {
            throw new Exception('Invalid session');
        }

        return $resolver($root, $args, $context);
    };
}

