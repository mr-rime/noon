import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Order } from './components'

export function Orders() {
  return (
    <section className="h-screen w-full">
      <div className="w-full">
        <h1 className="font-bold text-[28px]">Orders</h1>
        <p className="text-[#7e859b] text-[1rem]">View the delivery status for items and your order history</p>
      </div>

      <div className="mt-5 flex w-full items-center justify-between">
        <h3 className="font-bold text-[19px]">Completed</h3>

        <div className="flex items-center gap-2">
          <Input
            type="search"
            name="finditems"
            className="w-[360px] "
            input={{
              className:
                'focus:border-[#3866DF] min-h-[48px] rounded-[5px] bg-white hover:border-[#9BA0B1] transition-colors',
            }}
            icon={<Search color="#9BA0B2" size={18} />}
            placeholder="Find items"
            iconDirection="left"
          />
          <Select
            onChange={(v) => {
              console.log(v)
            }}
            options={[
              { label: 'Last 3 months', value: 'last_3_months' },
              { label: 'Last 6 months', value: 'last_6_months' },
              { label: '2025', value: '2025' },
            ]}
            className="min-h-[48px] w-[170px] rounded-[5px] px-5 text-[16px] transition-colors hover:border-[#9BA0B1]"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col">
        <Order />
      </div>
    </section>
  )
}
