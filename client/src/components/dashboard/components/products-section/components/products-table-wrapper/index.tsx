import { useNavigate, useSearch } from '@tanstack/react-router'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProductsTable from '../products-table'
import { useState } from 'react'
import { useDebounce } from '@/hooks/use-debounce'

export function ProductsTableWrapper() {
  const navigate = useNavigate({ from: '/dashboard/products' })
  const { q: searchQuery = '' } = useSearch({ from: '/(dashboard)/_dashboardLayout/dashboard/products/' })

  const [inputValue, setInputValue] = useState(searchQuery)

  const handleSearch = useDebounce((value: string) => {
    navigate({ search: { q: value || '' } })
  }, 400)

  return (
    <div className="mt-10 w-full">
      <div className="mx-auto mt-5 min-h-[300px] w-full rounded-2xl bg-white p-6">
        <div className="mb-6 flex w-full items-center justify-between space-x-3">
          <Input
            placeholder="Search"
            icon={<Search size={17} color="#71717B" />}
            input={{ className: 'rounded-[10px]' }}
            iconDirection="right"
            value={inputValue}
            onChange={(e) => {
              const val = e.target.value
              setInputValue(val)
              handleSearch(val)
            }}
          />
          <Button
            onClick={() => navigate({ to: '/dashboard/products/new' })}
            className="flex h-[40px] items-center space-x-1 rounded-[10px] font-semibold text-white capitalize">
            <Plus />
            <span>Add Product</span>
          </Button>
        </div>
        <ProductsTable search={searchQuery} />
      </div>
    </div>
  )
}
