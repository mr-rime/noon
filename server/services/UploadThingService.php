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
        $this->apiKey = $_ENV['UPLOADTHING_KEY'] ?? '';
        $this->client = new Client([
            'base_uri' => $this->baseUrl,
            'headers' => [
                'x-uploadthing-api-key' => $this->apiKey,
                'Content-Type' => 'application/json',
            ],
        ]);
    }


    public function uploadFiles(array $files): array
    {
        try {

            $uploadFiles = [];
            foreach ($files as $file) {
                $decoded = base64_decode($file['content']);
                $uploadFiles[] = [
                    'name' => $file['name'],
                    'size' => strlen($decoded),
                    'type' => $file['type'] ?? 'application/octet-stream',
                    'customId' => $file['customId'] ?? null,
                ];
            }


            $prepareResponse = $this->client->post('/v6/prepareUpload', [
                'json' => [
                    'files' => $uploadFiles,
                    'callbackUrl' => $this->getCallbackUrl(),
                    'callbackSlug' => 'image',
                    'routeConfig' => ['image'],
                    'metadata' => null,
                ],
            ]);

            $prepareData = json_decode($prepareResponse->getBody()->getContents(), true);
            error_log('UploadThing prepare response: ' . json_encode($prepareData));

            if (empty($prepareData)) {
                return ['success' => false, 'message' => 'No upload URLs received'];
            }

            $results = [];
            foreach ($prepareData as $index => $fileInfo) {
                $originalFile = $files[$index];
                $decoded = base64_decode($originalFile['content']);
                $uploadUrl = $fileInfo['url'] ?? null;
                $uploadFields = $fileInfo['fields'] ?? null;

                if (!$uploadUrl || !$uploadFields) {
                    $results[] = [
                        'name' => $originalFile['name'],
                        'fileKey' => $fileInfo['key'] ?? null,
                        'success' => false,
                        'message' => 'Missing upload URL or fields',
                    ];
                    continue;
                }


                $multipart = [];
                foreach ($uploadFields as $key => $value) {
                    $multipart[] = ['name' => $key, 'contents' => $value];
                }
                $multipart[] = [
                    'name' => 'file',
                    'contents' => $decoded,
                    'filename' => $originalFile['name'],
                    'headers' => ['Content-Type' => $originalFile['type']],
                ];

                (new Client())->post($uploadUrl, ['multipart' => $multipart]);


                $fileKey = $fileInfo['key'];
                $pollData = $this->pollUntilReady($fileKey);

                $results[] = [
                    'name' => $originalFile['name'],
                    'fileKey' => $fileKey,
                    'url' => $pollData['file']['fileUrl'] ?? $fileInfo['fileUrl'] ?? null,
                    'success' => !empty($pollData['file']['fileUrl']),
                    'message' => !empty($pollData['file']['fileUrl'])
                        ? 'Uploaded successfully'
                        : 'Upload completed but file URL not found yet',
                ];
            }

            return [
                'success' => true,
                'message' => 'Batch upload complete',
                'files' => $results,
            ];

        } catch (GuzzleException $e) {
            error_log('UploadThing Batch Upload Error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to upload files: ' . $e->getMessage(),
            ];
        }
    }


    private function pollUntilReady(string $fileKey): array
    {
        $maxAttempts = 20;
        $attempt = 0;
        $pollData = [];

        do {
            $pollResponse = $this->client->get("/v6/pollUpload/{$fileKey}");
            $pollData = json_decode($pollResponse->getBody()->getContents(), true);

            error_log("Polling {$fileKey} (attempt " . ($attempt + 1) . "): " . json_encode($pollData));

            if (
                ($pollData['status'] ?? '') === 'done' ||
                !empty($pollData['fileData']['fileUrl'])
            ) {
                break;
            }

            $attempt++;
            if ($attempt < $maxAttempts) {
                usleep(500000);
            }
        } while ($attempt < $maxAttempts);

        return $pollData;
    }



    public function deleteFile(string $key): array
    {
        try {
            $response = $this->client->post('/v6/deleteFile', [
                'json' => ['fileKey' => $key],
            ]);

            $data = json_decode($response->getBody()->getContents(), true);
            return [
                'success' => $data['success'] ?? false,
                'message' => $data['message'] ?? 'Unknown deletion result',
            ];
        } catch (GuzzleException $e) {
            return [
                'success' => false,
                'message' => 'Failed to delete file: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Delete multiple files using the v6/deleteFiles endpoint
     */
    public function deleteFiles(array $fileKeys): array
    {
        try {
            $response = $this->client->post('/v6/deleteFiles', [
                'json' => [
                    'fileKeys' => $fileKeys
                ],
            ]);

            $data = json_decode($response->getBody()->getContents(), true);
            return [
                'success' => $data['success'] ?? false,
                'deletedCount' => $data['deletedCount'] ?? 0,
                'message' => $data['message'] ?? 'Files deletion completed',
            ];
        } catch (GuzzleException $e) {
            return [
                'success' => false,
                'deletedCount' => 0,
                'message' => 'Failed to delete files: ' . $e->getMessage(),
            ];
        }
    }

    private function getCallbackUrl(): string
    {
        $baseUrl = $_ENV['APP_URL'] ?? 'http://localhost:8000';
        return rtrim($baseUrl, '/') . '/api/uploadthing/callback';
    }
}
