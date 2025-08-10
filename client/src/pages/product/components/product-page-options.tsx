import { Image } from '@unpic/react'

export function ProductOption({
  name,
  values,
}: {
  name: string
  values: { value: string; image_url: string | null }[]
}) {
  return (
    <div>
      <div className="mb-2 font-normal text-[14px] uppercase">
        <span className="text-[#667085]">{name}:</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {values.map(({ value, image_url }, i) =>
          image_url ? (
            <div
              key={i}
              className="flex h-[70px] w-[70px] cursor-pointer items-center justify-center rounded-[10px] border border-[#EAECF0]">
              <Image
                src={image_url}
                alt={value}
                className="select-none"
                draggable={false}
                width={70}
                height={70}
                layout="constrained"
              />
            </div>
          ) : (
            <div
              key={i}
              className="flex cursor-pointer items-center justify-center rounded-[10px] border border-[#EAECF0] p-2 px-[16px] py-[8px]">
              {value}
            </div>
          ),
        )}
      </div>
    </div>
  )
}
