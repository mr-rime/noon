import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/pages/dashboard/components/ui/card";
import { Button } from "@/pages/dashboard/components/ui/button";
import { ProductEditForm } from "@/pages/dashboard/components/products/product-edit-form";
import { ArrowLeft } from "lucide-react";

function NewProductPage() {
	const navigate = useNavigate()

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
					<p className="text-muted-foreground">Create a product with specifications, options, and variants</p>
				</div>
				<Button variant="ghost" onClick={() => navigate({ to: "/d/overview" })} className="gap-2">
					<ArrowLeft className="h-4 w-4" /> Back
				</Button>
			</div>

			<Card className="shadow-card">
				<CardHeader>
					<CardTitle>Product Details</CardTitle>
				</CardHeader>
				<CardContent>
					<ProductEditForm
						productId={0}
						onClose={() => navigate({ to: "/d/overview" })}
						onSave={() => navigate({ to: "/d/overview" })}
					/>
				</CardContent>
			</Card>
		</div>
	)
}

export const Route = createLazyFileRoute("/(dashboard)/_dashboardLayout/d/products/new/")({
	component: NewProductPage,
});
