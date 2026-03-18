'use client';
import { useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { IoCopyOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import baseIcon from '@/public/networks/base.webp';
import Image from 'next/image';

/**
 * User-specific header content showing username and wallet address.
 */
const UserHeaderContent = () => {
  const { user, authenticated } = usePrivy();

  // Get user data from Privy or localStorage fallback
  const userData = useMemo(() => {
    if (authenticated && user) {
      const walletAddress = user.wallet?.address || '';
      const storedData = localStorage.getItem('strimzUser');
      const parsed = storedData ? JSON.parse(storedData) : {};
      
      return {
        username: parsed.username || user.email?.address?.split('@')[0] || 'User',
        address: walletAddress,
      };
    }
    
    // Fallback to localStorage
    const data = localStorage.getItem('strimzUser');
    return data ? JSON.parse(data) : { username: 'User', address: '' };
  }, [user, authenticated]);

  const shortenAddress = useMemo(() => {
    return userData?.address
      ? `${userData.address.slice(0, 8)}...${userData.address.slice(-6)}`
      : '';
  }, [userData?.address]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(userData?.address || '');
      toast.success('Wallet address copied to clipboard', {
        position: 'top-right',
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to copy wallet address', {
        position: 'top-right',
      });
    }
  };

  return (
    <>
      <h4 className="text-primary capitalize font-sora font-[500] text-base">
        Welcome Back, {userData?.username}
      </h4>
      {userData?.address && (
        <div className="flex gap-1 items-center">
          <Image
            src={baseIcon}
            alt="Base Icon"
            className="w-4 h-4"
            width={16}
            height={16}
            quality={100}
            priority
          />
          <p className="text-sm text-[#58556A] font-poppins font-[400]">
            {shortenAddress}
          </p>
          <button type="button" onClick={handleCopy} className="text-[#58556A] hover:text-accent transition-colors">
            <IoCopyOutline className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};

export default UserHeaderContent;