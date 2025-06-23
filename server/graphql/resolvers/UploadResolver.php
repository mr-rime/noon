<?php
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

    $uploadDir = __DIR__ . '/../../public/uploads/';
    $baseUrl = 'http://localhost:8000/uploads/';

    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!in_array($file['type'], $allowedTypes)) {
        return [
            'success' => false,
            'message' => 'Unsupported file type: ' . $file['type'],
        ];
    }

    $fileHash = hash_file('sha256', $file['tmp_name']);
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $hashedFilename = $fileHash . '.' . $ext;
    $uploadPath = $uploadDir . $hashedFilename;

    if (file_exists($uploadPath)) {
        return [
            'success' => true,
            'message' => 'File already uploaded (cached)',
            'url' => $baseUrl . $hashedFilename,
        ];
    }

    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        return [
            'success' => false,
            'message' => 'Failed to move uploaded file',
        ];
    }

    return [
        'success' => true,
        'message' => 'File uploaded successfully',
        'url' => $baseUrl . $hashedFilename,
    ];
}
