import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { debounce } from "@/utils/debounce";
import { AddOptionSection } from "./add-option-section";
import { AddSpecSection } from "./add-spec-section";
import { useProductStore } from "@/store/create-product-store";
import type { ProductType } from "@/types";

export function NewProductInformation() {
    const setProduct = useProductStore((s) => s.setProduct);
    const product = useProductStore((state) => state.product);

    const [name, setName] = useState(product.name);
    const [categoryId, setCategoryId] = useState(product.category_id);
    const [price, setPrice] = useState(product.price);
    const [currency, setCurrency] = useState(product.currency);
    const [stock, setStock] = useState(product.stock ?? 0);
    const [description, setDescription] = useState(product.product_overview ?? "");

    const debouncedSetProduct =
        debounce((...args: unknown[]) => {
            const data = args[0] as Partial<ProductType>;
            setProduct(data);
        }, 500)

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
        const val = parseFloat(e.target.value) || 0;
        setPrice(val);
        debouncedSetProduct({ price: val });
    };

    const handleCurrencyChange = (val: string) => {
        setCurrency(val);
        debouncedSetProduct({ currency: val });
    };

    const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || 0;
        setStock(val);
        debouncedSetProduct({ stock: val });
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setDescription(val);
        debouncedSetProduct({ product_overview: val });
    };

    return (
        <div className="w-1/2 border border-[#E4E4E7] p-5 rounded-xl min-h-full h-[calc(100vh-160px)] overflow-auto space-y-4">
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
                <label htmlFor="desc">Description</label>
                <textarea
                    id="desc"
                    value={description}
                    onChange={handleDescriptionChange}
                    className="text-[16px] w-full border border-[#E2E5F1] outline-none rounded-[8px] px-3 pt-3"
                    rows={4}
                />
            </div>

            <Separator className="my-7" />
            <AddOptionSection />
            <Separator className="my-7" />
            <AddSpecSection />
        </div>
    );
}
