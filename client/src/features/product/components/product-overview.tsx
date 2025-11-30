import { useState } from 'react'
import type { ProductSpecification } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { Separator } from '@/shared/components/ui/separator'
import { SpecificationsTable } from '@/shared/components/ui/specifications-table'
import { SpecRow } from '@/shared/components/ui/specifications-table/spec-row'
import { useIsMobile } from '@/shared/hooks/use-mobile'

export function ProductOverview({ specs, overview }: { specs: ProductSpecification[]; overview: string }) {
  const [isCollapsible, setIsCollapsible] = useState(false)
  const specificationsPerSide = Math.ceil(specs?.length / 2)
  const isMobile = useIsMobile()
  const isCollapsibleActive = isMobile || specificationsPerSide > 20

  return (
    <section aria-labelledby="product-overview-heading" className="relative max-md:p-5">
      <header>
        <h1 id="product-overview-heading" className="font-bold text-[24px]">
          Product Overview
        </h1>
      </header>
      <Separator className="my-5" />
      <section
        className={cn(
          'flex flex-col items-start justify-center gap-[30px] overflow-hidden transition-all duration-500',
          isCollapsible ? 'max-h-[2000px]' : 'max-h-[500px]',
        )}>
        <section className="w-full ">
          <section aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="mb-4 font-bold text-[16px]">
              Overview
            </h2>
            <p className="text-justify text-[14px]">{overview}</p>
          </section>
        </section>

        <section>
          <h2 id="specifications-heading" className="mb-4 font-bold text-[16px]">
            Specifications
          </h2>
          <div className="grid w-full grid-cols-2 gap-4 max-md:grid-cols-1">
            <div className="col-span-1">
              <SpecificationsTable>
                {specs?.slice(0, specificationsPerSide).map((spec, idx) => (
                  <SpecRow
                    key={spec.id}
                    specName={spec.spec_name}
                    specValue={spec.spec_value}
                    bgColor={idx % 2 === 0 ? '#EFF3FD' : '#FFF'}
                  />
                ))}
              </SpecificationsTable>
            </div>
            <div className="col-span-1">
              <SpecificationsTable>
                {specs?.slice(specificationsPerSide).map((spec, idx) => (
                  <SpecRow
                    key={spec.id}
                    specName={spec.spec_name}
                    specValue={spec.spec_value}
                    bgColor={idx % 2 === 0 ? '#EFF3FD' : '#FFF'}
                  />
                ))}
              </SpecificationsTable>
            </div>
          </div>
        </section>
      </section>

      {isCollapsibleActive && (
        <button
          onClick={() => setIsCollapsible((prev) => !prev)}
          className={cn(
            'absolute right-0 left-0 flex h-[120px] w-full cursor-pointer items-center justify-center',
            isCollapsible ? 'bottom-[-92px]' : 'bottom-[-63px] bg-white-blur',
          )}>
          <span className="max-w-[300px] overflow-hidden text-nowrap rounded-[4px] border border-[#3866df] bg-white p-[6px_30px] font-bold text-[#3866df] text-[16px]">
            {isCollapsible ? 'Show Less' : 'View Full Overview'}
          </span>
        </button>
      )}
    </section>
  )
}
