import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function NewProductInformation() {
    return (
        <form className="w-1/2 border border-[#E4E4E7] p-5 rounded-xl min-h-full h-[calc(100vh-160px)]">
            <Input
                labelContent="Product Name"
                className="mb-4"
                placeholder="product name"
                input={{ className: "h-[45px] rounded-[8px]" }}
            />
            <Select
                labelContent="Category"
                options={[{ label: "Smartphones", value: "smartphones" }]}
                className="mb-4"
            />
            <Input
                labelContent="Price"
                type="number"
                min={0}
                inputMode="decimal"
                className="mb-4"
                placeholder="price"
                input={{ className: "h-[45px] rounded-[8px]" }}
            />
            <Select
                labelContent="Currency"
                options={[
                    { label: "EGP", value: "egp" },
                    { label: "USD", value: "usd" },
                ]}
                className="mb-4"
            />
            <Input
                labelContent="Stock"
                type="number"
                min={0}
                inputMode="numeric"
                className="mb-4"
                placeholder="stock"
                input={{ className: "h-[45px] rounded-[8px]" }}
            />
            <div className="flex flex-col items-start justify-center gap-2">
                <label htmlFor="desc">Description</label>
                <textarea
                    id="desc"
                    placeholder=""
                    className="text-[16px] w-full border border-[#E2E5F1] outline-none rounded-[8px] px-3 pt-3"
                    rows={4}
                />
            </div>
        </form>
    )
}
