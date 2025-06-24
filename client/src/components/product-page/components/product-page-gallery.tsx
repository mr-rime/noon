import { useMemo } from "react";
import { Carousel } from "../../ui/carousel";

type ProductPageGalleryProps = {
    images?: string[]
}

type GalleryItemProps = {
    imgUrl: string
}

export function ProductPageGallery({ images }: ProductPageGalleryProps) {
    const items = useMemo(() => {
        return images?.map((img) => <GalleryItem key={img} imgUrl={img} />)
    }, [images])

    return (
        <Carousel itemWidth={76}>
            {items}
        </Carousel>
    )
}


function GalleryItem({ imgUrl }: GalleryItemProps) {
    return (
        <>
            <div className="w-full max-w-[76px] h-fit max-h-[120px] border border-[#ebecf0] rounded-[2px] flex items-center justify-center">
                <img src={imgUrl} alt={imgUrl} className="select-none" draggable={false} />
            </div>
        </>
    )
}