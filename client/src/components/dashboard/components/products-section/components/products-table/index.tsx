import { Table } from "@/components/ui/table";



type Product = {
    category: string
    name: string
    price: string
    stock: number
    status: string
}

const products: Product[] = Array.from({ length: 10 }).map((_, i) => ({
    category: `Category ${i + 1}`,
    name: `Product ${i + 1}`,
    price: (i + 1) * 100 + ".00",
    stock: i % 2 === 0 ? 10 : 20,
    status: i % 2 ? "In Stock" : "Out Of Stock",
}))

export default function ProductsTable() {
    return (

        <Table
            data={products}
            columns={[
                {
                    key: "name",
                    header: "Product Name",
                    render: (row) => (
                        <div className="flex items-center space-x-2">
                            <img src="/media/imgs/product-img1.avif" alt="product-img" className="w-[50px] h-[50px] rounded-[10px]" />
                            <div>
                                {row.name}
                            </div>
                        </div>
                    )
                },
                {
                    key: "category",
                    header: "Category",
                },
                {
                    key: "stock",
                    header: "Stock"
                },
                {
                    key: "price",
                    header: "Price",
                    render: (row) => (
                        <div>
                            ${row.price}
                        </div>
                    )
                },
                {
                    key: "status",
                    header: "Status"
                },
            ]}
            pageSize={5}
        />

    )
}
