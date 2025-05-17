<?php
session_name('NOON_SESSION_ID');
session_set_cookie_params([
    'lifetime' => 259200,
    'path' => '/',
    'secure' => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Strict'
]);