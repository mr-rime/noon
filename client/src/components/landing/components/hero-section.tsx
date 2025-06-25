import { SlideableImages } from "@/components/slideable-images";
import { ImageSlider } from "@/components/ui/image-slider";

const images = [
    "/media/imgs/slideable-img1.avif",
    "/media/imgs/slideable-img2.avif",
    "/media/imgs/slideable-img3.avif",
    "/media/imgs/slideable-img7.avif",
];

const mobileImages = [
    "/media/imgs/slideable-img4.avif",
    "/media/imgs/slideable-img5.avif",
    "/media/imgs/slideable-img6.avif",
]

export default function HeroSection() {
    return (
        <div
            className="w-full mb-5 flex items-center justify-center px-4 mt-10 overflow-hidden h-fit max-w-[1500px] m-auto"
        >
            <SlideableImages>
                <ImageSlider
                    images={images}
                    mobileImages={mobileImages}
                    autoPlay={true}
                    autoPlayInterval={3000}
                    showControls={true}
                    showDots={true}
                />
            </SlideableImages>
        </div>
    )
}
