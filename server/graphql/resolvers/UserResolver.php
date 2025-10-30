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
            'user' => $user
        ];
    } catch (Exception $e) {
        error_log('Error in getUser(): ' . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Error fetching user: ' . $e->getMessage(),
            'user' => null
        ];
    }
}

function updateUser(mysqli $db, array $args): array
{
    try {
        $userModel = new User($db);
        $user = $userModel->findById($args['id']);
        if (!$user) {
            return [
                'success' => false,
                'message' => 'User not found.',
                'user' => null
            ];
        }
        $updateData = [];
        if (isset($args['first_name']))
            $updateData['first_name'] = $args['first_name'];
        if (isset($args['last_name']))
            $updateData['last_name'] = $args['last_name'];
        if (isset($args['phone_number']))
            $updateData['phone_number'] = $args['phone_number'];
        // Allow updating birthday only if it's not set
        if (isset($args['birthday']) && (empty($user['birthday']) || $user['birthday'] == null)) {
            $updateData['birthday'] = $args['birthday'];
        }
        if (empty($updateData)) {
            return [
                'success' => false,
                'message' => 'No updatable data provided.',
                'user' => $user,
            ];
        }
        $updatedUser = $userModel->update((int) $args['id'], $updateData);
        return [
            'success' => $updatedUser ? true : false,
            'message' => $updatedUser ? 'Profile updated successfully.' : 'Failed to update profile.',
            'user' => $updatedUser,
        ];
    } catch (Exception $e) {
        error_log('Error in updateUser(): ' . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Error updating user: ' . $e->getMessage(),
            'user' => null
        ];
    }
}


