import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/pages/dashboard/components/ui/card";
import { Button } from "@/pages/dashboard/components/ui/button";
import { ProductAddForm } from "@/pages/dashboard/components/products/product-add-form";
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
				<Button variant="ghost" onClick={() => navigate({ to: "/d/products" })} className="gap-2">
					<ArrowLeft className="h-4 w-4" /> Back
				</Button>
			</div>

			<Card className="shadow-card">
				<CardHeader>
					<CardTitle>Product Details</CardTitle>
				</CardHeader>
				<CardContent>
					<ProductAddForm
						onClose={() => navigate({ to: "/d/products" })}
						onSave={() => navigate({ to: "/d/products" })}
					/>
				</CardContent>
			</Card>
		</div>
	)
}

export const Route = createLazyFileRoute("/(dashboard)/d/_dashboardLayout/products/new/")({
	component: NewProductPage,
});
