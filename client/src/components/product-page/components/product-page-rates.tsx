import { Star } from "lucide-react";

export function ProductPageRates() {
    return (
        <div className="flex items-center space-x-2">
            <div>
                4.6
            </div>

            <div className="flex items-center space-x-0.5">
                <Star fill="#008000" color="#008000" size={20} />
                <Star fill="#008000" color="#008000" size={20} />
                <Star fill="#008000" color="#008000" size={20} />
                <Star fill="#008000" color="#008000" size={20} />
                <Star fill="#008000" color="#008000" size={20} />
            </div>

            <div className="text-[#3866DF] underline font-semibold space-x-[4px]">
                <span>18521 Ratings</span>
            </div>
        </div>
    )
}
