export function ProductOverviewTabs() {
  return (
    <div className="w-full p-[18px_32px] shadow-[0_8px_16px_-12px_rgba(0,0,0,.15)]">
      <div className="site-container flex w-full items-center max-md:flex-col max-md:gap-3 max-md:text-center md:space-x-4">
        <a
          href="#porduct_overview"
          className="rounded-full border border-[#cfcfcf] p-[8px_16px] text-[16px] max-md:w-full">
          Product Overview
        </a>
        <a
          href="#porduct_reviews"
          className="rounded-full border border-[#cfcfcf] p-[8px_16px] text-[16px] max-md:w-full max-md:text-center">
          Product Ratings & Reviews
        </a>
      </div>
    </div>
  )
}
