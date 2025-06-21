import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Dropzone } from "@/components/ui/dropzone";

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
            <div className="w-full h-full bg-white p-3 rounded-[8px]">
                <h2 className="mb-5">
                    Add Product
                </h2>

                <div>
                    <div>
                        <Dropzone />
                    </div>
                    <div>
                        data
                    </div>
                </div>
            </div>
        </div>
    )
}
