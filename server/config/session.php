<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$parsed = parse_url($origin);
$originHost = $parsed['host'] ?? '';

$sessionName = 'NOON_SESSION_ID';
if ($originHost === 'dashboard.localhost') {
    $sessionName = 'NOON_STORE_SESSION_ID';
}
session_name($sessionName);

$cookieParams = [
    'lifetime' => 259200,
    'path' => '/',
    'secure' => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Lax'
];


if ($originHost === 'dashboard.localhost') {
    $cookieParams['domain'] = 'dashboard.localhost';
}


session_set_cookie_params($cookieParams);


if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


if (!isset($_SESSION['guest_cart'])) {
    $_SESSION['guest_cart'] = [];
}
