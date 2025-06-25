import { useState } from "react";
import type { ProductSpecification } from "@/types";
import { cn } from "@/utils/cn";
import { Separator } from "../../ui/separator";
import { SpecificationsTable } from "../../ui/specifications-table";
import { SpecRow } from "../../ui/specifications-table/spec-row";

export function ProductOverview({ specs, overview }: { specs: ProductSpecification[]; overview: string }) {
	const [isCollapsible, setIsCollapsible] = useState(false);
	const specificationsPerSide = Math.ceil(specs?.length / 2);
	const isCollapsibleActive = specificationsPerSide > 20;

	return (
		<section aria-labelledby="product-overview-heading" className="relative">
			<header>
				<h1 id="product-overview-heading" className="font-bold text-[24px]">
					Product Overview
				</h1>
			</header>
			<Separator className="my-5" />
			<section
				className={cn(
					"flex flex-col items-start justify-center gap-[30px] overflow-hidden transition-all duration-500",
					isCollapsible ? "max-h-[2000px]" : "max-h-[500px]",
				)}
			>
				<section className="w-full">
					{/* <section aria-labelledby="highlights-heading">
                        <h2 id="highlights-heading" className="font-bold text-[16px] mb-4">Highlights</h2>
                        <ul className="list-disc pl-5 space-y-2 w-full text-justify ">
                            <li className="w-full">
                                <span className="text-[14px]">
                                    Personalise your home screen. Tint your icons with any colour. Rearrange and resize apps and widgets. You can even lock or hide apps to protect sensitive information — it's your call.
                                </span>
                            </li>
                            <li className="w-full">
                                <span className="text-[14px]">
                                    Choose your controls. Swap out your lock screen controls for ones you love to use more often. Or you can assign a control to the action button.
                                </span>
                            </li>
                            <li className="w-full">
                                <span className="text-[14px]">
                                    In the redesigned Photos app, your Collections are automatically organised by topic, like people and pets.
                                </span>
                            </li>
                            <li className="w-full">
                                <span className="text-[14px]">
                                    Personalise every style even more with the new control pad, which makes it easy to adjust tone and colour simultaneously. You can also use the slider to adjust the intensity of specific colours instead of applying a one-size-fits-all approach.
                                </span>
                            </li>
                            <li className="w-full">
                                <span className="text-[14px]">Our improved image pipeline also enables more creative styles, which allow you to customise the different moods of a photo through colour.</span>
                            </li>
                        </ul>
                    </section> */}

					<section aria-labelledby="overview-heading">
						<h2 id="overview-heading" className="font-bold text-[16px] mb-4">
							Overview
						</h2>
						<p className="text-[14px] text-justify">{overview}</p>
					</section>
				</section>

				<section>
					<h2 id="specifications-heading" className="font-bold text-[16px] mb-4">
						Specifications
					</h2>
					<div className="w-full grid grid-cols-2 gap-4">
						<div className="col-span-1">
							<SpecificationsTable>
								{specs?.slice(0, specificationsPerSide).map((spec, idx) => (
									<SpecRow
										specName={spec.spec_name}
										specValue={spec.spec_value}
										bgColor={idx % 2 === 0 ? "#EFF3FD" : "#FFF"}
									/>
								))}
							</SpecificationsTable>
						</div>
						<div className="col-span-1">
							<SpecificationsTable>
								{specs?.slice(specificationsPerSide).map((spec, idx) => (
									<SpecRow
										specName={spec.spec_name}
										specValue={spec.spec_value}
										bgColor={idx % 2 === 0 ? "#EFF3FD" : "#FFF"}
									/>
								))}
							</SpecificationsTable>
						</div>
					</div>
				</section>
			</section>

			{isCollapsibleActive && (
				<button
					onClick={() => setIsCollapsible((prev) => !prev)}
					className={cn(
						"absolute left-0 right-0  h-[120px] cursor-pointer w-full flex items-center justify-center",
						isCollapsible ? "bottom-[-92px]" : "bg-white-blur bottom-[-63px]",
					)}
				>
					<span className="border border-[#3866df] text-[#3866df] text-[16px] text-nowrap overflow-hidden p-[6px_30px] max-w-[300px] font-bold bg-white rounded-[4px]">
						{isCollapsible ? "Show Less" : "View Full Overview"}
					</span>
				</button>
			)}
		</section>
	);
}
