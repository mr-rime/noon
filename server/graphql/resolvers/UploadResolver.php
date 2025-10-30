<?php

require_once __DIR__ . '/../../services/UploadThingService.php';

function uploadImageResolver($args)
{
    error_log('uploadImageResolver: ' . json_encode($args), 0);

    $file = $args['file'] ?? null;

    if (!$file || !isset($file['content'], $file['name'], $file['type'])) {
        return [
            'success' => false,
            'message' => 'No file data provided',
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
        $singleResult = $uploadThingService->uploadFiles([
            [
                'name' => $file['name'],
                'type' => $file['type'],
                'content' => $file['content'],
            ]
        ]);
        if (($singleResult['success'] ?? false) && !empty($singleResult['files'][0]['url'])) {
            return [
                'success' => true,
                'message' => 'File uploaded successfully to UploadThing',
                'url' => $singleResult['files'][0]['url'] ?? null,
            ];
        } else {
            return [
                'success' => false,
                'message' => $singleResult['message'] ?? ($singleResult['files'][0]['message'] ?? 'Upload failed'),
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
