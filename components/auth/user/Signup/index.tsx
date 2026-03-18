/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { toast } from 'sonner';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AuthFormContainer from '@/components/auth/shared/AuthFormContainer';
import FormInput from '@/components/auth/shared/FormInput';
import SubmitButton from '@/components/auth/shared/SubmitButton';
import { Wallet } from 'lucide-react';

const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
});

type SignupInput = z.infer<typeof signupSchema>;

/**
 * User signup form component with wallet connection
 */
const SignupForm = () => {
  const router = useRouter();
  const { ready, authenticated, user, login } = usePrivy();
  const [walletConnected, setWalletConnected] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (ready && authenticated && user) {
      setWalletConnected(true);
    }
  }, [ready, authenticated, user]);

  const handleConnectWallet = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet. Please try again.', {
        position: 'top-right',
      });
    }
  };

  const onSubmit = async (data: SignupInput) => {
    if (!user || !walletConnected) {
      toast.error('Please connect your wallet first', {
        position: 'top-right',
      });
      return;
    }

    try {
      const walletAddress = user.wallet?.address || '';
      
      // TODO: Save username to your backend
      // await saveUsername(data.username, walletAddress);

      // Save to localStorage
      localStorage.setItem(
        'strimzUser',
        JSON.stringify({
          username: data.username,
          address: walletAddress,
          email: user.email?.address,
          userId: user.id,
        })
      );

      toast.success('Account created successfully!', {
        position: 'top-right',
      });

      router.push('/user');
    } catch (error: any) {
      console.error('Failed to create account:', error);
      toast.error(error?.message || 'Signup failed. Please try again.', {
        position: 'top-right',
      });
    }
  };

  return (
    <AuthFormContainer title="Create Your Account">
      <div className="w-full flex flex-col gap-4 mt-6">
        {!walletConnected ? (
          <>
            <p className="text-center text-sm text-[#58556A] font-poppins">
              First, connect your wallet or create a new one
            </p>

            <button
              onClick={handleConnectWallet}
              disabled={!ready}
              className="w-full h-[56px] rounded-[12px] bg-accent hover:bg-accent/90 disabled:bg-accent/50 transition-colors flex items-center justify-center gap-3 text-white font-sora font-[600] text-base"
            >
              <Wallet className="w-5 h-5" />
              {!ready ? 'Loading...' : 'Connect Wallet'}
            </button>

            <div className="bg-[#F0FFF8] border border-accent/20 rounded-lg p-4">
              <p className="text-xs text-[#58556A] font-poppins">
                <span className="font-semibold">Don&apos;t have a wallet?</span> No problem! 
                We&apos;ll create a secure embedded wallet for you automatically.
              </p>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-xs text-green-700 font-poppins">
                Wallet connected: {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
              </p>
            </div>

            <FormInput
              label="Choose a Username"
              id="username"
              type="text"
              placeholder="johndoe"
              register={register('username')}
              error={errors.username?.message}
            />

            <SubmitButton
              isSubmitting={false}
              disabled={!isDirty || !isValid}
              text="Create Account"
            />
          </form>
        )}

        <div className="w-full h-[1px] bg-[#E5E7EB]" />

        <div className="w-full flex flex-col items-center gap-4 mt-4">
          <p className="font-poppins text-center font-[400] text-[14px] text-[#58556A] leading-[24px]">
            Already have an account?{' '}
            <Link
              href="/auth/user/login"
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
      </div>
    </AuthFormContainer>
  );
};

export default SignupForm;