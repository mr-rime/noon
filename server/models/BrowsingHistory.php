<?php

class BrowsingHistory
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
        $this->ensureTable();
    }

    private function ensureTable(): void
    {
        $this->db->query(
            "CREATE TABLE IF NOT EXISTS browsing_history (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                session_id VARCHAR(128) NOT NULL,
                user_id INT NULL,
                product_id VARCHAR(64) NOT NULL,
                viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_session_id (session_id),
                INDEX idx_user_id (user_id),
                INDEX idx_product_session (product_id, session_id),
                INDEX idx_viewed_at (viewed_at)
            )"
        );
    }

    public function logView(string $sessionId, ?int $userId, string $productId): void
    {
        $del = $this->db->prepare("DELETE FROM browsing_history WHERE session_id = ? AND product_id = ?");
        $del->bind_param('ss', $sessionId, $productId);
        $del->execute();

        $stmt = $this->db->prepare("INSERT INTO browsing_history (session_id, user_id, product_id) VALUES (?, ?, ?)");
        $stmt->bind_param('sis', $sessionId, $userId, $productId);
        $stmt->execute();

        $cleanup = $this->db->prepare(
            "DELETE FROM browsing_history 
             WHERE session_id = ? AND id NOT IN (
               SELECT id FROM (
                 SELECT id FROM browsing_history WHERE session_id = ? ORDER BY viewed_at DESC LIMIT 50
               ) as t
             )"
        );
        $cleanup->bind_param('ss', $sessionId, $sessionId);
        $cleanup->execute();
    }

    public function getRecent(string $sessionId, ?int $userId, int $limit = 12): array
    {
        if ($userId) {
            $stmt = $this->db->prepare(
                "SELECT product_id FROM browsing_history WHERE user_id = ? ORDER BY viewed_at DESC LIMIT ?"
            );
            $stmt->bind_param('ii', $userId, $limit);
        } else {
            $stmt = $this->db->prepare(
                "SELECT product_id FROM browsing_history WHERE session_id = ? ORDER BY viewed_at DESC LIMIT ?"
            );
            $stmt->bind_param('si', $sessionId, $limit);
        }

        $stmt->execute();
        $res = $stmt->get_result();
        $productIds = [];
        while ($row = $res->fetch_assoc()) {
            $productIds[] = $row['product_id'];
        }
        return $productIds;
    }
}


