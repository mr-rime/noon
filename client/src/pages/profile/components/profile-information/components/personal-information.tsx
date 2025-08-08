import { Calendar, Pencil } from 'lucide-react'
import { useState } from 'react'
import { profil_information_icons } from '../constants/icons'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import type { User } from '@/types'
import { Select } from '@/components/ui/select'
import { Radio } from '@/components/ui/radio'

export function PersonalInformation({ user, loading }: { user: User | undefined; loading: boolean }) {
  const [selected, setSelected] = useState('male')

  return (
    <section className="mt-7 rounded-[20px] bg-white p-[32px]">
      <h2 className="font-bold text-[18px]">Personal Information</h2>

      <div className="mt-5 flex flex-wrap items-center space-x-6">
        {loading ? (
          <Skeleton className="mt-8 h-[58px] w-[300px] rounded-[12px] p-[8px_12px]" />
        ) : (
          <Input
            id="firstName"
            name="firstName"
            defaultValue={user?.first_name}
            labelContent="First name"
            icon={<Pencil size={14} color="#7E859B" />}
            iconDirection="right"
            placeholder="First Name"
            input={{
              className: 'bg-white rounded-[12px] w-[300px] h-[58px] p-[8px_12px] indent-0 focus:border-[#00f]',
            }}
          />
        )}
        {loading ? (
          <Skeleton className="mt-8 h-[58px] w-[300px] rounded-[12px] p-[8px_12px]" />
        ) : (
          <Input
            id="lastName"
            name="lastName"
            defaultValue={user?.last_name}
            labelContent="Last name"
            icon={<Pencil size={14} color="#7E859B" />}
            iconDirection="right"
            placeholder="Last Name"
            input={{
              className: 'bg-white rounded-[12px] w-[300px] h-[58px] p-[8px_12px] indent-0 focus:border-[#00f]',
            }}
          />
        )}
        <Select
          options={[]}
          labelContent="Nationality"
          className="h-[58px] w-[300px] rounded-[12px] bg-white p-[8px_12px]"
        />

        <div className="mt-10 flex items-center space-x-6">
          <div>
            <Input
              id="birthday"
              name="birthday"
              labelContent="Birthday"
              readOnly
              icon={<Calendar size={20} color="#7E859B" />}
              iconDirection="right"
              value={'01 / 01 / 2007'}
              placeholder="birthday"
              input={{
                className:
                  'bg-[#f3f4f8] rounded-[12px] font-bold w-[300px] h-[58px] p-[8px_12px] indent-0 cursor-not-allowed',
              }}
            />
            <span className="mt-3 flex items-center space-x-2 text-[#008000] text-[12px]">
              {profil_information_icons.discountTagIcon}
              <span>Get offers on your special day</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Radio
              label="Male"
              name="gender"
              value="male"
              checked={selected === 'male'}
              onChange={(e) => setSelected(e.target.value)}
            />
            <Radio
              label="Female"
              name="gender"
              value="female"
              checked={selected === 'female'}
              onChange={(e) => setSelected(e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
