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
require_once __DIR__ . '/resolvers/UserResolver.php';
require_once __DIR__ . '/resolvers/PartnerResolver.php';
require_once __DIR__ . '/resolvers/AuthResolver.php';
require_once __DIR__ . '/resolvers/ProdcutResolver.php';
require_once __DIR__ . '/resolvers/OrderResolver.php';
require_once __DIR__ . '/resolvers/UploadResolver.php';
require_once __DIR__ . '/resolvers/DiscountResolver.php';
require_once __DIR__ . '/resolvers/HomeResolver.php';
require_once __DIR__ . '/resolvers/CartResolver.php';
require_once __DIR__ . '/resolvers/WishlistResolver.php';
require_once __DIR__ . '/resolvers/StoreResolver.php';
require_once __DIR__ . '/resolvers/PskuResolver.php';
require_once __DIR__ . '/resolvers/BannerResolver.php';

$QueryType = new ObjectType([
    'name' => 'query',
    'fields' => [
        'getUsers' => [
            'type' => $UsersResponseType,
            'resolve' => requireAuth(fn($root, $args, $context) => getUsers($context['db']))
        ],

        'getUser' => [
            'type' => $UserResponseType,
            'args' => [
                'hash' => Type::nonNull(Type::string())
            ],
            'resolve' => requireAuth(fn($root, $args, $context) => getUser($context['db'], $args['hash']))
        ],

        'getPartner' => [
            'type' => $PartnerResponseType,
            'args' => [
                'id' => Type::nonNull(Type::string())
            ],
            'resolve' => requireAuth(fn($root, $args, $context) => getPartner($context['db'], $args))
        ],

        'getProducts' => [
            'type' => $ProductsResponseType,
            'args' => [
                'limit' => Type::int(),
                'offset' => Type::int(),
                'search' => Type::string()
            ],
            'resolve' => fn($root, $args, $context) => getAllProducts($context['db'], $args)
        ],

        'getProduct' => [
            'type' => $ProductResponseType,
            'args' => [
                'id' => Type::nonNull(Type::id())
            ],
            'resolve' => fn($root, $args, $context) => getProductById($context['db'], $args['id'])
        ],

        'getPublicProduct' => [
            'type' => $ProductResponseType,
            'args' => [
                'id' => Type::nonNull(Type::id())
            ],
            'resolve' => fn($root, $args, $context) => getPublicProductById($context['db'], $args['id'])
        ],

        'getDiscount' => [
            'type' => $DiscountResponseType,
            'args' => [
                'id' => Type::nonNull(Type::id())
            ],
            'resolve' => fn($root, $args, $context) => getDiscount($context['db'], $args['id'])
        ],
        'getHome' => [
            'type' => $HomeResponseType,
            'args' => [
                'limit' => Type::int(),
                'offset' => Type::int(),
                'search' => Type::string()
            ],
            'resolve' => fn($root, $args, $context) => getHome($context['db'], $args)
        ],
        'getCartItems' => [
            'type' => $CartResponseType,
            'args' => [],
            'resolve' => fn($root, $args, $context) => getCart($context['db'])
        ],
        'getWishlistItems' => [
            'type' => $WishlistItemsResponse,
            'args' => [
                'wishlist_id' => Type::nonNull(Type::string())
            ],
            'resolve' => fn($root, $args, $context) => getWishlistItems($context['db'], $args['wishlist_id'])
        ]
        ,
        'getWishlists' => [
            'type' => $WishlistsResponse,
            'args' => [],
            'resolve' => fn($root, $args, $context) => getWishlists($context['db'])
        ]
        ,
        'stores' => [
            'type' => Type::listOf($StoreType),
            'args' => [],
            'resolve' => fn($root, $args, $context) => getStores($context['db'])
        ],
        'store' => [
            'type' => $StoreType,
            'args' => ['id' => Type::nonNull(Type::int())],
            'resolve' => fn($root, $args, $context) => getStore($context['db'], $args['id'])
        ],

        // PSKU System Queries
        'getCategories' => [
            'type' => $CategoriesResponseType,
            'args' => ['search' => Type::string()],
            'resolve' => fn($root, $args, $context) => getCategories($context['db'], $args['search'] ?? '')
        ],
        'getCategory' => [
            'type' => $CategoryResponseType,
            'args' => ['id' => Type::nonNull(Type::int())],
            'resolve' => fn($root, $args, $context) => getCategory($context['db'], $args['id'])
        ],
        'getSubcategories' => [
            'type' => $SubcategoriesResponseType,
            'args' => ['category_id' => Type::int(), 'search' => Type::string()],
            'resolve' => fn($root, $args, $context) => getSubcategories($context['db'], $args['category_id'] ?? null, $args['search'] ?? '')
        ],
        'getBrands' => [
            'type' => $BrandsResponseType,
            'args' => ['search' => Type::string()],
            'resolve' => fn($root, $args, $context) => getBrands($context['db'], $args['search'] ?? '')
        ],
        'getProductGroups' => [
            'type' => $ProductGroupsResponseType,
            'args' => ['category_id' => Type::int()],
            'resolve' => fn($root, $args, $context) => getProductGroups($context['db'], $args['category_id'] ?? null)
        ],
        'getProductByPsku' => [
            'type' => $ProductResponseType,
            'args' => ['psku' => Type::nonNull(Type::string())],
            'resolve' => fn($root, $args, $context) => getProductByPsku($context['db'], $args['psku'])
        ],
        'validatePsku' => [
            'type' => Type::boolean(),
            'args' => ['psku' => Type::nonNull(Type::string())],
            'resolve' => fn($root, $args, $context) => validatePskuUniqueness($context['db'], $args['psku'])
        ],
        'getRelatedProducts' => [
            'type' => $ProductsResponseType,
            'args' => [
                'productId' => Type::nonNull(Type::string()),
                'limit' => Type::int()
            ],
            'resolve' => fn($root, $args, $context) => getRelatedProducts($context['db'], $args['productId'], $args['limit'] ?? 8)
        ],

        // Banner queries
        'getBanners' => [
            'type' => \App\GraphQL\Types\BannerTypes::bannerList(),
            'args' => [
                'placement' => Type::string(),
                'isActive' => Type::boolean(),
                'limit' => Type::int(),
                'offset' => Type::int(),
                'search' => Type::string()
            ],
            'resolve' => fn($root, $args, $context) => getBanners($context['db'], $args)
        ],

        'getBanner' => [
            'type' => \App\GraphQL\Types\BannerTypes::banner(),
            'args' => [
                'id' => Type::nonNull(Type::string())
            ],
            'resolve' => fn($root, $args, $context) => getBanner($context['db'], $args)
        ],

        'getActiveBannersByPlacement' => [
            'type' => Type::listOf(\App\GraphQL\Types\BannerTypes::banner()),
            'args' => [
                'placement' => Type::nonNull(Type::string())
            ],
            'resolve' => fn($root, $args, $context) => getActiveBannersByPlacement($context['db'], $args)
        ]
    ],

]);


