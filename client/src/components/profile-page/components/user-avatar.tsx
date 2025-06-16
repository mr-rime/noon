import { useQuery } from "@apollo/client"
import { GET_USER } from "../../../graphql/user"
import { userHash } from "../../../constants/cookies";
import { Skeleton } from "../../ui/skeleton";

export function UserAvatar() {
    const { data, loading } = useQuery(GET_USER, { variables: { hash: userHash } });

    return (
        <div className="bg-white flex items-center space-x-2 rounded-[12px] w-full p-[12px_12px_24px]">
            <div className="h-[64px] aspect-square rounded-full text-white bg-[#6a6a6a] border border-[#dabf8b] text-[20px] font-bold flex items-center justify-center">
                AH
            </div>
            <div>
                <p className="text-[18px]">
                    <strong className="flex items-center"><span className="mr-1">Hala</span> {loading ? <Skeleton className="h-[15px] rounded-[3px]" /> : `${data.getUser.user.first_name}!`}</strong>
                </p>
                <p className="text-[14px] text-[#404553] w-[212px] truncate flex">
                    oms51857@gmail.com
                </p>
            </div>
        </div>
    )
}
