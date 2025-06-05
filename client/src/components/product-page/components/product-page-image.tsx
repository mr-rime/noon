import React from "react";
import { ImageSlider } from "../../ui/image-slider";

const images = [
    "/media/imgs/product-img3.avif",
    "/media/imgs/product-img4.avif",
    "/media/imgs/product-img5.avif",
    "/media/imgs/product-img6.avif",
    "/media/imgs/product-img7.avif",
    "/media/imgs/product-img8.avif",
    "/media/imgs/product-img9.avif",
    "/media/imgs/product-img10.avif",
    "/media/imgs/product-img11.avif",
    "/media/imgs/product-img12.avif",
]

type ProductPageImageProps = {
    gallery: React.ReactElement
}

export function ProductPageImage({ gallery }: ProductPageImageProps) {
    const galleryProps = { images };
    const galleryComponent = React.cloneElement(gallery, galleryProps)

    return (
        <div className="w-[calc(300/1200*100%)]">
            <ImageSlider
                height={480}
                images={images}
                mobileImages={images}
                showProductControls
                autoPlay={false}
                showControls={false}
                showDots={false}
            />

            <div className="w-full mt-7">
                {galleryComponent}
            </div>
        </div>
    )
}
