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
