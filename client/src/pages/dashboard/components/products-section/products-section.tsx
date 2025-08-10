import { ProductsTableWrapper } from './components/products-table-wrapper/products-table-wrapper'

export function ProductsSection() {
  return (
    <section className="min-h-screen w-full px-10 py-20">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-[#131313] text-[30px]">Products List</h2>
      </div>

      <ProductsTableWrapper />
    </section>
  )
}
