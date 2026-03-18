/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormInputProps {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
  className?: string;
}

/**
 * Reusable form input component with label and error display
 */
const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  type = 'text',
  placeholder,
  register,
  error,
  className = '',
}) => {
  return (
    <div className="w-full flex flex-col">
      <label
        htmlFor={id}
        className="font-poppins text-[14px] text-[#58556A] leading-[24px]"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`w-full rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow h-[44px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-[#8E8C9C] px-4 outline-none transition duration-300 focus:border-accent ${
          error ? 'border-red-500' : 'border-[#E5E7EB]'
        } ${className}`}
        {...register}
      />
      {error && (
        <p className="text-red-500 text-[12px] font-poppins mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
