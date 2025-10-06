<?php

require_once __DIR__ . '/../../models/Store.php';

function createStore(mysqli $db, array $input): ?array
{
    $model = new Store($db);
    // Transaction, in case later we add file move logic
    $db->begin_transaction();
    try {
        $store = $model->create($input);
        if (!$store)
            throw new Exception('Failed to create store (email may already exist)');
        $db->commit();
        return $store;
    } catch (Exception $e) {
        $db->rollback();
        error_log('createStore error: ' . $e->getMessage());
        return null;
    }
}

function updateStore(mysqli $db, array $input): ?array
{
    $model = new Store($db);
    return $model->update($input);
}

function deleteStore(mysqli $db, int $id): bool
{
    $model = new Store($db);
    return $model->delete($id);
}

function getStore(mysqli $db, int $id): ?array
{
    $model = new Store($db);
    return $model->findById($id);
}

function getStores(mysqli $db): array
{
    $model = new Store($db);
    return $model->findAll();
}


