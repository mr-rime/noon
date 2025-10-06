<?php
// Choose session name per origin to separate dashboard store sessions
$sessionName = 'NOON_SESSION_ID';
if (($originHost ?? '') === 'dashboard.localhost') {
    $sessionName = 'NOON_STORE_SESSION_ID';
}
session_name($sessionName);

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$parsed = parse_url($origin);
$originHost = $parsed['host'] ?? '';

// Default cookie params
$cookieParams = [
    'lifetime' => 259200,
    'path' => '/',
    'secure' => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Strict'
];

// If frontend is dashboard.localhost, align cookies to that site so requests remain same-site
if ($originHost === 'dashboard.localhost') {
    $cookieParams['domain'] = 'dashboard.localhost';
    // Same-site requests across ports work with Lax; keep http in dev
    $cookieParams['samesite'] = 'Lax';
    $cookieParams['secure'] = false;
}

session_set_cookie_params($cookieParams);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['guest_cart'])) {
    $_SESSION['guest_cart'] = []; // [product_id => quantity]
}