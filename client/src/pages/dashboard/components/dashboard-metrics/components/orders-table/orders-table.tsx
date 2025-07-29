import { Table } from '@/components/ui/table'
import { cn } from '@/utils/cn'

type Order = {
  number: string
  date: string
  customer: string
  items: number
  paid: boolean
  status: string
  total: number
}

const orders: Order[] = [
  {
    number: '001',
    date: '25/12/2022',
    customer: 'John Doe',
    items: 1,
    paid: true,
    status: 'Delivered',
    total: 245.99,
  },
  {
    number: '002',
    date: '25/12/2022',
    customer: 'Jane Doe',
    items: 1,
    paid: false,
    status: 'Delivered',
    total: 245.99,
  },
  {
    number: '003',
    date: '25/12/2022',
    customer: 'John Doe',
    items: 1,
    paid: true,
    status: 'Delivered',
    total: 245.99,
  },
  {
    number: '004',
    date: '25/12/2022',
    customer: 'Jane Doe',
    items: 1,
    paid: false,
    status: 'Delivered',
    total: 245.99,
  },
  {
    number: '005',
    date: '25/12/2022',
    customer: 'John Doe',
    items: 1,
    paid: true,
    status: 'Delivered',
    total: 245.99,
  },
  {
    number: '006',
    date: '25/12/2022',
    customer: 'Jane Doe',
    items: 1,
    paid: false,
    status: 'Delivered',
    total: 245.99,
  },
  {
    number: '007',
    date: '25/12/2022',
    customer: 'John Doe',
    items: 1,
    paid: true,
    status: 'Delivered',
    total: 245.99,
  },
  {
    number: '008',
    date: '25/12/2022',
    customer: 'Jane Doe',
    items: 1,
    paid: true,
    status: 'Delivered',
    total: 245.99,
  },
  {
    number: '009',
    date: '25/12/2022',
    customer: 'John Doe',
    items: 1,
    paid: true,
    status: 'Delivered',
    total: 245.99,
  },
  {
    number: '010',
    date: '25/12/2022',
    customer: 'Jane Doe',
    items: 1,
    paid: true,
    status: 'Delivered',
    total: 245.99,
  },
]

export default function OrdersTable() {
  return (
    <div className="mx-auto mt-5 min-h-[300px] w-full rounded-2xl bg-white p-6">
      <h3 className="mb-5 font-bold text-[20px]">Recent Orders</h3>
      <Table<Order>
        data={orders}
        columns={[
          { key: 'number', header: 'No.', sortable: true },
          { key: 'date', header: 'Date', sortable: true },
          { key: 'customer', header: 'Customer' },
          {
            key: 'items',
            header: 'Items',
            sortable: true,
            render: (row) => <span>{row.items} Items</span>,
          },
          {
            key: 'paid',
            header: 'Paid',
            render: (row) => (
              <span
                className={cn(
                  'rounded-[7px] px-3 py-1',
                  row.paid ? 'bg-[#E7F7ED] text-[#149345]' : 'bg-[#FDEED8] text-[#DC7745]',
                )}>
                {row.paid ? 'Yes' : 'No'}
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
          },
          {
            key: 'total',
            header: 'Total',
            render: (row) => <span>${row.total.toFixed(2)}</span>,
          },
        ]}
        pageSize={5}
      />
    </div>
  )
}
