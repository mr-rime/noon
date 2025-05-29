import { ImageSlider } from "./ui/image-slider";

const images = [
    "/media/imgs/slideable-img1.avif",
    "/media/imgs/slideable-img2.avif",
    "/media/imgs/slideable-img3.avif",
];

const mobileImages = [
    "/media/imgs/slideable-img4.avif",
    "/media/imgs/slideable-img5.avif",
    "/media/imgs/slideable-img6.avif",
]

export function SlideableImages() {
    return (<>

        <ImageSlider
            images={images}
            mobileImages={mobileImages}
            width={1500}
            autoPlay={true}
            autoPlayInterval={3000}
            showControls={true}
            showDots={true}
        />

    </>)
}