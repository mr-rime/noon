<?php

class ReviewHelpfulVote
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function findByReviewAndUser(int $reviewId, int $userId): ?array
    {
        $query = 'SELECT * FROM review_helpful_votes WHERE review_id = ? AND user_id = ? LIMIT 1';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }
        $stmt->bind_param('ii', $reviewId, $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc() ?: null;
    }

    public function create(int $reviewId, int $userId): ?array
    {
        if ($this->findByReviewAndUser($reviewId, $userId)) {
            return null;
        }

        $query = 'INSERT INTO review_helpful_votes (review_id, user_id) VALUES (?, ?)';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }
        $stmt->bind_param('ii', $reviewId, $userId);
        if ($stmt->execute()) {
            $id = $stmt->insert_id;
            return $this->findById($id);
        }
        error_log("Execute failed: " . $stmt->error);
        return null;
    }

    public function findById(int $id): ?array
    {
        $query = 'SELECT * FROM review_helpful_votes WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc() ?: null;
    }

    public function delete(int $id): bool
    {
        $query = 'DELETE FROM review_helpful_votes WHERE id = ?';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }
        $stmt->bind_param('i', $id);
        return $stmt->execute();
    }

    public function getVotesCount(int $reviewId): int
    {
        $query = 'SELECT COUNT(*) as count FROM review_helpful_votes WHERE review_id = ?';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return 0;
        }
        $stmt->bind_param('i', $reviewId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        return (int) ($row['count'] ?? 0);
    }
}