import { Star } from 'lucide-react'
import { Progress } from '../progress'

export function RatingsBar() {
  return (
    <div className="w-full ">
      <div className="flex w-full items-center space-x-1">
        <div className="flex items-center">
          <div className="mr-1 w-[8px] font-bold text-[14px]">
            <span>5</span>
          </div>
          <Star fill="#008000" color="#008000" size={15} />
        </div>
        <Progress progressPercentage={200} />
        <div className="ml-1 font-bold text-[14px]">
          <span>77%</span>
        </div>
      </div>

      <div className="mt-2 flex w-full items-center space-x-1">
        <div className="flex items-center">
          <div className="mr-1 w-[8px] font-bold text-[14px]">
            <span>4</span>
          </div>
          <Star fill="#80AE04" color="#80AE04" size={15} />
        </div>
        <Progress progressPercentage={30} progressColor="#82ae04" />
        <div className="ml-1 font-bold text-[14px]">
          <span>5%</span>
        </div>
      </div>

      <div className="mt-2 flex w-full items-center space-x-1">
        <div className="flex items-center">
          <div className="mr-1 w-[8px] font-bold text-[14px]">
            <span>3</span>
          </div>
          <Star fill="#F2AA31" color="#F2AA31" size={15} />
        </div>
        <Progress progressPercentage={30} progressColor="#F3AC30" />
        <div className="ml-1 font-bold text-[14px]">
          <span>5%</span>
        </div>
      </div>

      <div className="mt-2 flex w-full items-center space-x-1">
        <div className="flex items-center">
          <div className="mr-1 w-[8px] font-bold text-[14px]">
            <span>2</span>
          </div>
          <Star fill="#F36C31" color="#F36C31" size={15} />
        </div>
        <Progress progressPercentage={0} progressColor="#F36C32" />
        <div className="ml-1 font-bold text-[14px]">
          <span>0%</span>
        </div>
      </div>

      <div className="mt-2 flex w-full items-center space-x-1">
        <div className="flex items-center">
          <div className="mr-1 w-[8px] font-bold text-[14px]">
            <span>1</span>
          </div>
          <Star fill="#F36C31" color="#F36C31" size={15} />
        </div>
        <Progress progressPercentage={70} progressColor="#F36C32" />
        <div className="ml-1 font-bold text-[14px]">
          <span>14%</span>
        </div>
      </div>
    </div>
  )
}
