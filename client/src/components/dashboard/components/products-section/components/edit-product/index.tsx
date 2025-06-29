import { useMutation, useQuery } from "@apollo/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { GET_PRODUCT, UPDATE_PRODUCT } from "@/graphql/product";
import { useProductStore } from "@/store/create-product-store";
import { EditProductInformation } from "./components/edit-product-information";
import { useParams } from "@tanstack/react-router";
import type { ProductType } from "@/types";
import { EditProductImages } from "./components/edit-product-images";

const crumbs = [
	{
		label: "Products",
		href: "/dashboard/products",
	},
	{
		label: "Edit Product",
		href: "/dashboard/products/edit",
	},
];

export function EditProduct() {
	const { productId } = useParams({ from: "/(dashboard)/_dashboardLayout/dashboard/products/edit/$productId/" });
	const { data: product, loading: prodcutLoading } = useQuery<{
		getProduct: { success: boolean; message: string; product: ProductType };
	}>(GET_PRODUCT, { variables: { id: productId } });
	const [updateProduct, { loading }] = useMutation(UPDATE_PRODUCT);
	const productData = useProductStore((state) => state.product);
	const reset = useProductStore((state) => state.reset);

	const handleEditProduct = async () => {
		try {
			const { data } = await updateProduct({
				variables: {
					...productData,
					id: productId,
					images: productData.images,
				},
			});

			toast.success(data.createProduct.message);
		} catch (err) {
			console.error(err);
		}
	};

	if (prodcutLoading) return "loading...";
	return (
		<div className="px-10 py-20 w-full min-h-screen">
			<div className="mb-5">
				<Breadcrumb onClick={reset} items={crumbs} />
			</div>

			<div className="w-full min-h-[calc(100vh-160px)] bg-white p-5 rounded-[8px]">
				<h2 className="mb-5">Add Product</h2>
				<div className="flex items-start max-md:flex-col w-full max-md:space-y-5 md:space-x-7 min-h-full">
					<EditProductImages product={product?.getProduct.product!} />
					<EditProductInformation product={product?.getProduct.product!} />
				</div>
				<div className="mt-5 w-full flex items-start justify-end">
					{loading ? (
						<Button className="bg-[#3866df] text-white w-full px-4 py-2 rounded-md md:w-[100px] flex items-center justify-center">
							<Loader2 size={20} className="animate-spin" />
						</Button>
					) : (
						<Button
							onClick={handleEditProduct}
							className="bg-[#3866df] w-full md:w-[100px] text-white px-4 py-2 rounded-md"
						>
							Edit
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
