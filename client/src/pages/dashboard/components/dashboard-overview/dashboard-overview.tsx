import { BadgeDollarSign } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { RevenueChartSkeleton, TableSkeleton } from '../skeleton-effects'

const LazyRevenueChart = lazy(() => import('./components/revenue-chart/revenue-chart'))
const LazyOrdersTable = lazy(() => import('./components/orders-table/orders-table'))

export function DashboardOverview() {
  return (
    <section className="min-h-screen w-full px-10 py-5">
      <h2 className="font-bold text-[#131313] text-[30px]">Dashboard Overview</h2>
      <p className="text-[#5a7396]">Welcome back! Here's what's happening with your store today.</p>
      <div className="mt-10 grid w-full auto-rows-auto grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="w-full rounded-[10px] bg-white p-5">
          <div className="flex w-full items-center justify-between">
            <span className="font-bold text-[20px]">Total Sales Today</span>
            <BadgeDollarSign size={22} color="#A8A8A8" />
          </div>
          <div className="mt-5 flex items-center justify-between font-bold text-[25px]">
            <span>$12,459</span>
            <span className="ml-2 font-medium text-[14px] text-green-600">+12% from last month</span>
          </div>
        </div>
      </div>
      <Suspense fallback={<RevenueChartSkeleton />}>
        <div className="mt-10 h-[300px] w-full rounded-[10px] bg-white p-5">
          <LazyRevenueChart />
        </div>
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <LazyOrdersTable />
      </Suspense>
    </section>
  )
}
