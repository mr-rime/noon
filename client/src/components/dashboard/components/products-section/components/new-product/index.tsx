import { Breadcrumb } from "@/components/ui/breadcrumb";
import { NewProductImages } from "./components/new-product-images";
import { NewProductInformation } from "./components/new-product-information";

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

            <div className="w-full min-h-[calc(100vh-160px)] bg-white p-5 rounded-[8px]">
                <h2 className="mb-5">Add Product</h2>

                <div className="flex items-start w-full space-x-7 min-h-full">
                    <NewProductImages />
                    <NewProductInformation />
                </div>
            </div >
        </div >
    );
}

