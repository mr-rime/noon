<?php

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\UnionType;

$ReviewType = new ObjectType([
    'name' => 'Review',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'product_id' => Type::nonNull(Type::int()),
        'user_id' => Type::nonNull(Type::int()),
        'rating' => Type::nonNull(Type::int()),
        'comment' => Type::string(),
        'verified_purchase' => Type::boolean(),
        'created_at' => Type::string()
    ]
]);

$ReviewResponseType = new ObjectType([
    'name' => 'ReviewResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'review' => $ReviewType,
    ]
]);

$ReviewsResponseType = new ObjectType([
    'name' => 'ReviewsResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'reviews' => Type::listOf($ReviewType),
    ]
]);

$HelpfulVoteType = new ObjectType([
    'name' => 'HelpfulVote',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'review_id' => Type::nonNull(Type::int()),
        'user_id' => Type::nonNull(Type::int())
    ]
]);

$HelpfulVoteResponseType = new ObjectType([
    'name' => 'HelpfulVoteResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'vote' => $HelpfulVoteType
    ]
]);

$HelpfulVotesResponseType = new ObjectType([
    'name' => 'HelpfulVotesResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'votes' => Type::listOf($HelpfulVoteType)
    ]
]);
