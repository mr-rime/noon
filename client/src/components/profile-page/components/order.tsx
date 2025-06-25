import { useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useRef } from "react";

export function Order() {
	const navigate = useNavigate();
	const buttonRef = useRef<HTMLButtonElement>(null);

	const handleClick = () => {
		if (buttonRef.current) {
			navigate({
				to: "/orders/track/order/$orderId",
				params: { orderId: "1" },
			});
			const ripple = document.createElement("span");
			ripple.className = "absolute bg-[#F6F8FD] rounded-full animate-ripple";

			const rect = buttonRef.current.getBoundingClientRect();
			const size = Math.max(rect.width, rect.height);

			const x = rect.width / 2 - size / 2;
			const y = rect.height / 2 - size / 2;

			ripple.style.left = `${x}px`;
			ripple.style.top = `${y}px`;
			ripple.style.width = `${size}px`;
			ripple.style.height = `${size}px`;

			buttonRef.current.appendChild(ripple);

			setTimeout(() => {
				ripple.remove();
			}, 600);
		}
	};

	return (
		<button
			ref={buttonRef}
			onClick={handleClick}
			className="relative overflow-hidden  bg-white cursor-pointer py-10 px-8 border w-full border-[#dadce3] hover:border-[#9ba0b1] rounded-[8px] transition-colors flex items-center justify-between"
		>
			<div className="z-[2]">
				<div className="flex items-center space-x-1">
					<span className="text-[#38ae04] text-[16px] font-bold">Delivered</span>
					<div>
						<span>on Saturday, 10th May, 02:15 PM</span>
					</div>
				</div>
				<div className="flex items-center space-x-5">
					<img src="/media/imgs/product-img1.avif" alt="product-img" className="w-[64px] h-[89px]" />
					<p className="text-[12px] text-left line-clamp-3 max-w-[270px]">
						COUGAR Roller Skate Shoe Cougar Model 509 For Adult Adjustable Roller Skates with 4 Illuminating Pu
						Wheels, Outdoors and Indoors Roller Blades for Boys Girls Beginners Color : Black Size : 42
					</p>
				</div>
			</div>

			<div className="flex flex-col items-center justify-between min-h-[115px] z-[2]">
				<div />
				<ChevronRight size={23} />
				<div className="text-[12px] text-[#9ba0b1] ">
					<span>Order ID</span> <strong>NEGH50034507263</strong>
				</div>
			</div>
		</button>
	);
}
