/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { verifyEmailSchema, VerifyEmailInput } from '@/types/auth';
import { verifyOtp, resendVerification } from '@/lib/auth';
import { apiGet } from '@/lib/api';
import AuthFormContainer from '@/components/auth/shared/AuthFormContainer';
import SubmitButton from '@/components/auth/shared/SubmitButton';

const BusinessVerifyForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const verifyingRef = useRef(false);

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('strimz_verify_email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid, isDirty },
    } = useForm<VerifyEmailInput>({
        resolver: zodResolver(verifyEmailSchema),
        mode: 'onChange',
    });

    const redirectAfterVerify = async () => {
        sessionStorage.removeItem('strimz_verify_email');
        // Check if merchant already registered
        try {
            const res = await apiGet('/merchants/me');
            if (res.success && (res.data || res.message)) {
                router.push('/business');
            } else {
                router.push('/auth/business/setup');
            }
        } catch {
            router.push('/auth/business/setup');
        }
    };

    const onSubmit = async (data: VerifyEmailInput) => {
        if (verifyingRef.current) return;
        verifyingRef.current = true;

        try {
            const res = await verifyOtp(data.otp);

            if (!res.success) {
                if (localStorage.getItem('strimz_token')) {
                    await redirectAfterVerify();
                    return;
                }
                const errorMsg = typeof res.message === 'string'
                    ? res.message
                    : 'Verification failed. Please check your code and try again.';
                toast.error(errorMsg, { position: 'top-right' });
                verifyingRef.current = false;
                return;
            }

            toast.success('Email verified! Setting up your account...', {
                position: 'top-right',
            });

            await redirectAfterVerify();
        } catch (error: any) {
            if (localStorage.getItem('strimz_token')) {
                await redirectAfterVerify();
                return;
            }
            console.error('Failed to verify:', error);
            toast.error('Something went wrong. Please try again.', {
                position: 'top-right',
            });
            verifyingRef.current = false;
        }
    };

    const handleResend = async () => {
        if (!email || resendCooldown > 0) return;

        try {
            const res = await resendVerification(email);

            if (res.success) {
                toast.success('Verification code sent! Check your email.', {
                    position: 'top-right',
                });
                setResendCooldown(60);
            } else {
                toast.error(res.message || 'Failed to resend code.', {
                    position: 'top-right',
                });
            }
        } catch (error) {
            toast.error('Failed to resend code.', { position: 'top-right' });
        }
    };

    return (
        <AuthFormContainer title="Verify Your Email">
            <div className="w-full flex flex-col items-center gap-2 mt-4">
                <p className="font-poppins text-center text-[14px] text-[#58556A] leading-[24px]">
                    We sent a verification code to
                </p>
                {email && (
                    <p className="font-poppins text-center font-[600] text-[14px] text-[#1A1A2E] leading-[24px]">
                        {email}
                    </p>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 mt-6">
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="otp"
                        className="font-poppins text-[14px] font-[500] text-[#1A1A2E] leading-[24px]"
                    >
                        Verification Code
                    </label>
                    <input
                        id="otp"
                        type="text"
                        maxLength={4}
                        placeholder="Enter 4-character code"
                        className="w-full h-[48px] px-4 rounded-[8px] border border-[#E5E7EB] bg-white font-poppins text-[16px] text-center tracking-[8px] placeholder:tracking-normal placeholder:text-center focus:outline-none focus:border-accent transition-colors"
                        {...register('otp')}
                    />
                    {errors.otp && (
                        <p className="font-poppins text-[12px] text-red-500 mt-1">
                            {errors.otp.message}
                        </p>
                    )}
                </div>

                <SubmitButton
                    isSubmitting={isSubmitting}
                    disabled={!isDirty || !isValid}
                    text="Verify"
                />

                <div className="w-full flex justify-center mt-4">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendCooldown > 0}
                        className="font-poppins text-[14px] text-accent hover:underline disabled:text-[#9CA3AF] disabled:no-underline transition-colors"
                    >
                        {resendCooldown > 0
                            ? `Resend code in ${resendCooldown}s`
                            : "Didn't receive a code? Resend"}
                    </button>
                </div>
            </form>
        </AuthFormContainer>
    );
};

export default BusinessVerifyForm;