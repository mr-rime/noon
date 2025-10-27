import { useState, forwardRef, useImperativeHandle } from 'react'
import { useMutation } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { X, Loader2, ImageIcon } from 'lucide-react'
import { Dropzone } from '@/components/ui/dropzone'
import { DELETE_IMAGES, UPLOADTHING_UPLOAD } from '@/graphql/uploadthing'
import type { ProductImage } from '@/types'

interface ProductImageManagerProps {
    images: ProductImage[]
    onImagesChange: (images: ProductImage[]) => void
    maxImages?: number
    disabled?: boolean
}

export interface ProductImageManagerRef {
    uploadFiles: () => Promise<ProductImage[]>
}

export const ProductImageManager = forwardRef<ProductImageManagerRef, ProductImageManagerProps>(({
    images,
    onImagesChange,
    maxImages = 4,
    disabled = false
}, ref) => {
    const [uploading, setUploading] = useState(false)
    const [deletingIndex, setDeletingIndex] = useState<number | null>(null)
    const [localFiles, setLocalFiles] = useState<File[]>([])

    const [uploadThingUpload] = useMutation(UPLOADTHING_UPLOAD)
    const [deleteImages] = useMutation(DELETE_IMAGES)



    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                const result = reader.result as string
                const base64 = result.split(',')[1]
                resolve(base64)
            }
            reader.onerror = error => reject(error)
        })
    }


    const validateImage = (file: File): Promise<string | null> => {
        return new Promise((resolve) => {
            if (file.size > 10 * 1024 * 1024) {
                resolve('File size should be less than 10MB')
                return
            }

            const img = new Image()
            img.onload = () => {
                if (img.width < 660) {
                    resolve('Image width should be greater than 660px')
                    return
                }
                if (img.width / img.height < 0.5) {
                    resolve('Image aspect ratio should be greater than 0.5')
                    return
                }
                resolve(null)
            }
            img.onerror = () => resolve('Invalid image file')
            img.src = URL.createObjectURL(file)
        })
    }


    const handleImageUpload = async (files: File[]) => {
        console.log('handleImageUpload called with files:', files)

        if (images.length + localFiles.length + files.length > maxImages) {
            toast.error(`Maximum ${maxImages} images allowed`)
            return
        }

        try {

            const validationErrors: string[] = []
            const validFiles: File[] = []

            for (const file of files) {
                try {
                    const error = await validateImage(file)
                    if (error) {
                        validationErrors.push(`${file.name}: ${error}`)
                    } else {
                        validFiles.push(file)
                    }
                } catch {
                    validationErrors.push(`${file.name}: Failed to validate image`)
                }
            }

            if (validationErrors.length > 0) {
                toast.error(validationErrors.join(', '))
            }

            if (validFiles.length > 0) {

                setLocalFiles(prev => [...prev, ...validFiles])
                toast.success(`${validFiles.length} image(s) selected for upload`)
            }
        } catch (error) {
            console.error('File validation error:', error)
            toast.error('Failed to validate images')
        }
    }


    const removeLocalFile = (index: number) => {
        setLocalFiles(prev => prev.filter((_, i) => i !== index))
    }


    const uploadLocalFiles = async (): Promise<ProductImage[]> => {
        if (localFiles.length === 0) return []

        setUploading(true)
        try {

            const filesToUpload = await Promise.all(
                localFiles.map(async (file) => ({
                    name: file.name,
                    type: file.type,
                    content: await fileToBase64(file)
                }))
            )

            const { data: uploadData } = await uploadThingUpload({
                variables: { files: filesToUpload }
            })

            if (uploadData?.batchUploadImages?.success) {
                const newImages = uploadData.batchUploadImages.images.map((img: any, index: number) => ({
                    id: Date.now().toString() + index,
                    image_url: img.image_url,
                    is_primary: images.length === 0 && index === 0,
                    key: img.key
                }))


                setLocalFiles([])
                return newImages
            } else {
                throw new Error('Upload failed')
            }
        } catch (error) {
            console.error('Upload error:', error)
            throw error
        } finally {
            setUploading(false)
        }
    }


    const removeImage = async (index: number) => {
        const imageToRemove = images[index]

        setDeletingIndex(index)


        const deleteParams: any = {}


        let fileKey = imageToRemove?.key
        if (!fileKey && imageToRemove?.image_url) {
            if (imageToRemove.image_url.includes('utfs.io/f/')) {
                const match = imageToRemove.image_url.match(/utfs\.io\/f\/([^/]+)/)
                fileKey = match ? match[1] : undefined
                console.log('Extracted key from URL:', fileKey)
            }
        }


        if (fileKey) {
            deleteParams.fileKeys = [fileKey]
            console.log('Adding fileKeys to deleteParams:', deleteParams.fileKeys)
        }


        if (imageToRemove?.id) {
            deleteParams.imageIds = [parseInt(imageToRemove.id)]
            console.log('Adding imageIds to deleteParams:', deleteParams.imageIds)
        }

        console.log('Final deleteParams:', deleteParams)


        if (fileKey || imageToRemove?.id) {
            try {
                const result = await deleteImages({
                    variables: deleteParams
                })

                if (result.data?.deleteImages?.success) {
                    toast.success(`Image deleted from storage and database`)
                } else {
                    toast.error('Failed to delete image completely')
                }
            } catch (error) {
                console.error('Failed to delete image:', error)
                toast.error('Failed to delete image')
            }
        } else {
            console.warn('No key or ID found for image deletion')
            toast.error('Cannot delete image: missing key or ID')
        }


        const newImages = images.filter((_, i) => i !== index)
        if (images[index]?.is_primary && newImages.length > 0) {
            newImages[0].is_primary = true
        }
        onImagesChange(newImages)
        setDeletingIndex(null)
    }


    const setPrimaryImage = (index: number) => {
        const newImages = images.map((img, i) => ({
            ...img,
            is_primary: i === index
        }))
        onImagesChange(newImages)
    }


    useImperativeHandle(ref, () => ({
        uploadFiles: uploadLocalFiles
    }))

    return (
        <div className="space-y-4">
            { }
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Image Guidelines</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Image width should be greater than 660px</li>
                    <li>• Image aspect ratio should be greater than 0.5</li>
                    <li>• File size should be less than 10mb</li>
                </ul>
            </div>

            { }
            <Dropzone
                onFilesDrop={handleImageUpload}
                accept="image/*"
                multiple={true}
                disabled={disabled || uploading || (images.length + localFiles.length) >= maxImages}
                className={`
                    flex flex-col items-center justify-center p-8 text-center transition-colors
                    ${disabled || uploading || (images.length + localFiles.length) >= maxImages
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer hover:border-gray-400'
                    }
                    ${uploading ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                `}
            >
                <ImageIcon className={`h-12 w-12 mb-4 ${uploading ? 'text-blue-500' : 'text-muted-foreground'}`} />
                <p className="text-lg font-medium mb-2">
                    {uploading ? 'Uploading...' : 'Drag and drop files here or click to upload'}
                </p>
                <p className="text-sm text-muted-foreground">
                    {images.length + localFiles.length}/{maxImages} images selected
                    {uploading && <span className="block text-blue-600 mt-1">Please wait...</span>}
                </p>
            </Dropzone>

            {/* Local Files Preview */}
            {localFiles.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-medium text-orange-600">Files ready for upload:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {localFiles.map((file, index) => (
                            <div key={index} className="relative group">
                                <div className="aspect-square rounded-lg overflow-hidden border-2 border-orange-200 bg-orange-50">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Local file ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                { }
                                <Button
                                    className={`absolute top-2 right-2 h-6 w-6 p-0 transition-opacity ${uploading
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'opacity-0 group-hover:opacity-100'
                                        } bg-red-500 hover:bg-red-600 text-white`}
                                    onClick={() => removeLocalFile(index)}
                                    disabled={disabled || uploading}
                                    title={uploading ? 'Cannot delete while uploading' : 'Remove file'}
                                >
                                    <X className="h-3 w-3" />
                                </Button>

                                { }
                                <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-1 rounded">
                                    <div className="truncate">{file.name}</div>
                                    <div>{(file.size / 1024 / 1024).toFixed(1)}MB</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            { }
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div key={image.id || index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                                <img
                                    src={image.image_url}
                                    alt={`Product image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            { }
                            {image.is_primary && (
                                <Badge className="absolute bottom-2 left-2 bg-blue-600 text-white">
                                    Primary
                                </Badge>
                            )}

                            { }
                            <Button
                                className={`absolute top-2 right-2 h-6 w-6 p-0 transition-opacity ${uploading
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'opacity-0 group-hover:opacity-100'
                                    } bg-red-500 hover:bg-red-600 text-white`}
                                onClick={() => removeImage(index)}
                                disabled={disabled || deletingIndex === index || uploading}
                                title={uploading ? 'Cannot delete while uploading' : 'Delete image'}
                            >
                                {deletingIndex === index ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                    <X className="h-3 w-3" />
                                )}
                            </Button>

                            { }
                            {!image.is_primary && (
                                <Button
                                    className="absolute bottom-2 right-2 h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-gray-500 hover:bg-gray-600 text-white"
                                    onClick={() => setPrimaryImage(index)}
                                    disabled={disabled || deletingIndex === index || uploading}
                                >
                                    Set Primary
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
})
