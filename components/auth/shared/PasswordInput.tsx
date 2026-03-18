/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

interface PasswordInputProps {
  label: string;
  id: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
  className?: string;
}

/**
 * Reusable password input component with visibility toggle
 */
const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  id,
  placeholder,
  register,
  error,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="w-full flex flex-col">
      <label
        htmlFor={id}
        className="font-poppins text-[14px] text-[#58556A] leading-[24px]"
      >
        {label}
      </label>
      <div className="relative w-full h-[44px]">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          placeholder={placeholder}
          className={`w-full rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow h-full font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-[#8E8C9C] pl-4 pr-14 outline-none transition duration-300 focus:border-accent ${
            error ? 'border-red-500' : 'border-[#E5E7EB]'
          } ${className}`}
          {...register}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#58556A]"
        >
          {showPassword ? (
            <FaRegEyeSlash className="w-5 h-5" />
          ) : (
            <FaRegEye className="w-5 h-5" />
          )}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-[12px] font-poppins mt-1">{error}</p>
      )}
    </div>
  );
};

export default PasswordInput;
