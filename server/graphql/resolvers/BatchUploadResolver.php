<?php

require_once __DIR__ . '/../../services/UploadThingService.php';

function batchUploadImagesResolver($args)
{
    error_log('batchUploadImagesResolver: ' . json_encode($args), 0);

    if (!isset($args['files']) || !is_array($args['files']) || empty($args['files'])) {
        return [
            'success' => false,
            'message' => 'No files provided for upload',
        ];
    }

    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    $uploadedImages = [];
    $errors = [];

    try {
        $uploadThingService = new UploadThingService();

        // Prepare files for batch upload
        $filesToUpload = [];
        foreach ($args['files'] as $index => $file) {
            // Validate file type
            if (!in_array($file['type'], $allowedTypes)) {
                $errors[] = "File {$index}: Unsupported file type: " . $file['type'];
                continue;
            }

            // Convert file content to base64 if needed
            $fileContent = $file['content'];
            if (is_string($fileContent) && base64_decode($fileContent, true) !== false) {
                // Already base64 encoded
            } else {
                $fileContent = base64_encode($fileContent);
            }

            $filesToUpload[] = [
                'name' => $file['name'],
                'type' => $file['type'],
                'content' => $fileContent
            ];
        }

        if (empty($filesToUpload)) {
            return [
                'success' => false,
                'message' => 'No valid files to upload',
                'errors' => $errors
            ];
        }

        // Upload files to UploadThing
        $result = $uploadThingService->uploadFiles($filesToUpload);

        if ($result['success']) {
            foreach ($result['files'] as $index => $uploadedFile) {
                $uploadedImages[] = [
                    'image_url' => $uploadedFile['url'],
                    'is_primary' => $index === 0, // First image is primary
                    'key' => $uploadedFile['key']
                ];
            }

            return [
                'success' => true,
                'message' => count($uploadedImages) . ' file(s) uploaded successfully to UploadThing',
                'images' => $uploadedImages,
                'errors' => $errors
            ];
        } else {
            return [
                'success' => false,
                'message' => $result['message'],
                'errors' => $errors
            ];
        }

    } catch (Exception $e) {
        error_log('Batch upload error: ' . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to upload files: ' . $e->getMessage(),
        ];
    }
}
