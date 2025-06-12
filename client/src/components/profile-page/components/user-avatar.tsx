
export function UserAvatar() {
    return (
        <div className="bg-white flex items-center space-x-2 rounded-[12px] w-full p-[12px_12px_24px]">
            <div className="h-[64px] aspect-square rounded-full text-white bg-[#6a6a6a] border border-[#dabf8b] text-[20px] font-bold flex items-center justify-center">
                AH
            </div>
            <div>
                <p className="text-[18px]">
                    <strong>Hala Ahmed!</strong>
                </p>
                <p className="text-[14px] text-[#404553] w-[212px] truncate flex">
                    oms51857@gmail.com
                </p>
            </div>
        </div>
    )
}
