import { ProductsTableWrapper } from "./components/products-table-wrapper";


export function ProductsSection() {
    return (
        <section className="px-10 py-20 w-full min-h-screen">
            <div className="flex items-center justify-between">
                <h2 className="text-[#131313] text-[30px] font-bold">
                    Products List
                </h2>
            </div>

            <ProductsTableWrapper />
        </section>
    )
}