$MutationType = new ObjectType([
    'name' => 'mutation',
    'fields' => [
        'login' => [
            'type' => $UserResponseType,
            'args' => [
                'email' => Type::nonNull(Type::string()),
                'password' => Type::nonNull(Type::string()),
            ],
            'resolve' => fn($root, $args, $context) => login(array_merge($args, ['db' => $context['db']]))
        ],

        'register' => [
            'type' => $UserResponseType,
            'args' => [
                'first_name' => Type::nonNull(Type::string()),
                'last_name' => Type::string(),
                'password' => Type::nonNull(Type::string()),
                'email' => Type::nonNull(Type::string())
            ],
            'resolve' => fn($root, $args, $context) => register(array_merge($args, ['db' => $context['db']]))
        ],

        'logout' => [
            'type' => $UserResponseType,
            'resolve' => fn($root, $args, $context) => logout()
        ],

        'createPartner' => [
            'type' => $PartnerResponseType,
            'args' => [
                'business_email' => Type::nonNull(Type::string()),
                'store_name' => Type::nonNull(Type::string()),
                'business_phone' => Type::string(),
                'password' => Type::nonNull(Type::string()),
            ],
            'resolve' => requireAuth(fn($root, $args, $context) => createPartner($context['db'], $args))
        ],

        'loginPartner' => [
            'type' => $PartnerResponseType,
            'args' => [
                'business_email' => Type::nonNull(Type::string()),
                'password' => Type::nonNull(Type::string())
            ],
            'resolve' => requireAuth(fn($root, $args, $context) => loginPartner($context['db'], $args))
        ],

        'createProduct' => [
            'type' => $ProductResponseType,
            'args' => [
                'name' => Type::nonNull(Type::string()),
                'price' => Type::nonNull(Type::float()),
                'currency' => Type::nonNull(Type::string()),
                'psku' => Type::string(),
                'category_id' => Type::int(),
                'subcategory_id' => Type::int(),
                'brand_id' => Type::int(),
                'group_id' => Type::string(),
                'stock' => Type::int(),
                'is_returnable' => Type::boolean(),
                'is_public' => Type::boolean(),
                'product_overview' => Type::string(),
                'discount' => $DiscountInputType,
                'images' => Type::listOf($ProductImageInputType),
                'productSpecifications' => Type::listOf($ProductSpecInputType),
                'productAttributes' => Type::listOf($ProductAttributeInputType),
            ],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => createProduct($context['db'], $args))
        ],

        'createOrder' => [
            'type' => $OrderResponseType,
            'args' => [
                'currency' => Type::nonNull(Type::string()),
                'shipping_address' => Type::string(),
                'payment_method' => Type::string(),
                'items' => Type::listOf($OrderItemInputType),
            ],
            'resolve' => requireAuth(fn($root, $args, $context) => createOrder($context['db'], $args))
        ],

        'uploadImage' => [
            'type' => $UploadResponseType,
            'args' => [
                'file' => Type::nonNull($UploadScalar),
            ],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => uploadImageResolver($args))
        ],
        'createDiscount' => [
            'type' => $DiscountResponseType,
            'args' => [
                'product_id' => Type::nonNull(Type::string()),
                'type' => Type::nonNull(Type::string()),
                'value' => Type::nonNull(Type::float()),
                'starts_at' => Type::nonNull(Type::string()),
                'ends_at' => Type::nonNull(Type::string())
            ],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => createDiscount($context['db'], $args))
        ],
        'updateProduct' => [
            'type' => $ProductResponseType,
            'args' => [
                'id' => Type::nonNull(Type::string()),
                'name' => Type::string(),
                'price' => Type::float(),
                'currency' => Type::string(),
                'psku' => Type::string(),
                'category_id' => Type::int(),
                'subcategory_id' => Type::int(),
                'brand_id' => Type::int(),
                'group_id' => Type::string(),
                'stock' => Type::int(),
                'is_returnable' => Type::boolean(),
                'is_public' => Type::boolean(),
                'product_overview' => Type::string(),
                'discount' => $DiscountInputType,
                'images' => Type::listOf($ProductImageInputType),
                'productSpecifications' => Type::listOf($ProductSpecInputType),
                'productAttributes' => Type::listOf($ProductAttributeInputType),
            ],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => updateProduct($context["db"], $args))
        ],
        'addToCart' => [
            'type' => $CartResponseType,
            'args' => [
                'product_id' => Type::nonNull(Type::string()),
                'quantity' => Type::nonNull(Type::int())
            ],
            'resolve' => fn($root, $args, $context) => addToCart($context['db'], $args)
        ],

        'removeFromCart' => [
            'type' => $CartResponseType,
            'args' => [
                'product_id' => Type::nonNull(Type::string())
            ],
            'resolve' => fn($root, $args, $context) => removeFromCart($context['db'], $args, $context)
        ],

        'createWishlist' => [
            'type' => $WishlistResponse,
            'args' => [
                'name' => Type::nonNull(Type::string()),
            ],
            'resolve' => fn($root, $args, $context) => createWishlist($context['db'], $args['name'])
        ],
        'addWishlistItem' => [
            'type' => $WishlistResponse,
            'args' => [
                'product_id' => Type::nonNull(Type::string()),
            ],
            'resolve' => fn($root, $args, $context) => addItemToWishlist($context['db'], $args)
        ],
        'updateWishlist' => [
            'type' => $WishlistResponse,
            'args' => [
                'name' => Type::nonNull(Type::string()),
                'is_private' => Type::nonNull(Type::boolean()),
                'is_default' => Type::nonNull(Type::boolean()),
                'wishlist_id' => Type::nonNull(Type::string())
            ],
            'resolve' => fn($root, $args, $context) => updateWishlist($context['db'], $args)
        ],
        // PSKU System Mutations
        'createCategory' => [
            'type' => $CategoryResponseType,
            'args' => ['input' => Type::nonNull($CategoryInputType)],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => createCategory($context['db'], $args['input']))
        ],
        'updateCategory' => [
            'type' => $CategoryResponseType,
            'args' => [
                'id' => Type::nonNull(Type::int()),
                'input' => Type::nonNull($CategoryInputType)
            ],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => updateCategory($context['db'], $args['id'], $args['input']))
        ],
        'deleteCategory' => [
            'type' => $CategoryResponseType,
            'args' => ['id' => Type::nonNull(Type::int())],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => deleteCategory($context['db'], $args['id']))
        ],
        'createSubcategory' => [
            'type' => $SubcategoryResponseType,
            'args' => ['input' => Type::nonNull($SubcategoryInputType)],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => createSubcategory($context['db'], $args['input']))
        ],
        'updateSubcategory' => [
            'type' => $SubcategoryResponseType,
            'args' => [
                'id' => Type::nonNull(Type::int()),
                'input' => Type::nonNull($SubcategoryInputType)
            ],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => updateSubcategory($context['db'], $args['id'], $args['input']))
        ],
        'deleteSubcategory' => [
            'type' => $SubcategoryResponseType,
            'args' => ['id' => Type::nonNull(Type::int())],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => deleteSubcategory($context['db'], $args['id']))
        ],
        'createBrand' => [
            'type' => $BrandResponseType,
            'args' => ['input' => Type::nonNull($BrandInputType)],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => createBrand($context['db'], $args['input']))
        ],
        'updateBrand' => [
            'type' => $BrandResponseType,
            'args' => [
                'id' => Type::nonNull(Type::int()),
                'input' => Type::nonNull($BrandInputType)
            ],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => updateBrand($context['db'], $args['id'], $args['input']))
        ],
        'deleteBrand' => [
            'type' => $BrandResponseType,
            'args' => ['id' => Type::nonNull(Type::int())],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => deleteBrand($context['db'], $args['id']))
        ],
        'createProductGroup' => [
            'type' => $ProductGroupResponseType,
            'args' => ['input' => Type::nonNull($ProductGroupInputType)],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => createProductGroup($context['db'], $args['input']))
        ],
        'updateProductGroup' => [
            'type' => $ProductGroupResponseType,
            'args' => [
                'groupId' => Type::nonNull(Type::string()),
                'name' => Type::string(),
                'description' => Type::string(),
                'attributes' => Type::listOf(Type::string())
            ],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => updateProductGroup($context['db'], $args))
        ],
        'deleteProductGroup' => [
            'type' => $ProductGroupResponseType,
            'args' => ['groupId' => Type::nonNull(Type::string())],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => deleteProductGroup($context['db'], $args['groupId']))
        ],
        'addProductToGroup' => [
            'type' => $ProductResponseType,
            'args' => [
                'product_id' => Type::nonNull(Type::string()),
                'group_id' => Type::nonNull(Type::string())
            ],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => addProductToGroup($context['db'], $args['product_id'], $args['group_id']))
        ],

        'removeWishlistItem' => [
            'type' => $WishlistResponse,
            'args' => [
                'wishlist_id' => Type::nonNull(Type::string()),
                'product_id' => Type::nonNull(Type::string())
            ],
            'resolve' => fn($root, $args, $context) => removeItemFromWishlist($context['db'], $args)
        ],
        'clearWishlist' => [
            'type' => $WishlistResponse,
            'args' => [
                'wishlist_id' => Type::nonNull(Type::string())
            ],
            'resolve' => fn($root, $args, $context) => clearWishlist($context['db'], $args['wishlist_id'])
        ],
        'deleteWishlist' => [
            'type' => $WishlistResponse,
            'args' => [
                'wishlist_id' => Type::nonNull(Type::string())
            ],
            'resolve' => fn($root, $args, $context) => deleteWishlist($context['db'], $args['wishlist_id'])
        ],
        'createStore' => [
            'type' => $StoreType,
            'args' => ['input' => Type::nonNull($StoreInputType)],
            'resolve' => fn($root, $args, $context) => createStore($context['db'], $args['input'])
        ],
        'updateStore' => [
            'type' => $StoreType,
            'args' => ['input' => Type::nonNull($StoreUpdateInputType)],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => updateStore($context['db'], $args['input']))
        ],
        'deleteStore' => [
            'type' => Type::nonNull(Type::boolean()),
            'args' => ['id' => Type::nonNull(Type::int())],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => deleteStore($context['db'], $args['id']))
        ],
        'loginStore' => [
            'type' => $StoreAuthResponseType,
            'args' => [
                'email' => Type::nonNull(Type::string()),
                'password' => Type::nonNull(Type::string()),
            ],
            'resolve' => fn($root, $args, $context) => loginStore($context['db'], $args)
        ],
        'registerStore' => [
            'type' => $StoreAuthResponseType,
            'args' => [
                'name' => Type::nonNull(Type::string()),
                'email' => Type::nonNull(Type::string()),
                'password' => Type::nonNull(Type::string()),
                'number' => Type::string(),
                'thumbnail_url' => Type::string(),
            ],
            'resolve' => fn($root, $args, $context) => registerStore($context['db'], $args)
        ],
        'logoutStore' => [
            'type' => $StoreAuthResponseType,
            'resolve' => fn($root, $args, $context) => logoutStore()
        ],
        'deleteProduct' => [
            'type' => $DeleteProductResponseType,
            'args' => [
                'id' => Type::nonNull(Type::string())
            ],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => deleteProduct($context['db'], $args['id']))
        ],

        // Banner mutations
        'createBanner' => [
            'type' => \App\GraphQL\Types\BannerTypes::bannerResponse(),
            'args' => [
                'name' => Type::nonNull(Type::string()),
                'placement' => Type::nonNull(Type::string()),
                'description' => Type::string(),
                'targetUrl' => Type::string(),
                'imageUrl' => Type::string(),
                'startDate' => Type::nonNull(Type::string()),
                'endDate' => Type::nonNull(Type::string()),
                'isActive' => Type::boolean()
            ],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => createBanner($context['db'], $args))
        ],

        'updateBanner' => [
            'type' => \App\GraphQL\Types\BannerTypes::bannerResponse(),
            'args' => [
                'id' => Type::nonNull(Type::string()),
                'name' => Type::nonNull(Type::string()),
                'placement' => Type::nonNull(Type::string()),
                'description' => Type::string(),
                'targetUrl' => Type::string(),
                'imageUrl' => Type::string(),
                'startDate' => Type::nonNull(Type::string()),
                'endDate' => Type::nonNull(Type::string()),
                'isActive' => Type::boolean()
            ],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => updateBanner($context['db'], $args))
        ],

        'deleteBanner' => [
            'type' => \App\GraphQL\Types\BannerTypes::bannerResponse(),
            'args' => [
                'id' => Type::nonNull(Type::string())
            ],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => deleteBanner($context['db'], $args))
        ],

        'toggleBannerStatus' => [
            'type' => \App\GraphQL\Types\BannerTypes::bannerResponse(),
            'args' => [
                'id' => Type::nonNull(Type::string())
            ],
            'resolve' => requireStoreAuth(fn($root, $args, $context) => toggleBannerStatus($context['db'], $args))
        ]
    ]
]);

return new Schema([
    'query' => $QueryType,
    'mutation' => $MutationType
]);