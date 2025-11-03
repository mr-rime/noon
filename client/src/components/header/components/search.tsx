import { useCallback, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '../../ui/input'
import { useNavigate } from '@tanstack/react-router'

export function SearchInput() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')

  const go = useCallback(
    (query: string) => {
      const q = query.trim()
      if (!q) return
      navigate({ to: '/category/$', params: { _splat: '' }, search: { q } })
    },
    [navigate],
  )

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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            go(value)
          }
        }}
        placeholder="What are you looking for?"
      />
    </div>
  )
}
