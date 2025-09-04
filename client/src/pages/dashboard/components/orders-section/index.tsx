import { lazy, Suspense } from 'react'
import { TableSkeleton } from '../skeleton-effects'

const LazyOrdersTable = lazy(() => import('../dashboard-overview/components/orders-table/orders-table'))

export default function OrdersSection() {
  return (
    <section className="min-h-screen w-full px-10 py-20">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-[#131313] text-[30px]">Orders List</h2>
      </div>

      <div className="mt-10 w-full">
        <Suspense fallback={<TableSkeleton />}>
          <LazyOrdersTable />
        </Suspense>
      </div>
    </section>
  )
}
