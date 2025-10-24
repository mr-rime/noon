<?php

require_once __DIR__ . '/../vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

class UploadThingService
{
    private Client $client;
    private string $apiKey;
    private string $baseUrl = 'https://api.uploadthing.com';

    public function __construct()
    {
        $this->apiKey = $_ENV['UPLOADTHING_TOKEN'] ?? '';
        $this->client = new Client([
            'base_uri' => $this->baseUrl,
            'headers' => [
                'x-uploadthing-api-key' => $this->apiKey,
                'Content-Type' => 'application/json',
            ],
        ]);
    }

    public function uploadFile(string $fileContent, string $fileName, string $contentType = 'image/jpeg'): array
    {
        try {
            $fileSize = strlen(base64_decode($fileContent));

            $response = $this->client->post('/v6/uploadFiles', [
                'json' => [
                    'files' => [
                        [
                            'name' => $fileName,
                            'size' => $fileSize,
                            'type' => $contentType,
                            'customId' => null
                        ]
                    ],
                    'acl' => 'public-read',
                    'metadata' => null,
                    'contentDisposition' => 'inline'
                ]
            ]);

            $data = json_decode($response->getBody()->getContents(), true);

            if (isset($data['data'][0])) {
                return [
                    'success' => true,
                    'url' => $data['data'][0]['url'],
                    'key' => $data['data'][0]['key'],
                    'message' => 'File uploaded successfully to UploadThing'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Upload failed: ' . ($data['error'] ?? 'Unknown error')
                ];
            }
        } catch (GuzzleException $e) {
            error_log('UploadThing Upload Error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to upload file to UploadThing: ' . $e->getMessage()
            ];
        }
    }

    public function uploadFiles(array $files): array
    {
        try {
            // Convert files to the correct v6 API format
            $uploadFiles = [];
            foreach ($files as $file) {
                $fileContent = base64_decode($file['content']);
                $fileSize = strlen($fileContent);

                $uploadFiles[] = [
                    'name' => $file['name'],
                    'size' => $fileSize,
                    'type' => $file['type'],
                    'customId' => null
                ];
            }

            $response = $this->client->post('/v6/uploadFiles', [
                'json' => [
                    'files' => $uploadFiles,
                    'acl' => 'public-read',
                    'metadata' => null,
                    'contentDisposition' => 'inline'
                ]
            ]);

            $data = json_decode($response->getBody()->getContents(), true);

            if (isset($data['data']) && is_array($data['data'])) {
                return [
                    'success' => true,
                    'files' => $data['data'],
                    'message' => count($data['data']) . ' file(s) uploaded successfully to UploadThing'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Upload failed: ' . ($data['error'] ?? 'Unknown error')
                ];
            }
        } catch (GuzzleException $e) {
            error_log('UploadThing Batch Upload Error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to upload files to UploadThing: ' . $e->getMessage()
            ];
        }
    }

    public function deleteFile(string $key): array
    {
        try {
            $response = $this->client->post('/v6/deleteFile', [
                'json' => [
                    'fileKey' => $key
                ]
            ]);

            $data = json_decode($response->getBody()->getContents(), true);

            return [
                'success' => $data['success'] ?? false,
                'message' => $data['message'] ?? 'File deletion result unknown'
            ];
        } catch (GuzzleException $e) {
            error_log('UploadThing Delete Error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to delete file from UploadThing: ' . $e->getMessage()
            ];
        }
    }


    public function generateFileName(string $originalName, string $prefix = 'products'): string
    {
        $ext = pathinfo($originalName, PATHINFO_EXTENSION);
        $hash = hash('sha256', $originalName . time() . uniqid());
        return $prefix . '/' . $hash . '.' . $ext;
    }
}
