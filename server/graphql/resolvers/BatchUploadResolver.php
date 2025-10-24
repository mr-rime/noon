<?php

require_once __DIR__ . '/../../services/UploadThingService.php';

function batchUploadImagesResolver($args)
{
    error_log('batchUploadImagesResolver: ' . json_encode($args), 0);

    if (empty($args['files']) || !is_array($args['files'])) {
        return ['success' => false, 'message' => 'No files provided for upload'];
    }

    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    $errors = [];
    $uploadedImages = [];

    try {
        $uploadThingService = new UploadThingService();

        $filesToUpload = [];
        foreach ($args['files'] as $index => $file) {
            if (!in_array($file['type'], $allowedTypes)) {
                $errors[] = "File {$index}: Unsupported type " . $file['type'];
                continue;
            }

            $fileContent = $file['content'];
            if (base64_decode($fileContent, true) === false) {
                $fileContent = base64_encode($fileContent);
            }

            $filesToUpload[] = [
                'name' => $file['name'],
                'type' => $file['type'],
                'content' => $fileContent,
            ];
        }

        if (empty($filesToUpload)) {
            return ['success' => false, 'message' => 'No valid files', 'errors' => $errors];
        }

        $result = $uploadThingService->uploadFiles($filesToUpload);
        error_log('BatchUploadResolver result: ' . json_encode($result));

        if (!$result['success']) {
            return ['success' => false, 'message' => $result['message'], 'errors' => $errors];
        }

        foreach ($result['files'] as $index => $uploadedFile) {
            $imageUrl = $uploadedFile['url'] ?? $uploadedFile['fileUrl'] ?? null;

            if (!$imageUrl) {
                $errors[] = "File {$uploadedFile['name']}: URL not found after upload";
            }

            $uploadedImages[] = [
                'image_url' => $imageUrl ?? '',
                'is_primary' => $index === 0,
                'key' => $uploadedFile['fileKey'],
            ];
        }

        return [
            'success' => true,
            'message' => count($uploadedImages) . ' file(s) uploaded successfully',
            'images' => $uploadedImages,
            'errors' => $errors,
        ];
    } catch (Exception $e) {
        error_log('Batch upload error: ' . $e->getMessage());
        return ['success' => false, 'message' => 'Upload failed: ' . $e->getMessage()];
    }
}
