import { use } from "react";
import { removeImageBackground } from "../../../utils/removeImageBackground";

export function ProductSpecifications() {
    const img = use(removeImageBackground("/media/imgs/spec-1.avif"))

    return (
        <div>
            <div className="font-normal text-[14px] uppercase space-x-1">
                <span className="text-[#667085]">Colour Name:</span> <strong>Desert Titanium</strong>
            </div>
            <div className="mt-3 flex items-center space-x-3">
                <div className="w-full max-w-[70px] h-[70px] p-2 border border-[#EAECF0] rounded-[10px] flex items-center justify-center cursor-pointer">
                    <img src={img} alt="Desert Titanium" className="h-[55px] select-none" draggable={false} />
                </div>

            </div>
        </div>
    )
}
