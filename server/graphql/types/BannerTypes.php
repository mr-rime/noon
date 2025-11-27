<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class BannerTypes
{
    private static $bannerType;
    private static $bannerListType;
    private static $bannerResponseType;

    public static function banner()
    {
        if (!self::$bannerType) {
            self::$bannerType = new ObjectType([
                'name' => 'Banner',
                'description' => 'Advertisement banner',
                'fields' => [
                    'id' => [
                        'type' => Type::nonNull(Type::string()),
                        'description' => 'The unique identifier of the banner'
                    ],
                    'name' => [
                        'type' => Type::nonNull(Type::string()),
                        'description' => 'The name of the banner'
                    ],
                    'placement' => [
                        'type' => Type::nonNull(Type::string()),
                        'description' => 'The placement position of the banner'
                    ],
                    'description' => [
                        'type' => Type::string(),
                        'description' => 'The description of the banner'
                    ],
                    'target_url' => [
                        'type' => Type::string(),
                        'description' => 'The target URL when banner is clicked'
                    ],
                    'image_url' => [
                        'type' => Type::string(),
                        'description' => 'The image URL of the banner'
                    ],
                    'mobile_image_url' => [
                        'type' => Type::string(),
                        'description' => 'The mobile image URL of the banner'
                    ],
                    'start_date' => [
                        'type' => Type::string(),
                        'description' => 'The start date of the banner campaign'
                    ],
                    'end_date' => [
                        'type' => Type::string(),
                        'description' => 'The end date of the banner campaign'
                    ],
                    'is_active' => [
                        'type' => Type::boolean(),
                        'description' => 'Whether the banner is active'
                    ],
                    'created_at' => [
                        'type' => Type::string(),
                        'description' => 'The creation timestamp'
                    ]
                ]
            ]);
        }
        return self::$bannerType;
    }

    public static function bannerList()
    {
        if (!self::$bannerListType) {
            self::$bannerListType = new ObjectType([
                'name' => 'BannerList',
                'description' => 'List of banners with pagination',
                'fields' => [
                    'banners' => [
                        'type' => Type::listOf(self::banner()),
                        'description' => 'List of banners'
                    ],
                    'total' => [
                        'type' => Type::int(),
                        'description' => 'Total number of banners'
                    ]
                ]
            ]);
        }
        return self::$bannerListType;
    }

    public static function bannerResponse()
    {
        if (!self::$bannerResponseType) {
            self::$bannerResponseType = new ObjectType([
                'name' => 'BannerResponse',
                'description' => 'Banner operation response',
                'fields' => [
                    'success' => [
                        'type' => Type::nonNull(Type::boolean()),
                        'description' => 'Whether the operation was successful'
                    ],
                    'message' => [
                        'type' => Type::string(),
                        'description' => 'Response message'
                    ],
                    'banner' => [
                        'type' => self::banner(),
                        'description' => 'The banner data'
                    ]
                ]
            ]);
        }
        return self::$bannerResponseType;
    }
}
