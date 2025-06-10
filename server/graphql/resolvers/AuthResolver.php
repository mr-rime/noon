<?php

require_once __DIR__ . '/../../services/AuthService.php';

function login(array $data)
{
    $auth = new AuthService($data['db']);

    return $auth->login($data['email'], $data['password']);
}

function register(array $data)
{
    $auth = new AuthService($data['db']);

    return $auth->register($data);
}

function logout()
{
    $auth = new AuthService(null);

    return $auth->logout();
}