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
    'lifetime' => 259200, // 3 days
    'path' => '/',
    'secure' => isset($_SERVER['HTTPS']), // false on http, true on https
    'httponly' => true,
    'samesite' => 'Lax' // more compatible for localhost cross-port
];

// Allow dashboard.localhost cookies to be same-site
if ($originHost === 'dashboard.localhost') {
    $cookieParams['domain'] = 'dashboard.localhost';
}

// Apply cookie params before session_start()
session_set_cookie_params($cookieParams);

// --- Start session if not active ---
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// --- Initialize default session data ---
if (!isset($_SESSION['guest_cart'])) {
    $_SESSION['guest_cart'] = []; // [product_id => quantity]
}
