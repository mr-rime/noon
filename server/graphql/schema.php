<?php

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;

require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../middleware/StoreAuthMiddleware.php';
require_once __DIR__ . '/types/UserTypes.php';
require_once __DIR__ . '/types/PartnerTypes.php';
require_once __DIR__ . '/types/ProductSpecificationTypes.php';
require_once __DIR__ . '/types/PskuTypes.php';
require_once __DIR__ . '/types/StoreTypes.php';
require_once __DIR__ . '/types/OrderTypes.php';
require_once __DIR__ . '/types/UploadTypes.php';
require_once __DIR__ . '/types/DiscountTypes.php';
require_once __DIR__ . '/types/HomeTypes.php';
require_once __DIR__ . '/types/CartTypes.php';
require_once __DIR__ . '/types/WishlistTypes.php';
require_once __DIR__ . '/types/BannerTypes.php';
require_once __DIR__ . '/types/ReviewTypes.php';
require_once __DIR__ . '/types/BrowsingHistoryTypes.php';
require_once __DIR__ . '/types/CouponTypes.php';
require_once __DIR__ . '/resolvers/UserResolver.php';
require_once __DIR__ . '/resolvers/PartnerResolver.php';
require_once __DIR__ . '/resolvers/AuthResolver.php';
require_once __DIR__ . '/resolvers/ProdcutResolver.php';
require_once __DIR__ . '/resolvers/OrderResolver.php';
require_once __DIR__ . '/resolvers/UploadResolver.php';
require_once __DIR__ . '/resolvers/BatchUploadResolver.php';
require_once __DIR__ . '/resolvers/DeleteImageResolver.php';
require_once __DIR__ . '/resolvers/DiscountResolver.php';
require_once __DIR__ . '/resolvers/HomeResolver.php';
require_once __DIR__ . '/resolvers/CartResolver.php';
require_once __DIR__ . '/resolvers/WishlistResolver.php';
require_once __DIR__ . '/resolvers/StoreResolver.php';
require_once __DIR__ . '/resolvers/PskuResolver.php';
require_once __DIR__ . '/resolvers/BannerResolver.php';
require_once __DIR__ . '/resolvers/ReviewResolver.php';
require_once __DIR__ . '/resolvers/BrowsingHistoryResolver.php';
require_once __DIR__ . '/resolvers/CouponResolver.php';


$QueryType = new ObjectType([
    'name' => 'query',
    'fields' => array_merge(
        require __DIR__ . '/queries/UserQueries.php',
        require __DIR__ . '/queries/PartnerQueries.php',
        require __DIR__ . '/queries/ProductQueries.php',
        require __DIR__ . '/queries/OrderQueries.php',
        require __DIR__ . '/queries/DiscountQueries.php',
        require __DIR__ . '/queries/HomeQueries.php',
        require __DIR__ . '/queries/CartQueries.php',
        require __DIR__ . '/queries/WishlistQueries.php',
        require __DIR__ . '/queries/StoreQueries.php',
        require __DIR__ . '/queries/CategoryQueries.php',
        require __DIR__ . '/queries/BrandQueries.php',
        require __DIR__ . '/queries/BannerQueries.php',
        require __DIR__ . '/queries/ReviewQueries.php',
        require __DIR__ . '/queries/BrowsingHistoryQueries.php',
        require __DIR__ . '/queries/CouponQueries.php'
    ),
]);


$MutationType = new ObjectType([
    'name' => 'mutation',
    'fields' => array_merge(
        require __DIR__ . '/mutations/AuthMutations.php',
        require __DIR__ . '/mutations/PartnerMutations.php',
        require __DIR__ . '/mutations/ProductMutations.php',
        require __DIR__ . '/mutations/OrderMutations.php',
        require __DIR__ . '/mutations/ImageMutations.php',
        require __DIR__ . '/mutations/DiscountMutations.php',
        require __DIR__ . '/mutations/CartMutations.php',
        require __DIR__ . '/mutations/WishlistMutations.php',
        require __DIR__ . '/mutations/CategoryMutations.php',
        require __DIR__ . '/mutations/BrandMutations.php',
        require __DIR__ . '/mutations/StoreMutations.php',
        require __DIR__ . '/mutations/BannerMutations.php',
        require __DIR__ . '/mutations/ReviewMutations.php',
        require __DIR__ . '/mutations/UserMutations.php',
        require __DIR__ . '/mutations/BrowsingHistoryMutations.php',
        require __DIR__ . '/mutations/CouponMutations.php'
    )
]);

return new Schema([
    'query' => $QueryType,
    'mutation' => $MutationType
]);