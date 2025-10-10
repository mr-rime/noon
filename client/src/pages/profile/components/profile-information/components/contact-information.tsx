import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import type { User } from '@/types'
import { Pencil } from 'lucide-react'

export function ContactInformation({ user, loading }: { user: User | undefined; loading: boolean }) {
  return (
    <section className="rounded-[20px] bg-white p-[32px]">
      <h2 className="font-bold text-[18px]">Contact Information</h2>

      <div className="mt-5 flex items-center space-x-6">
        {loading ? (
          <Skeleton className=" mt-8 h-[58px] w-[300px] rounded-[12px] p-[8px_12px]" />
        ) : (
          <Input
            id="email"
            name="email"
            labelContent="Email"
            value={user?.email}
            readOnly
            input={{
              className:
                'bg-[#f3f4f8] rounded-[12px] w-[300px] h-[58px] p-[8px_12px] font-bold indent-0 cursor-not-allowed',
            }}
          />
        )}
        <div>
          {loading ? (
            <Skeleton className=" mt-8 h-[58px] w-[300px] rounded-[12px] p-[8px_12px]" />
          ) : (
            <Input
              id="phone"
              name="phone"
              value={user?.phone_number}
              icon={<Pencil size={14} color="#7E859B" />}
              iconDirection="right"
              readOnly
              labelContent="Phone number"
              placeholder=""
              input={{
                className: 'bg-white rounded-[12px] w-[300px] h-[58px] p-[8px_12px] indent-0 cursor-pointer',
              }}
            />
          )}

        </div>
      </div>
    </section>
  )
}
