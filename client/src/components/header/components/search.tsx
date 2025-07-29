import { Search } from 'lucide-react'
import { Input } from '../../ui/input'

export function SearchInput() {
  return (
    <div className="mx-5 flex w-full items-center justify-center">
      <Input
        type="text"
        icon={<Search size={19} />}
        iconDirection="right"
        className="w-full"
        input={{
          className:
            'h-[40px] w-full rounded-[5px] indent-3 bg-white border border-transparent outline-none focus:border-[#c7ba00] w-full !pl-0',
        }}
        placeholder="What are you looking for?"
      />
    </div>
  )
}
