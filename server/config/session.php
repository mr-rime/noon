<?php
session_name('NOON_SESSION_ID');
session_set_cookie_params([
    'lifetime' => 259200,
    'path' => '/',
    'secure' => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Strict'
]);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['guest_cart'])) {
    $_SESSION['guest_cart'] = []; // [product_id => quantity]
}