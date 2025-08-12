import { Table } from '@/components/ui/table'
import { GET_PRODUCTS } from '@/graphql/product'
import { useQuery } from '@apollo/client'
import { TableSkeleton } from '../../../skeleton-effects'
import type { ProductType } from '@/types'
import { Dropdown } from '@/components/ui/dropdown'
import { Ellipsis, Pen, Trash } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Image } from '@unpic/react'

export default function ProductsTable({ search }: { search: string }) {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data, loading } = useQuery<{
    getProducts: {
      success: boolean
      message: string
      products: (ProductType & { action: string })[]
      total: number
    }
  }>(GET_PRODUCTS, {
    variables: {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      search,
    },
  })

  if (loading) return <TableSkeleton />

  return (
    <Table
      data={data?.getProducts.products || []}
      columns={[
        {
          key: 'name',
          header: 'Product Name',
          render: (row) => (
            <div className="flex items-center space-x-2">
              <Image
                src={row.images[0].image_url}
                alt="product-img"
                className="h-[50px] w-[50px] rounded-[10px] object-cover"
                width={50}
                height={50}
                layout="constrained"
              />
              <div className="w-[300px] truncate">{row.name}</div>
            </div>
          ),
        },
        {
          key: 'category_id',
          header: 'Category',
        },
        {
          key: 'stock',
          header: 'Stock',
        },
        {
          key: 'price',
          header: 'Price',
          render: (row) => <div>${row.price?.toFixed(2)}</div>,
        },
        {
          key: 'action',
          header: 'Action',
          render: (row) => {
            return (
              <Dropdown
                align="center"
                className="px-2"
                trigger={
                  <button className="cursor-pointer">
                    <Ellipsis />
                  </button>
                }>
                <div className="p-1">
                  <Link to="/d/products/edit/$productId" params={{ productId: row.id }}>
                    <div className="grid w-[100px] grid-cols-[max-content_1fr] items-center gap-x-2 rounded-[7px] p-2 hover:bg-[#FFFCD1]">
                      <Pen size={16} /> <span className="text-[15px]">Edit</span>
                    </div>
                  </Link>
                  <div className="grid w-[100px] cursor-pointer grid-cols-[max-content_1fr] items-center gap-x-2 rounded-[7px] p-2 text-[#FF3737] hover:bg-[#FFFCD1]">
                    <Trash size={16} /> <span className="text-[15px]">Delete</span>
                  </div>
                </div>
              </Dropdown>
            )
          },
        },
      ]}
      pageSize={pageSize}
      currentPage={page}
      totalItems={data?.getProducts.total || 0}
      onPageChange={(newPage) => setPage(newPage)}
    />
  )
}
