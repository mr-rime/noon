<?php
session_name('NOON_SESSION_ID');
session_set_cookie_params([
    'lifetime' => 259200,
    'path' => '/',
    'secure' => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Strict'
]);

if (!isset($_SESSION['guest_cart'])) {
    $_SESSION['guest_cart'] = []; // array of ['product_id' => quantity]
}