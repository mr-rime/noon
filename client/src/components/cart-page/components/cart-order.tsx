import { Heart, Trash2, Truck } from "lucide-react";
import { Select } from "../../ui/select";

export function CartOrder() {
    const options = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
    ];

    const handleChange = (value: string) => {
        console.log('Selected:', value);
    };
    return (
        <div className="flex items-start w-full h-fit bg-white p-[15px] rounded-[6px]">
            <div className="w-fit h-[200px]">
                <img src="/media/imgs/product-img1.avif" alt="product-img" loading="lazy" className="w-fit h-full" />
            </div>

            <div className="mr-16">
                <div className="h-[20px]">
                    <h2 className="text-[14px] leading-[16px] font-semibold">
                        Apple iPhone 16 Pro Max 256GB Desert Titanium 5G With FaceTime - International Version
                    </h2>
                </div>
                <div className="mt-3 h-[70px]">
                    <span className="text-[#7c87a8] text-[12px]">
                        Order in 14 h 45 m
                    </span>
                    <div className="font-bold text-[12px]">
                        Get it by <span className="text-[#38ae04] font-bold ">Sat, Jun 14</span>
                    </div>
                    <div className="mt-2 text-[14px]">
                        <span className="text-[#7e859b]">Sold by</span> <strong>iQ</strong>
                    </div>
                </div>

                <div className="mt-5 flex items-center space-x-2 h-[30px]">
                    <button className="flex items-center space-x-1 cursor-pointer border border-[#dadce3] rounded-[8px] p-[8px]">
                        <Trash2 size={18} color="#7e859b" />
                        <span className="text-[12px] text-[#7e859b]">
                            Remove
                        </span>
                    </button>
                    <button className="flex items-center space-x-1 cursor-pointer border border-[#dadce3] rounded-[8px] p-[8px]">
                        <Heart size={18} color="#7e859b" />
                        <span className="text-[12px] text-[#7e859b]">
                            Move to Wishlist
                        </span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center w-[150px]">
                <div className="flex flex-col items-center h-[50px]">
                    <div className="text-black flex items-center space-x-1 ">
                        <span className="text-[14px]">EGP</span>
                        <b className="text-[22px]">72555</b>
                    </div>
                    <div className="space-x-1 text-[11px] w-full text-end">
                        <span className="line-through  text-[#7e859b]">
                            77153.05
                        </span>
                        <span className="uppercase text-[#38ae04] font-bold">
                            5% Off
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-end mt-3 h-[50px]">
                    {/* <div className=" w-[70px] h-[70px] ">
                        <img src="/media/svgs/marketplace-v2-en.svg" alt="marketplace-badge" className="w-full h-full" />
                    </div> */}
                    <div className="flex items-center space-x-2">
                        <Truck color="#376FE0" size={20} />
                        <span className="text-[12px] font-medium">Free Delivery</span>
                    </div>
                </div>

                <div className=" flex items-center space-x-4">
                    <span className="text-[#7e859b] text-[14px] ">
                        Qty
                    </span>
                    <Select
                        options={options}
                        defaultValue="1"
                        onChange={handleChange}
                        className="w-[60px] rounded-[8px] p-[8px]"
                    />
                </div>
            </div>
        </div>
    )
}
