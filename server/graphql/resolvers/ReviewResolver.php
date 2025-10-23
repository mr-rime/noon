<?php

require_once __DIR__ . '/../../models/Review.php';
require_once __DIR__ . '/../../models/ReviewHelpfulVote.php';
require_once __DIR__ . '/../../models/User.php';

function getProductReviews($db, $args, $context = [])
{
    try {
        $reviewModel = new Review($db);
        $productId = $args['productId'];
        $limit = $args['limit'] ?? 10;
        $offset = $args['offset'] ?? 0;

        $query = "
            SELECT r.*, u.first_name, u.last_name 
            FROM reviews r 
            LEFT JOIN users u ON r.user_id = u.id 
            WHERE r.product_id = ? 
            ORDER BY r.created_at DESC 
            LIMIT ? OFFSET ?
        ";

        $stmt = $db->prepare($query);
        if (!$stmt) {
            return [
                'success' => false,
                'message' => 'Database error: ' . $db->error,
                'reviews' => [],
                'total' => 0,
                'average_rating' => 0
            ];
        }

        $stmt->bind_param('sii', $productId, $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        $reviews = [];

        while ($row = $result->fetch_assoc()) {

            $voteModel = new ReviewHelpfulVote($db);
            $votesCount = $voteModel->getVotesCount($row['id']);


            $userHasVoted = false;
            if (isset($args['user_id']) && $args['user_id']) {
                $userHasVoted = $voteModel->findByReviewAndUser($row['id'], $args['user_id']) !== null;
            }

            $reviews[] = [
                'id' => (int) $row['id'],
                'product_id' => $row['product_id'],
                'user_id' => (int) $row['user_id'],
                'rating' => (int) $row['rating'],
                'title' => $row['title'] ?? '',
                'comment' => $row['comment'],
                'verified_purchase' => (bool) $row['verified_purchase'],
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at'],
                'user' => [
                    'id' => (int) $row['user_id'],
                    'first_name' => $row['first_name'],
                    'last_name' => $row['last_name']
                ],
                'helpful_votes_count' => $votesCount,
                'user_has_voted' => $userHasVoted
            ];
        }


        $countQuery = "SELECT COUNT(*) as total FROM reviews WHERE product_id = ?";
        $countStmt = $db->prepare($countQuery);
        $countStmt->bind_param('s', $productId);
        $countStmt->execute();
        $total = $countStmt->get_result()->fetch_assoc()['total'];


        $avgQuery = "SELECT AVG(CAST(rating AS DECIMAL(3,2))) as avg_rating FROM reviews WHERE product_id = ?";
        $avgStmt = $db->prepare($avgQuery);
        $avgStmt->bind_param('s', $productId);
        $avgStmt->execute();
        $avgResult = $avgStmt->get_result()->fetch_assoc();
        $averageRating = $avgResult['avg_rating'] ? round((float) $avgResult['avg_rating'], 1) : 0.0;


        return [
            'success' => true,
            'message' => 'Reviews retrieved successfully',
            'reviews' => $reviews,
            'total' => (int) $total,
            'average_rating' => $averageRating
        ];

    } catch (Exception $e) {
        error_log("Error getting product reviews: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to retrieve reviews',
            'reviews' => [],
            'total' => 0,
            'average_rating' => 0
        ];
    }
}

function getUserReview($db, $args)
{
    try {
        $productId = $args['productId'];
        $orderId = $args['orderId'] ?? null;

        if (!isset($args['user_id'])) {
            return [
                'success' => false,
                'message' => 'User not authenticated',
                'review' => null
            ];
        }

        $userId = $args['user_id'];

        $query = "
            SELECT r.*, u.first_name, u.last_name 
            FROM reviews r 
            LEFT JOIN users u ON r.user_id = u.id 
            WHERE r.product_id = ? AND r.user_id = ?
            ORDER BY r.created_at DESC LIMIT 1
        ";

        $stmt = $db->prepare($query);
        if (!$stmt) {
            return [
                'success' => false,
                'message' => 'Database error: ' . $db->error,
                'review' => null
            ];
        }

        $stmt->bind_param('si', $productId, $userId);

        $stmt->execute();
        $result = $stmt->get_result();
        $reviewData = $result->fetch_assoc();

        if (!$reviewData) {
            return [
                'success' => true,
                'message' => 'No review found',
                'review' => null
            ];
        }


        $voteModel = new ReviewHelpfulVote($db);
        $votesCount = $voteModel->getVotesCount($reviewData['id']);


        $userHasVoted = false;
        if (isset($args['user_id'])) {
            $userHasVoted = $voteModel->findByReviewAndUser($reviewData['id'], $args['user_id']) !== null;
        }

        $review = [
            'id' => (int) $reviewData['id'],
            'product_id' => $reviewData['product_id'],
            'user_id' => (int) $reviewData['user_id'],
            'rating' => (int) $reviewData['rating'],
            'title' => $reviewData['title'] ?? '',
            'comment' => $reviewData['comment'],
            'verified_purchase' => (bool) $reviewData['verified_purchase'],
            'created_at' => $reviewData['created_at'],
            'updated_at' => $reviewData['updated_at'],
            'user' => [
                'id' => (int) $reviewData['user_id'],
                'first_name' => $reviewData['first_name'],
                'last_name' => $reviewData['last_name']
            ],
            'helpful_votes_count' => $votesCount,
            'user_has_voted' => $userHasVoted
        ];

        return [
            'success' => true,
            'message' => 'Review retrieved successfully',
            'review' => $review
        ];

    } catch (Exception $e) {
        error_log("Error getting user review: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to retrieve review',
            'review' => null
        ];
    }
}

function createProductReview($db, $args)
{
    try {
        $reviewModel = new Review($db);


        if (!isset($args['user_id']) || $args['user_id'] === null) {
            return [
                'success' => false,
                'message' => 'User must be authenticated to create a review',
                'review' => null
            ];
        }


        if (empty($args['product_id']) || empty($args['rating'])) {
            return [
                'success' => false,
                'message' => 'Product ID and rating are required',
                'review' => null
            ];
        }


        if ($args['rating'] < 1 || $args['rating'] > 5) {
            return [
                'success' => false,
                'message' => 'Rating must be between 1 and 5',
                'review' => null
            ];
        }

        $reviewData = [
            'product_id' => $args['product_id'],
            'user_id' => $args['user_id'], // Should be set by auth middleware
            'rating' => $args['rating'],
            'title' => $args['title'] ?? '',
            'comment' => $args['comment'] ?? '',
            'verified_purchase' => $args['verified_purchase'] ?? false
        ];


        $existingReview = $reviewModel->findByProductAndUser($args['product_id'], $args['user_id']);
        if ($existingReview) {
            return [
                'success' => false,
                'message' => 'You have already reviewed this product',
                'review' => null
            ];
        }

        $review = $reviewModel->create($reviewData);

        if (!$review) {
            return [
                'success' => false,
                'message' => 'Failed to create review',
                'review' => null
            ];
        }


        $userModel = new User($db);
        $user = $userModel->findById($review['user_id']);

        $review['user'] = $user ? [
            'id' => $user['id'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name']
        ] : null;

        return [
            'success' => true,
            'message' => 'Review created successfully',
            'review' => $review
        ];

    } catch (Exception $e) {
        error_log("Error creating product review: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to create review',
            'review' => null
        ];
    }
}

function updateProductReview($db, $args)
{
    try {
        $reviewModel = new Review($db);
        $reviewId = $args['id'];
        $userId = $args['user_id']; // Should be set by auth middleware


        $existingReview = $reviewModel->findById($reviewId);
        if (!$existingReview) {
            return [
                'success' => false,
                'message' => 'Review not found',
                'review' => null
            ];
        }

        if ($existingReview['user_id'] != $userId) {
            return [
                'success' => false,
                'message' => 'You can only edit your own reviews',
                'review' => null
            ];
        }


        if (isset($args['rating']) && ($args['rating'] < 1 || $args['rating'] > 5)) {
            return [
                'success' => false,
                'message' => 'Rating must be between 1 and 5',
                'review' => null
            ];
        }

        $updateData = [];
        if (isset($args['rating'])) {
            $updateData['rating'] = $args['rating'];
        }
        if (isset($args['title'])) {
            $updateData['title'] = $args['title'];
        }
        if (isset($args['comment'])) {
            $updateData['comment'] = $args['comment'];
        }

        if (empty($updateData)) {
            return [
                'success' => false,
                'message' => 'No fields to update',
                'review' => $existingReview
            ];
        }

        $review = $reviewModel->update($reviewId, $updateData);

        if (!$review) {
            return [
                'success' => false,
                'message' => 'Failed to update review',
                'review' => null
            ];
        }


        $userModel = new User($db);
        $user = $userModel->findById($review['user_id']);

        $review['user'] = $user ? [
            'id' => $user['id'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name']
        ] : null;

        return [
            'success' => true,
            'message' => 'Review updated successfully',
            'review' => $review
        ];

    } catch (Exception $e) {
        error_log("Error updating product review: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to update review',
            'review' => null
        ];
    }
}

function deleteProductReview($db, $args)
{
    try {
        $reviewModel = new Review($db);
        $reviewId = $args['id'];
        $userId = $args['user_id']; // Should be set by auth middleware


        $existingReview = $reviewModel->findById($reviewId);
        if (!$existingReview) {
            return [
                'success' => false,
                'message' => 'Review not found'
            ];
        }

        if ($existingReview['user_id'] != $userId) {
            return [
                'success' => false,
                'message' => 'You can only delete your own reviews'
            ];
        }

        $success = $reviewModel->delete($reviewId);

        if (!$success) {
            return [
                'success' => false,
                'message' => 'Failed to delete review'
            ];
        }

        return [
            'success' => true,
            'message' => 'Review deleted successfully'
        ];

    } catch (Exception $e) {
        error_log("Error deleting product review: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to delete review'
        ];
    }
}

function voteReviewHelpful($db, $args)
{
    try {
        $voteModel = new ReviewHelpfulVote($db);
        $reviewId = $args['reviewId'];
        $userId = $args['user_id']; // Should be set by auth middleware


        $existingVote = $voteModel->findByReviewAndUser($reviewId, $userId);
        if ($existingVote) {
            return [
                'success' => false,
                'message' => 'You have already voted for this review',
                'hasVoted' => true,
                'votesCount' => $voteModel->getVotesCount($reviewId)
            ];
        }

        $vote = $voteModel->create($reviewId, $userId);

        if (!$vote) {
            return [
                'success' => false,
                'message' => 'Failed to vote for review',
                'hasVoted' => false,
                'votesCount' => $voteModel->getVotesCount($reviewId)
            ];
        }

        $newVotesCount = $voteModel->getVotesCount($reviewId);

        return [
            'success' => true,
            'message' => 'Vote added successfully',
            'hasVoted' => true,
            'votesCount' => $newVotesCount
        ];

    } catch (Exception $e) {
        error_log("Error voting for review: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to vote for review',
            'hasVoted' => false,
            'votesCount' => 0
        ];
    }
}

function removeReviewVote($db, $args)
{
    try {
        $voteModel = new ReviewHelpfulVote($db);
        $reviewId = $args['reviewId'];
        $userId = $args['user_id']; // Should be set by auth middleware


        $existingVote = $voteModel->findByReviewAndUser($reviewId, $userId);
        if (!$existingVote) {
            return [
                'success' => false,
                'message' => 'You have not voted for this review',
                'hasVoted' => false,
                'votesCount' => $voteModel->getVotesCount($reviewId)
            ];
        }

        $success = $voteModel->delete($existingVote['id']);

        if (!$success) {
            return [
                'success' => false,
                'message' => 'Failed to remove vote',
                'hasVoted' => true,
                'votesCount' => $voteModel->getVotesCount($reviewId)
            ];
        }

        $newVotesCount = $voteModel->getVotesCount($reviewId);

        return [
            'success' => true,
            'message' => 'Vote removed successfully',
            'hasVoted' => false,
            'votesCount' => $newVotesCount
        ];

    } catch (Exception $e) {
        error_log("Error removing review vote: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to remove vote',
            'hasVoted' => false,
            'votesCount' => 0
        ];
    }
}