<?php

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class ReviewTypes
{
    private static ?ObjectType $reviewType = null;
    private static ?ObjectType $reviewUserType = null;
    private static ?ObjectType $reviewResponseType = null;
    private static ?ObjectType $reviewsResponseType = null;
    private static ?ObjectType $reviewVoteResponseType = null;
    private static ?ObjectType $reviewInputType = null;

    public static function review(): ObjectType
    {
        if (self::$reviewType === null) {
            self::$reviewType = new ObjectType([
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
        return self::$reviewType;
    }

    public static function reviewUser(): ObjectType
    {
        if (self::$reviewUserType === null) {
            self::$reviewUserType = new ObjectType([
                'name' => 'ReviewUser',
                'fields' => [
                    'id' => Type::int(),
                    'first_name' => Type::string(),
                    'last_name' => Type::string()
                ]
            ]);
        }
        return self::$reviewUserType;
    }

    public static function reviewResponse(): ObjectType
    {
        if (self::$reviewResponseType === null) {
            self::$reviewResponseType = new ObjectType([
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
        return self::$reviewResponseType;
    }

    public static function reviewsResponse(): ObjectType
    {
        if (self::$reviewsResponseType === null) {
            self::$reviewsResponseType = new ObjectType([
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
        return self::$reviewsResponseType;
    }

    public static function reviewVoteResponse(): ObjectType
    {
        if (self::$reviewVoteResponseType === null) {
            self::$reviewVoteResponseType = new ObjectType([
                'name' => 'ReviewVoteResponse',
                'fields' => [
                    'success' => Type::boolean(),
                    'message' => Type::string(),
                    'hasVoted' => Type::boolean(),
                    'votesCount' => Type::int()
                ]
            ]);
        }
        return self::$reviewVoteResponseType;
    }

    public static function reviewInput(): ObjectType
    {
        if (self::$reviewInputType === null) {
            self::$reviewInputType = new ObjectType([
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
        return self::$reviewInputType;
    }
}