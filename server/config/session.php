<?php
session_name('NOON_SESSION_ID');
session_set_cookie_params([
    'lifetime' => 1800,
    'path' => '/',
    'secure' => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Strict'
]);