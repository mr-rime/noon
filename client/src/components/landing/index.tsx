import { SlideableImages } from "../slideable-images";
import { ImageSlider } from "../ui/image-slider";
import { RecommendedProducts } from "./components/recommended-products";

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

export function Landing() {
    return (
        <div className="flex flex-col justify-center w-full min-h-screen site-container">
            <div
                className="w-full flex items-center justify-center px-4 mt-10 overflow-hidden min-h-[300px] max-w-[1500px] m-auto"
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

            <div className="m-5 min-h-[467px]">
                <RecommendedProducts />
            </div>

        </div>
    )
}
