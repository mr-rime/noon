import { Skeleton } from '@/shared/components/ui/skeleton'
import { GET_USER } from '@/shared/api/user'
import useUserHashStore from '@/store/user-hash/user-hash'
import { useQuery } from '@apollo/client'
import Cookies from 'js-cookie'
export function UserAvatar() {
  const hash = useUserHashStore((state) => state.hash)
  const { data, loading } = useQuery(GET_USER, {
    variables: { hash: Cookies.get('hash') || hash || '' },
  })

  return (
    <div className="flex w-full items-center space-x-2 rounded-[12px] bg-white p-[12px_12px_24px]">
      <div className="flex aspect-square h-[64px] items-center justify-center rounded-full border border-[#dabf8b] bg-[#6a6a6a] font-bold text-[20px] text-white">
        AH
      </div>
      <div>
        <div className="text-[18px]">
          <strong className="flex items-center">
            <span className="mr-1">Hello</span>{' '}
            {loading ? <Skeleton className="h-[15px] rounded-[3px]" /> : `${data.getUser.user.first_name}!`}
          </strong>
        </div>
        <p className="flex w-[212px] truncate text-[#404553] text-[14px]">oms51857@gmail.com</p>
      </div>
    </div>
  )
}
