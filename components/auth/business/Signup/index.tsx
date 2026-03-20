/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { userSignupSchema, UserSignupInput } from '@/types/auth';
import { signUp } from '@/lib/auth';
import AuthFormContainer from '@/components/auth/shared/AuthFormContainer';
import FormInput from '@/components/auth/shared/FormInput';
import PasswordInput from '@/components/auth/shared/PasswordInput';
import SubmitButton from '@/components/auth/shared/SubmitButton';
import SocialAuthButton from '@/components/auth/shared/SocialAuthButton';

const BusinessSignupForm = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid, isDirty },
    } = useForm<UserSignupInput>({
        resolver: zodResolver(userSignupSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: UserSignupInput) => {
        try {
            const res = await signUp({
                username: data.username,
                email: data.email,
                password: data.password,
            });

            if (!res.success) {
                const errorMsg = typeof res.message === 'string'
                    ? res.message
                    : res.error || 'Signup failed. Please try again.';
                toast.error(errorMsg, { position: 'top-right' });
                return;
            }

            toast.success('Account created! Check your email for the verification code.', {
                position: 'top-right',
            });

            // Store email for the verify page
            sessionStorage.setItem('strimz_verify_email', data.email);
            router.push('/auth/business/verify-email');
        } catch (error: any) {
            console.error('Failed to sign up:', error);
            toast.error('Something went wrong. Please try again.', {
                position: 'top-right',
            });
        }
    };

    const handleGoogleSignup = () => {
        toast.info('Google signup coming soon!', { position: 'top-right' });
    };

    return (
        <AuthFormContainer title="Create Business Account">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3 mt-6">
                <FormInput
                    label="Business Name"
                    id="username"
                    type="text"
                    placeholder="Your business name"
                    register={register('username')}
                    error={errors.username?.message}
                />

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
                    placeholder="Create a strong password"
                    register={register('password')}
                    error={errors.password?.message}
                />

                <SubmitButton
                    isSubmitting={isSubmitting}
                    disabled={!isDirty || !isValid}
                    text="Create Account"
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