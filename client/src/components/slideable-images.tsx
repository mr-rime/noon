import { ImageSlider } from "./ui/image-slider";

const images = [
    "/media/imgs/slideable-img1.avif",
    "/media/imgs/slideable-img2.avif",
    "/media/imgs/slideable-img3.avif",
    // "/media/imgs/slideable-img4.avif",
];


export function SlideableImages() {
    return (<>

        <ImageSlider
            images={images}
            width={1500}
            
            autoPlay={false}
            autoPlayInterval={3000}
            showControls={true}
            showDots={true}
        />

    </>)
}