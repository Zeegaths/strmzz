/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RxCaretLeft } from 'react-icons/rx';
import { TbLockPassword } from 'react-icons/tb';
import { resetPasswordSchema, ResetPasswordInput } from '@/types/auth';
import FormInput from '@/components/auth/shared/FormInput';
import SubmitButton from '@/components/auth/shared/SubmitButton';

/**
 * Renders a form for resetting the user's password.
 */
const ResetPasswordForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      console.log('Reset password email:', data.email);

      // TODO: Replace with actual API call
      // await sendPasswordResetEmail(data.email);

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay

      reset();
      router.push('/auth/user/confirm-password-reset');
    } catch (error) {
      console.error('Failed to send reset email:', error);
    }
  };

  return (
    <div className="shadow-authCardShadow md:w-[380px] w-full rounded-[16px] bg-white border border-[#E5E7EB] flex flex-col gap-4 items-center py-8 px-6 relative">
      <div className="w-[56px] h-[56px] flex justify-center items-center bg-white border-[0.7px] border-[#E5E7EB] rounded-full shadow-verifyMShadow text-accent">
        <TbLockPassword className="w-5 h-5" />
      </div>

      <div className="w-full flex flex-col gap-3">
        <h4 className="font-poppins font-[600] text-base text-primary text-center">
          Reset Password
        </h4>
        <p className="font-poppins font-[400] text-[14px] leading-[24px] text-[#58556A] text-center px-3">
          No worries! Enter your email to reset your password and regain access.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3 mt-6">
        <FormInput
          label="Email"
          id="email"
          type="email"
          placeholder="Adams@example.com"
          register={register('email')}
          error={errors.email?.message}
        />

        <SubmitButton
          isSubmitting={isSubmitting}
          disabled={!isDirty || !isValid}
          text="Reset password"
          loadingText="Resetting..."
          className="mt-3"
        />
      </form>

      {/* go back btn */}
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute top-5 left-5 text-primary font-bold"
      >
        <RxCaretLeft className="w-8 h-8" />
      </button>
    </div>
  );
};

export default ResetPasswordForm;
