import { useState } from 'react'
import { Star } from 'lucide-react'
import { Image } from '@unpic/react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { CREATE_PRODUCT_REVIEW, UPDATE_PRODUCT_REVIEW } from '@/graphql/review'
import { useMutation } from '@apollo/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ProductReviewFormProps {
    product: {
        id: string
        product_id: string
        product_name: string
        product_image?: string
        price: number
        currency: string
        quantity: number
    }
    orderId: string
    existingReview?: {
        id: number
        rating: number
        title?: string
        comment: string
    }
    onClose: () => void
    onSuccess: () => void
}

export function ProductReviewForm({
    product,
    orderId,
    existingReview,
    onClose,
    onSuccess
}: ProductReviewFormProps) {
    const [rating, setRating] = useState(existingReview?.rating || 0)
    const [title, setTitle] = useState(existingReview?.title || '')
    const [comment, setComment] = useState(existingReview?.comment || '')
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [createReview] = useMutation(CREATE_PRODUCT_REVIEW)
    const [updateReview] = useMutation(UPDATE_PRODUCT_REVIEW)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            toast.error('Please select a rating')
            return
        }

        setIsSubmitting(true)

        try {
            const reviewData = {
                product_id: product.product_id,
                rating,
                title: title.trim(),
                comment: comment.trim(),
                verified_purchase: true,
                order_id: orderId
            }

            if (existingReview) {
                await updateReview({
                    variables: {
                        id: existingReview.id,
                        rating,
                        title: title.trim(),
                        comment: comment.trim()
                    }
                })
                toast.success('Review updated successfully!')
            } else {
                await createReview({
                    variables: reviewData
                })
                toast.success('Review submitted successfully!')
            }

            onSuccess()
        } catch (error) {
            console.error('Error submitting review:', error)
            toast.error('Failed to submit review. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full max-w-2xl max-h-[90vh] ">
            <div className="flex space-x-4 mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="w-24 h-24 flex-shrink-0">
                    <Image
                        src={product.product_image || "/media/imgs/product-img1.avif"}
                        alt={product.product_name}
                        className="w-full h-full object-cover rounded"
                        width={96}
                        height={96}
                    />
                </div>
                <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">COUGAR</div>
                    <h3 className="font-semibold text-sm leading-tight mb-2">
                        {product.product_name}
                    </h3>
                    <div className="text-sm text-gray-600 mb-1">
                        Color: Black • Size: 42
                    </div>
                    <div className="text-sm text-gray-600">
                        Delivered on Sat, May 10
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                    <h3 className="font-semibold mb-3">How do you rate this product?</h3>
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                            >
                                <Star
                                    size={32}
                                    className={star <= rating ? 'fill-green-500 text-green-500' : 'fill-gray-300 text-gray-300'}
                                />
                            </button>
                        ))}
                    </div>
                </div>


                <div>
                    <Label htmlFor="title" className="text-sm font-medium">
                        Add a title
                    </Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What would you like to highlight?"
                        maxLength={100}
                        className="mt-1"
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                        {title.length}/100
                    </div>
                </div>


                <div>
                    <Label htmlFor="comment" className="text-sm font-medium">
                        Edit product review
                    </Label>
                    <Textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you like or dislike? How did you use the product? What should others know before buying?"
                        maxLength={1000}
                        rows={4}
                        className="mt-1"
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                        {comment.length}/1000
                    </div>
                </div>


                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="anonymous" className="text-sm font-medium">
                            Post anonymously
                        </Label>
                        <p className="text-sm text-gray-500">Posting as Ahmed H.</p>
                    </div>
                    <Switch
                        id="anonymous"
                        checked={isAnonymous}
                        onCheckedChange={setIsAnonymous}
                    />
                </div>


                <div className="flex space-x-4 pt-6">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="flex-1 border border-gray-300 bg-transparent text-black hover:bg-gray-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                        {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                    </Button>
                </div>
            </form>
        </div>
    )
}