import { Breadcrumb } from "@/components/ui/breadcrumb";
import { NewProductImages } from "./components/new-product-images";
import { NewProductInformation } from "./components/new-product-information";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/store/create-product-store";
import { useMutation } from "@apollo/client";
import { CREATE_PRODUCT } from "@/graphql/product";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
    const [createNewProduct, { loading }] = useMutation(CREATE_PRODUCT)
    const productData = useProductStore(state => state.product)

    const handleCreateNewProduct = async () => {
        try {
            const { data } = await createNewProduct({
                variables: {
                    ...productData,
                    images: productData.images
                }
            })

            toast.success(data.createProduct.message)
        } catch (err) {
            console.error(err)
        }
    }

    console.log(productData)

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
                <div className="mt-5 w-full flex items-start justify-end">
                    {
                        loading ? <Button className="bg-[#3866df] text-white px-4 py-2 rounded-md w-[100px] flex items-center justify-center">
                            <Loader2 size={20} className="animate-spin" />
                        </Button> : <Button onClick={handleCreateNewProduct} className="bg-[#3866df] w-[100px] text-white px-4 py-2 rounded-md">Publish</Button>
                    }
                </div>
            </div >
        </div >
    );
}

