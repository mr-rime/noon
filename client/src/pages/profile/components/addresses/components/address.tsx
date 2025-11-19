import { Switch } from '@/components/ui/switch'
import { useState } from 'react'

export function Address() {
  const [isDefault, setIsDefault] = useState(false)
  return (
    <div className="flex items-start bg-white p-[32px]">
      <div className="flex flex-col items-start">
        <div className="font-bold text-[19px]">Home</div>
        <div className="mt-5 flex items-start">
          <div className="w-[104px] text-[#374151]">Name</div>
          <div className="w-[100px]">Ahmed Hany</div>
        </div>

        <div className="mt-3 flex items-start">
          <div className="w-[104px] text-[#374151]">Address</div>
          <div className="w-[500px]">
            <div className="">
              <strong className="break-words ">
                Tariaq Bedon Esm - Samatay - Kotoor - Gharbia Governorate - 6728452
              </strong>
            </div>
            <div>Gharbia, Egypt</div>
          </div>
        </div>

        <div className="mt-3 flex items-start">
          <div className="w-[104px] text-[#374151]">Phone</div>
          <span className="mr-2 min-w-0">+20-10-33579442</span>
          <span className="font-bold text-[#38ae04]">Verified</span>
        </div>
      </div>
      <div className="flex items-center space-x-10">
        <div className="flex items-center space-x-5">
          <button disabled className="cursor-pointer text-[#374151] underline disabled:text-[#cbcfd7]">
            Delete
          </button>
          <button className="cursor-pointer text-[#374151] underline hover:no-underline disabled:text-[#cbcfd7]">
            Edit
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <span className="flex flex-shrink-0 cursor-not-allowed items-center whitespace-nowrap text-[16px] text-sm">
            Default address
          </span>
          <Switch checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
        </div>
      </div>
    </div>
  )
}
