import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useProductStore } from "@/store/create-product-store";
import type { ProductType } from "@/types";
import { debounce } from "@/utils/debounce";
import { AddOptionSection } from "./edit-option-section";
import { AddSpecSection } from "./edit-spec-section";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";

export function EditProductInformation({ product }: { product: ProductType }) {
	const setProduct = useProductStore((s) => s.setProduct);

	const [name, setName] = useState(product.name);
	const [categoryId, setCategoryId] = useState(product.category_id);
	const [price, setPrice] = useState(product.price);
	const [currency, setCurrency] = useState(product.currency);
	const [stock, setStock] = useState(product.stock ?? 0);
	const [description, setDescription] = useState(product.product_overview);
	const [isReturnable, setIsReturnable] = useState(product.is_returnable ?? true);

	const [discountType, setDiscountType] = useState<"percentage" | "fixed">(product.discount?.type || "percentage");
	const [discountValue, setDiscountValue] = useState(product.discount?.value || 0);
	const [discountStartsAt, setDiscountStartsAt] = useState(product.discount?.starts_at || null);
	const [discountEndsAt, setDiscountEndsAt] = useState(product.discount?.ends_at || null);

	useEffect(() => {
		setProduct({
			name,
			price,
			stock,
			product_overview: description,
			discount: {
				starts_at: discountStartsAt!,
				ends_at: discountEndsAt!,
				type: discountType,
				value: discountValue,
			},
		});
	}, []);

	const debouncedSetProduct = debounce((...args: unknown[]) => {
		const data = args[0] as Partial<ProductType>;
		setProduct(data);
	}, 300);

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setName(val);
		debouncedSetProduct({ name: val });
	};

	const handleCategoryChange = (val: string) => {
		setCategoryId(val);
		debouncedSetProduct({ category_id: val });
	};

	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = Number.parseFloat(e.target.value) || 0;
		setPrice(val);
		debouncedSetProduct({ price: val });
	};

	const handleCurrencyChange = (val: string) => {
		setCurrency(val);
		debouncedSetProduct({ currency: val });
	};

	const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = Number.parseInt(e.target.value) || 0;
		setStock(val);
		debouncedSetProduct({ stock: val });
	};

	const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const val = e.target.value;
		setDescription(val);
		debouncedSetProduct({ product_overview: val });
	};

	const updateDiscount = (custom: Partial<ProductType["discount"]>) => {
		debouncedSetProduct({
			discount: {
				type: discountType,
				value: discountValue,
				starts_at: discountStartsAt,
				ends_at: discountEndsAt,
				...custom,
			},
		});
	};

	const handleDiscountTypeChange = (val: string) => {
		setDiscountType(val as "percentage" | "fixed");
		updateDiscount({ type: val as "percentage" | "fixed" });
	};

	const handleDiscountValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = Number.parseFloat(e.target.value) || 0;
		setDiscountValue(val);
		updateDiscount({ value: val });
	};

	const handleDiscountStartsAtChange = (date: Date) => {
		setDiscountStartsAt(date);
		updateDiscount({ starts_at: date });
	};

	const handleDiscountEndsAtChange = (date: Date) => {
		setDiscountEndsAt(date);
		updateDiscount({ ends_at: date });
	};

	const handleReturnableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const checked = e.target.checked;
		setIsReturnable(checked);
		debouncedSetProduct({ is_returnable: checked });
	};

	return (
		<div className="md:w-1/2 w-full border border-[#E4E4E7] p-5 rounded-xl min-h-full h-[calc(100vh-160px)] overflow-auto space-y-4">
			<Input
				labelContent="Product Name"
				className="mb-2"
				placeholder="product name"
				value={name}
				onChange={handleNameChange}
				input={{ className: "h-[45px] rounded-[8px]" }}
			/>

			<Select
				labelContent="Category"
				defaultValue={categoryId}
				onChange={handleCategoryChange}
				options={[{ label: "Smartphones", value: "daflkjdaf" }]}
				className="mb-2"
			/>

			<Input
				labelContent="Price"
				type="number"
				min={0}
				inputMode="decimal"
				className="mb-2"
				placeholder="price"
				value={price}
				onChange={handlePriceChange}
				input={{ className: "h-[45px] rounded-[8px]" }}
			/>

			<div className="w-full block my-4">
				<div>Discount</div>
				<div className="grid grid-cols-2 gap-3 mt-2">
					<Select
						className="col-span-1"
						labelContent="Type"
						defaultValue={discountType}
						onChange={handleDiscountTypeChange}
						options={[
							{ label: "Percentage", value: "percentage" },
							{ label: "Fixed", value: "fixed" },
						]}
					/>
					<Input
						labelContent="Value"
						type="number"
						inputMode="numeric"
						min={0}
						placeholder="discount value"
						value={discountValue}
						onChange={handleDiscountValueChange}
						input={{ className: "h-[45px] rounded-[8px]" }}
						className="col-span-1"
					/>
				</div>
				<div className="grid grid-cols-2 gap-3 mt-3">
					<DatePicker labelContent="Starts At" value={discountStartsAt} onChange={handleDiscountStartsAtChange} />
					<DatePicker labelContent="Ends At" value={discountEndsAt} onChange={handleDiscountEndsAtChange} />
				</div>
			</div>

			<Select
				labelContent="Currency"
				defaultValue={currency}
				onChange={handleCurrencyChange}
				options={[
					{ label: "EGP", value: "EGP" },
					{ label: "USD", value: "USD" },
				]}
				className="mb-2"
			/>

			<Input
				labelContent="Stock"
				type="number"
				min={0}
				inputMode="numeric"
				className="mb-2"
				placeholder="stock"
				value={stock}
				onChange={handleStockChange}
				input={{ className: "h-[45px] rounded-[8px]" }}
			/>

			<div className="flex flex-col items-start justify-center gap-2">
				<label>Description</label>
				<textarea
					value={description}
					onChange={handleDescriptionChange}
					className="text-[16px] w-full border border-[#E2E5F1] outline-none rounded-[8px] px-3 pt-3"
					rows={4}
				/>
			</div>

			<div className="flex flex-col items-start justify-center gap-2">
				<label>Is Returnable</label>
				<Switch checked={isReturnable} onChange={handleReturnableChange} />
			</div>

			<Separator className="my-7" />
			<AddOptionSection options={product.productOptions} />
			<Separator className="my-7" />
			<AddSpecSection specs={product.productSpecifications} />
		</div>
	);
}
