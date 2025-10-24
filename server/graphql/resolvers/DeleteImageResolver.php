<?php

require_once __DIR__ . '/../../services/UploadThingService.php';
require_once __DIR__ . '/../../models/ProductImage.php';

function deleteImagesResolver($args, $context)
{
    error_log('deleteImagesResolver: ' . json_encode($args));

    $fileKeys = $args['fileKeys'] ?? [];
    $imageIds = $args['imageIds'] ?? [];

    error_log('FileKeys received: ' . json_encode($fileKeys));
    error_log('ImageIds received: ' . json_encode($imageIds));

    if (empty($fileKeys) && empty($imageIds)) {
        return [
            'success' => false,
            'message' => 'No file keys or image IDs provided for deletion',
            'deletedCount' => 0,
            'dbDeletedCount' => 0,
        ];
    }

    $uploadThingResult = ['success' => true, 'deletedCount' => 0];
    $dbDeletedCount = 0;

    try {

        if (!empty($fileKeys)) {
            $uploadThingService = new UploadThingService();
            $uploadThingResult = $uploadThingService->deleteFiles($fileKeys);
        }


        if (!empty($imageIds)) {
            $productImageModel = new ProductImage($context['db']);
            foreach ($imageIds as $imageId) {
                if ($productImageModel->delete($imageId)) {
                    $dbDeletedCount++;
                }
            }
        }

        $overallSuccess = $uploadThingResult['success'] && $dbDeletedCount > 0;
        $message = "Deleted {$uploadThingResult['deletedCount']} files from storage and {$dbDeletedCount} records from database";

        return [
            'success' => $overallSuccess,
            'message' => $message,
            'deletedCount' => $uploadThingResult['deletedCount'],
            'dbDeletedCount' => $dbDeletedCount,
        ];
    } catch (Exception $e) {
        error_log('Delete images error: ' . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to delete images: ' . $e->getMessage(),
            'deletedCount' => $uploadThingResult['deletedCount'] ?? 0,
            'dbDeletedCount' => $dbDeletedCount,
        ];
    }
}
