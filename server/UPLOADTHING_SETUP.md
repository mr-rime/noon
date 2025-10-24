# UploadThing Setup Guide

This guide will help you set up UploadThing for image uploads in your application.

## Prerequisites

1. UploadThing Account
2. Node.js project (for UploadThing SDK)

## Step 1: Create UploadThing Account

1. Go to [UploadThing](https://uploadthing.com)
2. Sign up for a free account
3. Create a new project
4. Get your API keys from the dashboard

## Step 2: Get API Keys

1. Go to your UploadThing dashboard
2. Navigate to "API Keys" section
3. Copy your:
   - `UPLOADTHING_SECRET` (for server-side uploads)
   - `UPLOADTHING_APP_ID` (for client-side uploads)

## Step 3: Environment Variables

Add these to your `.env` file:

```env
# UploadThing Configuration
UPLOADTHING_SECRET=your-uploadthing-secret-key
UPLOADTHING_APP_ID=your-uploadthing-app-id
```

## Step 4: Install Dependencies

The required dependencies are already installed:
- `guzzlehttp/guzzle` for HTTP requests
- `uploadthing` for frontend (already installed)

## Step 5: Test Upload

1. Start your server
2. Try uploading an image through the product form
3. Check your UploadThing dashboard to see if the image was uploaded

## Free Tier Limits

UploadThing Free Tier includes:
- 2 GB of storage
- 1,000 uploads per month
- 10 GB bandwidth per month
- No file size limits

## API Endpoints

UploadThing provides these endpoints:
- `POST /api/uploadFiles` - Upload files
- `POST /api/deleteFile` - Delete files
- `GET /api/getFileUrl` - Get file URL

## Troubleshooting

### Common Issues:

1. **Invalid API Key**: Check your `UPLOADTHING_SECRET` in `.env`
2. **CORS Error**: UploadThing handles CORS automatically
3. **File Size Limit**: Check your UploadThing plan limits
4. **Network Error**: Verify your internet connection and UploadThing status

### File Types Supported:

- Images: JPEG, PNG, WebP, AVIF, GIF
- Documents: PDF, DOC, DOCX, TXT
- Videos: MP4, WebM, MOV
- Audio: MP3, WAV, OGG

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for all API keys
- Consider using UploadThing's webhook system for production
- Set up proper file access controls in your UploadThing dashboard

## Advanced Configuration

### Custom File Naming

You can customize file names in the `UploadThingService.php`:

```php
public function generateFileName(string $originalName, string $prefix = 'products'): string
{
    $ext = pathinfo($originalName, PATHINFO_EXTENSION);
    $hash = hash('sha256', $originalName . time() . uniqid());
    return $prefix . '/' . $hash . '.' . $ext;
}
```

### File Size Limits

Set file size limits in your UploadThing dashboard:
1. Go to "Settings" → "File Limits"
2. Set maximum file size (default: 16MB)
3. Set maximum files per upload (default: 10)

### Webhook Integration

For production, consider setting up webhooks:
1. Go to "Settings" → "Webhooks"
2. Add your webhook URL
3. Select events to listen for (file.uploaded, file.deleted, etc.)
