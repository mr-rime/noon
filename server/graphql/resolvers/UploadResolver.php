<?php

require_once __DIR__ . '/../../services/UploadThingService.php';

function uploadImageResolver($args)
{
    error_log('uploadImageResolver: ' . json_encode($args), 0);

    if (!isset($_FILES) || !isset($_FILES['1'])) {
        return [
            'success' => false,
            'message' => 'No file was uploaded',
        ];
    }

    $file = $_FILES['1'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        return [
            'success' => false,
            'message' => 'File upload error: ' . $file['error'],
        ];
    }

    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!in_array($file['type'], $allowedTypes)) {
        return [
            'success' => false,
            'message' => 'Unsupported file type: ' . $file['type'],
        ];
    }

    try {
        $uploadThingService = new UploadThingService();

        // Upload file to UploadThing
        $result = $uploadThingService->uploadFile(
            base64_encode(file_get_contents($file['tmp_name'])),
            $file['name'],
            $file['type']
        );

        if ($result['success']) {
            return [
                'success' => true,
                'message' => 'File uploaded successfully to UploadThing',
                'url' => $result['url'],
            ];
        } else {
            return [
                'success' => false,
                'message' => $result['message'],
            ];
        }
    } catch (Exception $e) {
        error_log('Upload error: ' . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to upload file: ' . $e->getMessage(),
        ];
    }
}
