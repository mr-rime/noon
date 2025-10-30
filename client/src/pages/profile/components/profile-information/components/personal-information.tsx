import { useFormContext } from 'react-hook-form';
import { Pencil } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

export function PersonalInformation({ loading, editable = true }: { loading: boolean; editable?: boolean }) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <section className="mt-7 rounded-[20px] bg-white p-[32px]">
      <h2 className="font-bold text-[18px]">Personal Information</h2>
      <div className="mt-5 flex flex-wrap items-center space-x-6">
        {loading ? (
          <Skeleton className="mt-8 h-[58px] w-[300px] rounded-[12px] p-[8px_12px]" />
        ) : (
          <div className="flex flex-col min-w-[300px]">
            <Input
              id="first_name"
              {...register('first_name')}
              labelContent="First name"
              icon={<Pencil size={14} color="#7E859B" />}
              iconDirection="right"
              disabled={!editable}
              placeholder="First Name"
              input={{ className: 'bg-white rounded-[12px] w-[300px] h-[58px] p-[8px_12px] indent-0 focus:border-[#00f]' }}
            />
            {errors.first_name && <span className="text-xs text-red-500 mt-1">{String(errors.first_name.message)}</span>}
          </div>
        )}
        {loading ? (
          <Skeleton className="mt-8 h-[58px] w-[300px] rounded-[12px] p-[8px_12px]" />
        ) : (
          <div className="flex flex-col min-w-[300px]">
            <Input
              id="last_name"
              {...register('last_name')}
              labelContent="Last name"
              icon={<Pencil size={14} color="#7E859B" />}
              iconDirection="right"
              disabled={!editable}
              placeholder="Last Name"
              input={{ className: 'bg-white rounded-[12px] w-[300px] h-[58px] p-[8px_12px] indent-0 focus:border-[#00f]' }}
            />
            {errors.last_name && <span className="text-xs text-red-500 mt-1">{String(errors.last_name.message)}</span>}
          </div>
        )}
      </div>
    </section>
  );
}
