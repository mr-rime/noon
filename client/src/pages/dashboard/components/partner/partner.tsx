import { PartnerLogin } from '../partner-login/partner-login'

export function PartnerPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center box-border leading-[1.5] bg-[length:100%] bg-no-repeat bg-top"
      style={{ backgroundImage: "url('/media/imgs/partner-login.png')", backgroundColor: 'var(--color-alice)' }}
    >
      <PartnerLogin />
    </div>
  )
}
