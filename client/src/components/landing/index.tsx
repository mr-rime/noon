import { lazy, Suspense } from "react";
import HeroSection from "./components/hero-section";
import { ProductsListSkeleton } from "../ui/products-list-skeleton";


const LazyRecommendedProducts = lazy(() => import("./components/recommended-products"))

export function Landing() {
    return (
        <div className="flex flex-col justify-center w-full min-h-screen site-container">
            <HeroSection />
            <div className="bg-white min-h-[467px] ">
                <h3 className="uppercase font-extrabold text-[50px] my-2  text-center select-none">
                    <span className="text-black">Recommended</span> <span className="text-[#E4041B]">for you</span>
                </h3>
                <Suspense fallback={<div className="p-4">
                    <ProductsListSkeleton />
                </div>}>
                    <LazyRecommendedProducts />
                </Suspense>
            </div>

        </div>
    )
}
