<?php

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class ReviewTypes
{
    public static function review(): ObjectType
    {
        return new ObjectType([
            'name' => 'Review',
            'fields' => [
                'id' => Type::int(),
                'product_id' => Type::string(),
                'user_id' => Type::int(),
                'rating' => Type::int(),
                'title' => Type::string(),
                'comment' => Type::string(),
                'verified_purchase' => Type::boolean(),
                'created_at' => Type::string(),
                'updated_at' => Type::string(),
                'user' => [
                    'type' => self::reviewUser(),
                    'resolve' => function ($review, $args, $context) {
                        if (isset($review['user'])) {
                            return $review['user'];
                        }

                        $userModel = new User($context['db']);
                        $user = $userModel->findById($review['user_id']);
                        return $user ? [
                            'id' => $user['id'],
                            'first_name' => $user['first_name'],
                            'last_name' => $user['last_name']
                        ] : null;
                    }
                ],
                'helpful_votes_count' => [
                    'type' => Type::int(),
                    'resolve' => function ($review, $args, $context) {
                        $voteModel = new ReviewHelpfulVote($context['db']);
                        return $voteModel->getVotesCount($review['id']);
                    }
                ],
                'user_has_voted' => [
                    'type' => Type::boolean(),
                    'resolve' => function ($review, $args, $context) {
                        if (!isset($context['user_id'])) {
                            return false;
                        }
                        $voteModel = new ReviewHelpfulVote($context['db']);
                        return $voteModel->findByReviewAndUser($review['id'], $context['user_id']) !== null;
                    }
                ]
            ]
        ]);
    }

    public static function reviewUser(): ObjectType
    {
        return new ObjectType([
            'name' => 'ReviewUser',
            'fields' => [
                'id' => Type::int(),
                'first_name' => Type::string(),
                'last_name' => Type::string()
            ]
        ]);
    }

    public static function reviewResponse(): ObjectType
    {
        return new ObjectType([
            'name' => 'ReviewResponse',
            'fields' => [
                'success' => Type::boolean(),
                'message' => Type::string(),
                'review' => [
                    'type' => self::review()
                ]
            ]
        ]);
    }

    public static function reviewsResponse(): ObjectType
    {
        return new ObjectType([
            'name' => 'ReviewsResponse',
            'fields' => [
                'success' => Type::boolean(),
                'message' => Type::string(),
                'reviews' => Type::listOf(self::review()),
                'total' => Type::int(),
                'average_rating' => Type::float()
            ]
        ]);
    }

    public static function reviewVoteResponse(): ObjectType
    {
        return new ObjectType([
            'name' => 'ReviewVoteResponse',
            'fields' => [
                'success' => Type::boolean(),
                'message' => Type::string(),
                'hasVoted' => Type::boolean(),
                'votesCount' => Type::int()
            ]
        ]);
    }

    public static function reviewInput(): ObjectType
    {
        return new ObjectType([
            'name' => 'ReviewInput',
            'fields' => [
                'product_id' => Type::nonNull(Type::string()),
                'rating' => Type::nonNull(Type::int()),
                'comment' => Type::string(),
                'verified_purchase' => Type::boolean(),
                'order_id' => Type::string()
            ]
        ]);
    }
}