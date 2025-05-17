<?php

require_once __DIR__ . '/../../models/Review.php';
require_once __DIR__ . '/../../models/ReviewHelpfulVote.php';

function getReviewsByProduct(mysqli $db, int $productId): array
{
    try {
        $model = new Review($db);
        $reviews = $model->findByProductId($productId);

        return [
            'success' => true,
            'message' => 'Reviews retrieved successfully.',
            'reviews' => $reviews
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error fetching reviews: ' . $e->getMessage(),
            'reviews' => []
        ];
    }
}

function createReview(mysqli $db, array $data): array
{
    try {
        $model = new Review($db);
        $review = $model->create($data);

        if (!$review) {
            return [
                'success' => false,
                'message' => 'Failed to create review.',
                'review' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Review created successfully.',
            'review' => $review
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error creating review: ' . $e->getMessage(),
            'review' => null
        ];
    }
}

function updateReview(mysqli $db, int $id, array $data): array
{
    try {
        $model = new Review($db);
        $review = $model->update($id, $data);

        return [
            'success' => $review !== null,
            'message' => $review ? 'Review updated successfully.' : 'Failed to update review.',
            'review' => $review
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error updating review: ' . $e->getMessage(),
            'review' => null
        ];
    }
}

function deleteReview(mysqli $db, int $id): array
{
    try {
        $model = new Review($db);
        $success = $model->delete($id);

        return [
            'success' => $success,
            'message' => $success ? 'Review deleted.' : 'Failed to delete review.'
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error deleting review: ' . $e->getMessage()
        ];
    }
}

function voteHelpful(mysqli $db, int $reviewId, int $userId): array
{
    try {
        $model = new ReviewHelpfulVote($db);
        $vote = $model->create($reviewId, $userId);

        if (!$vote) {
            return [
                'success' => false,
                'message' => 'You have already voted.',
                'vote' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Vote recorded.',
            'vote' => $vote
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error voting helpful: ' . $e->getMessage(),
            'vote' => null
        ];
    }
}

function deleteHelpfulVote(mysqli $db, int $voteId): array
{
    try {
        $model = new ReviewHelpfulVote($db);
        $success = $model->delete($voteId);

        return [
            'success' => $success,
            'message' => $success ? 'Vote removed.' : 'Vote not found.'
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error deleting vote: ' . $e->getMessage()
        ];
    }
}
