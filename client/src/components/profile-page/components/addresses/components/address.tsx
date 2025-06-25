import { useState } from "react";
import { Switch } from "../../../../ui/switch";

export function Address() {
	const [isDefault, setIsDefault] = useState(false);
	return (
		<div className="bg-white  p-[32px] flex items-start">
			<div className="flex flex-col items-start">
				<div className="text-[19px] font-bold">Home</div>
				<div className="flex items-start mt-5">
					<div className="text-[#9ba0b1] w-[104px]">Name</div>
					<div className="w-[100px]">Ahmed Hany</div>
				</div>

				<div className="flex items-start mt-3">
					<div className="text-[#9ba0b1] w-[104px]">Address</div>
					<div className="w-[500px]">
						<div className="">
							<strong className="break-words ">
								امام سعاف بجانب مدرسة الشهيد عبد المعطي حمدان, Tariaq Bedon Esm - Samatay - Kotoor - Gharbia
								Governorate - 6728452
							</strong>
						</div>
						<div>Gharbia, Egypt</div>
					</div>
				</div>

				<div className="flex items-start mt-3">
					<div className="text-[#9ba0b1] w-[104px]">Phone</div>
					<span className="mr-2 min-w-0">+20-10-33579442</span>
					<span className="text-[#38ae04] font-bold">Verified</span>
				</div>
			</div>
			<div className="flex items-center space-x-10">
				<div className="flex items-center space-x-5">
					<button disabled className="underline disabled:text-[#cbcfd7] text-[#9ba0b1] cursor-pointer">
						Delete
					</button>
					<button className="underline disabled:text-[#cbcfd7] text-[#9ba0b1] cursor-pointer hover:no-underline">
						Edit
					</button>
				</div>
				<div className="flex items-center space-x-3">
					<span className="flex-shrink-0 flex text-[16px] items-center text-sm  cursor-not-allowed whitespace-nowrap">
						Default address
					</span>
					<Switch checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
				</div>
			</div>
		</div>
	);
}
