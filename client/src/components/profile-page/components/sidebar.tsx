import { LogoutMenu } from './logout-menu'
import { MyAccountMenu } from './my-account-menu'
import { ProfileMenu } from './profile-menu'
import { UserAvatar } from './user-avatar'

export function Sidebar() {
  return (
    <aside className="sticky top-0 z-[1] flex w-[315px] flex-col gap-[16px]">
      <UserAvatar />
      <ProfileMenu />
      <MyAccountMenu />
      <LogoutMenu />
    </aside>
  )
}
