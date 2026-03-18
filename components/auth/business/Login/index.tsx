/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { loginSchema, LoginInput } from '@/STRIMZ/types/auth';
import AuthFormContainer from '@/components/auth/shared/AuthFormContainer';
import FormInput from '@/components/auth/shared/FormInput';
import PasswordInput from '@/components/auth/shared/PasswordInput';
import SubmitButton from '@/components/auth/shared/SubmitButton';
import SocialAuthButton from '@/components/auth/shared/SocialAuthButton';

/**
 * Business login form component
 */
const BusinessLoginForm = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid, isDirty },
        reset,
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            console.log('Business login data:', data);

            // TODO: Replace with actual API call
            // await loginBusiness(data);

            toast.success('Login successful', {
                position: 'top-right',
            });

            router.push('/business');
        } catch (error: any) {
            console.error('Failed to login:', error);
            toast.error(error?.message || 'Login failed. Please try again.', {
                position: 'top-right',
            });
        } finally {
            reset();
        }
    };

    const handleGoogleLogin = () => {
        // TODO: Implement Google OAuth for business
        console.log('Business Google login clicked');
    };

    return (
        <AuthFormContainer title="Welcome Back" >
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

                <div className="w-full flex justify-end">
                    <Link
                        href="/auth/business/reset-password"
                        className="font-poppins text-[14px] text-[#58556A] hover:underline leading-[24px]"
                    >
                        Forgot Password?
                    </Link>
                </div>

                <SubmitButton
                    isSubmitting={isSubmitting}
                    disabled={!isDirty || !isValid}
                    text="Login"
                />

                <div className="w-full h-[1px] bg-[#E5E7EB]" />

                <SocialAuthButton provider="google" onClick={handleGoogleLogin} />

                <div className="w-full flex flex-col items-center gap-4 mt-8">
                    <p className="font-poppins text-center font-[400] text-[14px] text-[#58556A] leading-[24px]">
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/auth/business/signup"
                            className="font-poppins font-[600] text-[14px] text-accent hover:underline leading-[24px]"
                        >
                            Sign Up
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

export default BusinessLoginForm;
