<?php

require_once __DIR__ . '/../../models/Banner.php';

/**
 * Get all banners
 */
function getBanners(mysqli $db, $args)
{
    try {
        $bannerModel = new App\Models\Banner($db);
        
        $placement = $args['placement'] ?? null;
        $isActive = $args['isActive'] ?? null;
        $limit = $args['limit'] ?? 20;
        $offset = $args['offset'] ?? 0;
        $search = $args['search'] ?? '';
        
        $banners = $bannerModel->findAll($placement, $isActive, $limit, $offset, $search);
        $total = $bannerModel->getTotalCount($placement, $isActive, $search);
        
        return [
            'banners' => $banners,
            'total' => $total
        ];
    } catch (\Exception $e) {
        error_log("Error fetching banners: " . $e->getMessage());
        return [
            'banners' => [],
            'total' => 0
        ];
    }
}

/**
 * Get a single banner by ID
 */
function getBanner(mysqli $db, $args)
{
    try {
        $bannerModel = new App\Models\Banner($db);
        return $bannerModel->findById($args['id']);
    } catch (\Exception $e) {
        error_log("Error fetching banner: " . $e->getMessage());
        return null;
    }
}

/**
 * Get active banners by placement
 */
function getActiveBannersByPlacement(mysqli $db, $args)
{
    try {
        $bannerModel = new App\Models\Banner($db);
        return $bannerModel->getActiveBannersByPlacement($args['placement']);
    } catch (\Exception $e) {
        error_log("Error fetching active banners: " . $e->getMessage());
        return [];
    }
}

/**
 * Create a new banner
 */
function createBanner(mysqli $db, $args)
{
    try {
        $bannerModel = new App\Models\Banner($db);
        
        $banner = $bannerModel->create(
            $args['name'],
            $args['placement'],
            $args['description'] ?? '',
            $args['targetUrl'] ?? '',
            $args['imageUrl'] ?? '',
            $args['startDate'],
            $args['endDate'],
            $args['isActive'] ?? true
        );
        
        if ($banner) {
            return [
                'success' => true,
                'message' => 'Banner created successfully',
                'banner' => $banner
            ];
        }
        
        return [
            'success' => false,
            'message' => 'Failed to create banner',
            'banner' => null
        ];
    } catch (\Exception $e) {
        error_log("Error creating banner: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'An error occurred while creating the banner',
            'banner' => null
        ];
    }
}

/**
 * Update an existing banner
 */
function updateBanner(mysqli $db, $args)
{
    try {
        $bannerModel = new App\Models\Banner($db);
        
        $banner = $bannerModel->update(
            $args['id'],
            $args['name'],
            $args['placement'],
            $args['description'] ?? '',
            $args['targetUrl'] ?? '',
            $args['imageUrl'] ?? '',
            $args['startDate'],
            $args['endDate'],
            $args['isActive'] ?? true
        );
        
        if ($banner) {
            return [
                'success' => true,
                'message' => 'Banner updated successfully',
                'banner' => $banner
            ];
        }
        
        return [
            'success' => false,
            'message' => 'Failed to update banner',
            'banner' => null
        ];
    } catch (\Exception $e) {
        error_log("Error updating banner: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'An error occurred while updating the banner',
            'banner' => null
        ];
    }
}

/**
 * Delete a banner
 */
function deleteBanner(mysqli $db, $args)
{
    try {
        $bannerModel = new App\Models\Banner($db);
        $success = $bannerModel->delete($args['id']);
        
        return [
            'success' => $success,
            'message' => $success ? 'Banner deleted successfully' : 'Failed to delete banner'
        ];
    } catch (\Exception $e) {
        error_log("Error deleting banner: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'An error occurred while deleting the banner'
        ];
    }
}

/**
 * Toggle banner active status
 */
function toggleBannerStatus(mysqli $db, $args)
{
    try {
        $bannerModel = new App\Models\Banner($db);
        $banner = $bannerModel->toggleActive($args['id']);
        
        if ($banner) {
            return [
                'success' => true,
                'message' => 'Banner status updated successfully',
                'banner' => $banner
            ];
        }
        
        return [
            'success' => false,
            'message' => 'Failed to update banner status',
            'banner' => null
        ];
    } catch (\Exception $e) {
        error_log("Error toggling banner status: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'An error occurred while updating banner status',
            'banner' => null
        ];
    }
}
