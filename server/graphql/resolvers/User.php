<?php


function createUser($first_name, $last_name, $email, $passowrd, $conn)
{
    $userModel = new User($conn);

    return $userModel->create($first_name, $last_name, $email, $passowrd);
}