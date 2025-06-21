import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Dropzone } from "@/components/ui/dropzone";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const crumbs = [
    {
        label: "Products",
        href: "/dashboard/products"
    },
    {
        label: "New Product",
        href: "/dashboard/products/new"
    }
]


export function NewProduct() {
    return (
        <div className="px-10 py-20 w-full min-h-screen">
            <div className="mb-5">
                <Breadcrumb items={crumbs} />
            </div>

            <div className="w-full h-full bg-white p-5 rounded-[8px]">
                <h2 className="mb-5">
                    Add Product
                </h2>

                <div className="flex items-start w-full space-x-7">
                    <div className="w-1/2 border border-[#E4E4E7] p-5 rounded-xl">
                        <Dropzone className="w-full h-[250px]" />
                    </div>
                    <div className="w-1/2 border border-[#E4E4E7] p-5 rounded-xl">
                        <Input labelContent="Product Name" className="mb-4" placeholder="product name" input={{ className: "h-[45px] rounded-[8px]" }} />
                        <Select labelContent="Category" options={[{ label: "Smartphones", value: "smartphones" }]} className="mb-4" />
                        <Input labelContent="Price" type="number" min={0} inputMode="decimal" className="mb-4" placeholder="price" input={{ className: "h-[45px] rounded-[8px]" }} />
                        <Select labelContent="Currency" options={[{ label: "EGP", value: "egp" }, { label: "USD", value: "usd" }]} className="mb-4" />
                        <Input labelContent="Stock" type="number" min={0} inputMode="numeric" className="mb-4" placeholder="price" input={{ className: "h-[45px] rounded-[8px]" }} />
                        <div className="flex flex-col items-start justify-center gap-2">
                            <label htmlFor="desc">Description</label>
                            <textarea
                                id="desc"
                                placeholder=""
                                className={
                                    "text-[16px] w-full border border-[#E2E5F1] outline-none rounded-[8px] px-3 pt-3"
                                }
                                rows={4}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
