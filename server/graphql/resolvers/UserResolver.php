<?php

require_once __DIR__ . '/../../models/User.php';

function getUsers(mysqli $db): array
{
    try {
        $userModel = new User($db);

        $users = $userModel->find();

        if (!is_array($users)) {
            return [
                'success' => false,
                'message' => 'Unexpected response from user model.',
                'users' => []
            ];
        }

        return [
            'success' => true,
            'message' => 'Users retrieved successfully.',
            'users' => $users
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error fetching users: ' . $e->getMessage(),
            'users' => []
        ];
    }
}

function getUser(mysqli $db, string $hash): array
{
    try {
        $userModel = new User($db);

        $user = $userModel->findByHash($hash);



        if ($user === null) {
            return [
                'success' => false,
                'message' => 'User not found.',
                'user' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'User retrieved successfully.',
            'user' => [$user]
        ];
    } catch (Exception $e) {
        error_log($user);
        return [
            'success' => false,
            'message' => 'Error fetching user: ' . $e->getMessage(),
            'user' => []
        ];
    }
}

