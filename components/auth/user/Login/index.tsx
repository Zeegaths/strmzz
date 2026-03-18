/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { toast } from 'sonner';
import Link from 'next/link';
import AuthFormContainer from '@/components/auth/shared/AuthFormContainer';
import SubmitButton from '@/components/auth/shared/SubmitButton';
import { Wallet } from 'lucide-react';

/**
 * User login form component with wallet connection
 */
const LoginForm = () => {
  const router = useRouter();
  const { ready, authenticated, user, login } = usePrivy();

  useEffect(() => {
    if (ready && authenticated && user) {
      // Save user data to localStorage
      const walletAddress = user.wallet?.address || '';
      const username = user.email?.address?.split('@')[0] || user.id.slice(0, 8);
      
      localStorage.setItem(
        'strimzUser',
        JSON.stringify({
          username,
          address: walletAddress,
          email: user.email?.address,
          userId: user.id,
        })
      );

      toast.success('Login successful', {
        position: 'top-right',
      });

      router.push('/user');
    }
  }, [ready, authenticated, user, router]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Failed to login:', error);
      toast.error(error?.message || 'Login failed. Please try again.', {
        position: 'top-right',
      });
    }
  };

  return (
    <AuthFormContainer title="Welcome back">
      <div className="w-full flex flex-col gap-4 mt-6">
        <p className="text-center text-sm text-[#58556A] font-poppins">
          Connect your wallet or create a new one to continue
        </p>

        <button
          onClick={handleLogin}
          disabled={!ready}
          className="w-full h-[56px] rounded-[12px] bg-accent hover:bg-accent/90 disabled:bg-accent/50 transition-colors flex items-center justify-center gap-3 text-white font-sora font-[600] text-base"
        >
          <Wallet className="w-5 h-5" />
          {!ready ? 'Loading...' : 'Connect Wallet'}
        </button>

        <div className="w-full h-[1px] bg-[#E5E7EB]" />

        <div className="bg-[#F0FFF8] border border-accent/20 rounded-lg p-4">
          <p className="text-xs text-[#58556A] font-poppins">
            <span className="font-semibold">Don&apos;t have a wallet?</span> No problem! 
            We&apos;ll create a secure embedded wallet for you automatically.
          </p>
        </div>

        <div className="w-full flex flex-col items-center gap-4 mt-4">
          <p className="font-poppins text-center font-[400] text-[14px] text-[#58556A] leading-[24px]">
            Need a business account?{' '}
            <Link
              href="/auth/business/login"
              className="font-poppins font-[600] text-[14px] text-accent hover:underline leading-[24px]"
            >
              Login as Business
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

export default LoginForm;