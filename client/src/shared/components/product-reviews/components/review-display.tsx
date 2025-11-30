import { useState } from 'react'
import { Star, User } from 'lucide-react'
import { Image } from '@unpic/react'
import { ProductReviewForm } from './product-review-form'

interface ReviewDisplayProps {
    product: {
        id: string
        product_id: string
        product_name: string
        product_image?: string
        price: number
        currency: string
        quantity: number
    }
    review: {
        id: number
        rating: number
        title?: string
        comment: string
        created_at: string
        user: {
            first_name: string
            last_name: string
        }
    }
    orderId: string
    onReviewUpdate?: () => void
}

export function ReviewDisplay({
    product,
    review,
    orderId,
    onReviewUpdate
}: ReviewDisplayProps) {
    const [showEditForm, setShowEditForm] = useState(false)


    return (
        <>
            <div className="bg-gray-50 rounded-lg p-6 mt-5">
                <div className="flex space-x-4 mb-6">
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


                <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Your feedback</h3>
                        <button
                            onClick={() => setShowEditForm(true)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Edit Review
                        </button>
                    </div>


                    <div className="flex items-center space-x-2 mb-3">
                        <span className="text-sm font-medium">Product Rating</span>
                        <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                            <span>{review.rating}</span>
                            <Star size={14} className="ml-1 fill-white" />
                        </div>
                    </div>


                    <div className="mb-4">
                        {review.title && (
                            <p className="text-sm font-medium mb-1">
                                {review.title}
                            </p>
                        )}
                        <p className="text-sm text-gray-700">
                            {review.comment}
                        </p>
                    </div>


                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User size={16} />
                        <span>Posted as {review.user.first_name} {review.user.last_name.charAt(0)}.</span>
                    </div>
                </div>
            </div>


            {showEditForm && (
                <ProductReviewForm
                    product={product}
                    orderId={orderId}
                    existingReview={review}
                    onClose={() => setShowEditForm(false)}
                    onSuccess={() => {
                        setShowEditForm(false)
                        onReviewUpdate?.()
                    }}
                />
            )}
        </>
    )
}
