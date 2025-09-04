import { Package } from 'lucide-react'

export function StoreAvatar() {
  return (
    <div className="flex items-start space-x-3">
      <div className="grid h-[40px] w-[40px] place-content-center overflow-hidden rounded-xl bg-[#2977F5] ">
        <Package size={20} color="white" />
      </div>
      <div className="text-[18px]">
        <strong>Admin Panel</strong>
        <h2 className="text-[#5a7396] text-[12px]">E-commerce Dashboard</h2>
      </div>
    </div>
  )
}
