/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { businessSignupSchema, BusinessSignupInput } from '@/STRIMZ/types/auth';
import AuthFormContainer from '@/components/auth/shared/AuthFormContainer';
import FormInput from '@/components/auth/shared/FormInput';
import PasswordInput from '@/components/auth/shared/PasswordInput';
import SubmitButton from '@/components/auth/shared/SubmitButton';
import SocialAuthButton from '@/components/auth/shared/SocialAuthButton';

/**
 * Business signup form component
 */
const BusinessSignupForm = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid, isDirty },
        reset,
    } = useForm<BusinessSignupInput>({
        resolver: zodResolver(businessSignupSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: BusinessSignupInput) => {
        try {
            console.log('Business signup data:', data);

            // TODO: Replace with actual API call
            // await signupBusiness(data);

            toast.success('Sign up successful', {
                position: 'top-right',
            });

            // After signup, redirect to business info page
            router.push('/auth/business/verify-email');
        } catch (error: any) {
            console.error('Failed to sign up:', error);
            toast.error(error?.message || 'Sign up failed. Please try again.', {
                position: 'top-right',
            });
        } finally {
            reset();
        }
    };

    const handleGoogleSignup = () => {
        // TODO: Implement Google OAuth for business
        console.log('Business Google signup clicked');
    };

    return (
        <AuthFormContainer title="Welcome to Strimz">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3 mt-6">

                <FormInput
                    label="Business Email"
                    id="email"
                    type="email"
                    placeholder="business@example.com"
                    register={register('email')}
                    error={errors.email?.message}
                />

                <PasswordInput
                    label="Password"
                    id="password"
                    placeholder="Password"
                    register={register('password')}
                    error={errors.password?.message}
                />

                <SubmitButton
                    isSubmitting={isSubmitting}
                    disabled={!isDirty || !isValid}
                    text="Continue"
                    className="mt-3"
                />

                <div className="w-full h-[1px] bg-[#E5E7EB]" />

                <SocialAuthButton provider="google" onClick={handleGoogleSignup} />

                <div className="w-full flex flex-col items-center gap-4 mt-8">
                    <p className="font-poppins text-center font-[400] text-[14px] text-[#58556A] leading-[24px]">
                        Already have an account?{' '}
                        <Link
                            href="/auth/business/login"
                            className="font-poppins font-[600] text-[14px] text-accent hover:underline leading-[24px]"
                        >
                            Login
                        </Link>
                    </p>

                    <p className="md:w-[80%] w-[90%] text-center font-poppins font-[400] text-[12px] text-[#58556A]">
                        By continuing you agree to{' '}
                        <Link className="underline" href="/">
                            Strimz Terms of Service
                        </Link>{' '}
                        and <Link href="/" className="underline">Privacy Policy</Link>
                    </p>
                </div>
            </form>
        </AuthFormContainer>
    );
};

export default BusinessSignupForm;
