import React from 'react';
import Image from 'next/image';
import GoogleIcon from '@/public/brands/Google.svg';

interface SocialAuthButtonProps {
  provider: 'google';
  onClick?: () => void;
  className?: string;
}

/**
 * Reusable social authentication button
 */
const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({
  provider,
  onClick,
  className = '',
}) => {
  const providerConfig = {
    google: {
      icon: GoogleIcon,
      text: 'Continue with Google',
    },
  };

  const config = providerConfig[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full h-[40px] flex justify-center gap-1.5 items-center rounded-[8px] bg-[#F9FAFB] text-[#58556A] font-poppins font-[500] shadow-[0px_-2px_4px_0px_#00000014_inset] border border-[#E5E7EB] text-[12px] ${className}`}
    >
      <Image
        src={config.icon}
        width={18}
        height={18}
        alt={`${provider} icon`}
        className="w-[18px] h-[18px]"
        priority
        quality={100}
      />
      <span>{config.text}</span>
    </button>
  );
};

export default SocialAuthButton;
