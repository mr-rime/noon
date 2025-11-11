<?php


require_once __DIR__ . '/../../models/BrowsingHistory.php';
require_once __DIR__ . '/../../models/Product.php';
require_once __DIR__ . '/../../models/SessionManager.php';

function logProductView(mysqli $db, array $args): array
{
    try {
        $sessionManager = new SessionManager($db);
        $sessionId = $sessionManager->getSessionId();

        $user = $sessionManager->getUser($sessionId);
        $userId = $user['id'] ?? ($_SESSION['user']['id'] ?? null);

        $productId = $args['productId'] ?? null;
        if (!$productId) {
            throw new Exception('Product ID is required.');
        }

        $history = new BrowsingHistory($db);
        $history->logView($sessionId, $userId, $productId);

        return [
            'success' => true,
            'message' => 'Product view logged successfully.'
        ];
    } catch (Exception $e) {
        error_log('logProductView error: ' . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ];
    }
}


function getRecentBrowsingHistory(mysqli $db, array $args): array
{
    try {
        $limit = $args['limit'] ?? 12;

        $sessionManager = new SessionManager($db);
        $sessionId = $sessionManager->getSessionId();

        $user = $sessionManager->getUser($sessionId);
        $userId = $user['id'] ?? ($_SESSION['user']['id'] ?? null);

        $history = new BrowsingHistory($db);
        $productIds = $history->getRecent($sessionId, $userId, $limit);

        if (empty($productIds)) {
            return [
                'success' => true,
                'message' => 'No recent browsing history found.',
                'products' => []
            ];
        }

        $productModel = new Product($db);
        $products = [];

        foreach ($productIds as $pid) {
            $product = $productModel->findById($pid, true);
            if ($product) {
                $products[] = $product;
            }
        }

        return [
            'success' => true,
            'message' => 'Recent browsing history retrieved successfully.',
            'products' => $products
        ];
    } catch (Exception $e) {
        error_log('getRecentBrowsingHistory error: ' . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'products' => []
        ];
    }
}


function clearBrowsingHistory(mysqli $db): array
{
    try {
        $sessionManager = new SessionManager($db);
        $sessionId = $sessionManager->getSessionId();

        $stmt = $db->prepare("DELETE FROM browsing_history WHERE session_id = ?");
        $stmt->bind_param('s', $sessionId);
        $stmt->execute();

        return [
            'success' => true,
            'message' => 'Browsing history cleared successfully.'
        ];
    } catch (Exception $e) {
        error_log('clearBrowsingHistory error: ' . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ];
    }
}

