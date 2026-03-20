/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TbLockPassword } from 'react-icons/tb';
import { setNewPasswordSchema, SetNewPasswordInput } from '@/types/auth';
import PasswordInput from '@/components/auth/shared/PasswordInput';
import SubmitButton from '@/components/auth/shared/SubmitButton';

/**
 * Renders a form for setting a new password.
 */
const SetNewPasswordForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
  } = useForm<SetNewPasswordInput>({
    resolver: zodResolver(setNewPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SetNewPasswordInput) => {
    try {
      console.log('New password created', data);

      // TODO: Replace with actual API call
      // await setNewPassword(data.password);

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay

      reset();
      router.push('/auth/user/login');
    } catch (error) {
      console.error('Failed to create password:', error);
    }
  };

  return (
    <div className="shadow-authCardShadow md:w-[380px] w-full rounded-[16px] bg-white border border-[#E5E7EB] flex flex-col gap-4 items-center py-8 px-6 relative">
      <div className="w-[56px] h-[56px] flex justify-center items-center bg-white border-[0.7px] border-[#E5E7EB] rounded-full shadow-verifyMShadow text-accent">
        <TbLockPassword className="w-5 h-5" />
      </div>

      <div className="w-full flex flex-col gap-3">
        <h4 className="font-poppins font-[600] text-base text-primary text-center">
          Create a New Password
        </h4>
        <p className="font-poppins font-[400] text-[14px] leading-[24px] text-[#58556A] text-center px-3">
          Set a strong password to secure your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3 mt-4">
        <PasswordInput
          label="Password"
          id="password"
          placeholder="Password"
          register={register('password')}
          error={errors.password?.message}
        />

        <PasswordInput
          label="Confirm Password"
          id="confirmPassword"
          placeholder="Confirm Password"
          register={register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <SubmitButton
          isSubmitting={isSubmitting}
          disabled={!isDirty || !isValid}
          text="Create password"
          loadingText="Creating..."
          className="mt-3"
        />
      </form>
    </div>
  );
};

export default SetNewPasswordForm;
