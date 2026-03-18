import React from 'react';
import Logo from '@/components/shared/Logo';
import StrimzLogo from '@/public/logo/blueLogo.png';

interface AuthFormContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable container for auth forms with logo and title
 */
const AuthFormContainer: React.FC<AuthFormContainerProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <>
      <header className="w-full fixed top-0 inset-x-0 md:hidden flex justify-center items-center pt-4">
        <Logo href="/" className="md:w-[114.28px] w-[101px]" image={StrimzLogo} />
      </header>

      <div
        className={`shadow-authCardShadow md:w-[380px] w-full rounded-[16px] bg-white border border-[#E5E7EB] flex flex-col items-center py-8 px-6 ${className}`}
      >
        <h4 className="font-[600] font-sora text-primary text-center text-lg">
          {title}
        </h4>
        {children}
      </div>
    </>
  );
};

export default AuthFormContainer;
