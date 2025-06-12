import { LogoutMenu } from "./logout-menu";
import { MyAccountMenu } from "./my-account-menu";
import { ProfileMenu } from "./profile-menu";
import { UserAvatar } from "./user-avatar";

export function Sidebar() {
    return (
        <aside className="sticky top-0 flex flex-col gap-[16px] z-[1] w-[315px]">
            <UserAvatar />
            <ProfileMenu />
            <MyAccountMenu />
            <LogoutMenu />
        </aside>
    )
}