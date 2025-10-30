import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useFormContext } from 'react-hook-form';

export function ContactInformation({ loading, editable = true }: { loading: boolean; editable?: boolean }) {
  const { register, formState: { errors } } = useFormContext();
  return (
    <section className="rounded-[20px] bg-white p-[32px]">
      <h2 className="font-bold text-[18px]">Contact Information</h2>
      <div className="mt-5 flex items-center space-x-6">
        {loading ? (
          <Skeleton className=" mt-8 h-[58px] w-[300px] rounded-[12px] p-[8px_12px]" />
        ) : (
          <div className="flex flex-col min-w-[300px]">
            <Input
              id="email"
              {...register('email')}
              labelContent="Email"
              placeholder="Email"
              disabled={!editable}
              input={{
                className: 'bg-white rounded-[12px] w-[300px] h-[58px] p-[8px_12px] font-bold indent-0',
              }}
            />
            {errors.email && <span className="text-xs text-red-500 mt-1">{String(errors.email.message)}</span>}
          </div>
        )}
      </div>
    </section>
  );
}
