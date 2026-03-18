import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface SubmitButtonProps {
  isSubmitting: boolean;
  disabled?: boolean;
  text: string;
  loadingText?: string;
  className?: string;
}

/**
 * Reusable submit button with loading state
 */
const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  disabled = false,
  text,
  loadingText = 'Submitting...',
  className = '',
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || isSubmitting}
      className={`w-full h-[40px] flex justify-center items-center rounded-[8px] bg-accent text-[#FFFFFF] font-poppins font-[600] shadow-joinWaitlistBtnShadow text-shadow text-[14px] disabled:opacity-80 disabled:cursor-not-allowed ${className}`}
    >
      {isSubmitting ? (
        <span className="flex items-center text-[#FFFFFF] gap-1">
          <AiOutlineLoading3Quarters className="animate-spin text-[#FFFFFF]" />
          {loadingText}
        </span>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
};

export default SubmitButton;
