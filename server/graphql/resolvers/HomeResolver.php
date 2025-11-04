<?php

require_once __DIR__ . '/../../models/Product.php';
require_once __DIR__ . '/../../models/BrowsingHistory.php';
require_once __DIR__ . '/../../models/SessionManager.php';

function getHome(mysqli $db, array $data): array
{
    try {
        $productModel = new Product($db);
        $sessionManager = new SessionManager($db);
        $sessionId = $sessionManager->getSessionId();
        $user = $sessionManager->getUser($sessionId);
        $userId = $user['id'] ?? ($_SESSION['user']['id'] ?? null);
        $limit = $data['limit'] ?? 10;
        $offset = $data['offset'] ?? 0;
        $search = $data['search'] ?? '';

        $recommended = $productModel->findAll($userId, $limit, $offset, $search, true);

        // Previously browsed by session/user
        $history = new BrowsingHistory($db);
        $recentIds = $history->getRecent($sessionId, $userId, 12);
        $previouslyBrowsed = [];
        foreach ($recentIds as $pid) {
            $p = $productModel->findById($pid, true);
            if ($p)
                $previouslyBrowsed[] = $p;
        }

        // Best deals: discounted, sort by discount_percentage desc
        $bestDeals = $productModel->findDiscountedProducts(12, 'DESC');

        // Discounted products: recent discounted
        $discounted = $productModel->findDiscountedProducts(12, 'DESC');

        return [
            'success' => true,
            'message' => 'Home page loaded successfully.',
            'home' => [
                'recommendedForYou' => $recommended,
                'previouslyBrowsed' => $previouslyBrowsed,
                'bestDeals' => $bestDeals,
                'discountedProducts' => $discounted
            ]
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'home' => []
        ];
    }
}