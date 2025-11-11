import { useQuery } from '@apollo/client'
import Cookies from 'js-cookie'
import { ContactInformation } from './components/contact-information'
import { PersonalInformation } from './components/personal-information'
import type { User } from '@/types'
import { GET_USER } from '@/graphql/user'
import { Button } from '@/components/ui/button'
import useUserHashStore from '@/store/user-hash/user-hash'
import { useMutation } from '@apollo/client'
import { UPDATE_USER } from '@/graphql/user'
import React from 'react'
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

const ProfileSchema = z.object({
  first_name: z.string().min(2, 'First name required'),
  last_name: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
});
type ProfileValues = z.infer<typeof ProfileSchema>;

export function ProfileInformation() {
  const hash = useUserHashStore((state) => state.hash);
  const { data, loading, refetch } = useQuery<{ getUser: { user: User } }>(GET_USER, {
    variables: { hash: Cookies.get('hash') || hash || '' },
  });
  const user = data?.getUser.user;

  const defaultValues: ProfileValues = {
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    email: user?.email ?? '',
  };

  const methods = useForm<ProfileValues>({
    resolver: zodResolver(ProfileSchema),
    mode: 'onChange',
    defaultValues,
    values: defaultValues,
    resetOptions: { keepDirtyValues: false, keepValues: false },
  });
  const { handleSubmit, formState, reset } = methods;
  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER);

  React.useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email ?? '',
      });
    }
    // eslint-disable-next-line
  }, [user?.first_name, user?.last_name, user?.email]);

  const onSubmit = async (form: ProfileValues) => {
    if (!user) return;
    try {
      const res = await updateUser({
        variables: {
          id: user.id,
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
        },
      });
      if (res.data?.updateUser?.success) {
        toast.success('Profile updated successfully!');
        await refetch();
        reset(form);
      } else {
        toast.error(res.data?.updateUser?.message || 'Failed to update profile');
      }
    } catch {
      toast.error('Network error. Try again.');
    }
  };

  return (
    <section className="h-screen w-full">
      <h1 className="font-bold text-[28px]">Profile</h1>
      <p className="text-[#7e859b] text-[1rem]">View & Update Your Personal and Contact Information</p>

      <FormProvider {...methods}>
        <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <ContactInformation loading={loading} editable />
          <PersonalInformation loading={loading} editable />
          <Button
            type="submit"
            disabled={updating || loading || !formState.isDirty || !formState.isValid}
            className={`mt-5 h-[48px] w-full max-w-[300px] rounded-[8px] px-[32px] text-white text-[14px] uppercase ${updating || loading || !formState.isDirty || !formState.isValid
              ? 'bg-[#7e859b] hover:bg-[#7e859b] cursor-not-allowed'
              : 'bg-[#3E72F7] hover:bg-[#3E72F7]'}`}
          >
            {updating ? 'Saving...' : 'Update Profile'}
          </Button>
        </form>
      </FormProvider>
    </section>
  );
}
