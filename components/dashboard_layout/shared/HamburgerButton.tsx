import React from 'react';

interface HamburgerButtonProps {
  sidebarOpen: boolean;
  onClick: (e: React.MouseEvent) => void;
}

/**
 * Shared animated hamburger menu button for mobile sidebar toggle.
 */
const HamburgerButton: React.FC<HamburgerButtonProps> = ({ sidebarOpen, onClick }) => {
  return (
    <button
      aria-controls="sidebar"
      onClick={onClick}
      className="z-[9999] block rounded-sm border border-[#E5E7EB] bg-[#F9FAFB] p-1.5 shadow-sm lg:hidden"
    >
      <span className="relative block h-5 w-5 cursor-pointer">
        <span className="block absolute right-0 h-full w-full">
          <span
            className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-primary delay-[0] duration-200 ease-in-out ${
              !sidebarOpen && '!w-full delay-300'
            }`}
          ></span>
          <span
            className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-primary delay-150 duration-200 ease-in-out ${
              !sidebarOpen && 'delay-400 !w-full'
            }`}
          ></span>
          <span
            className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-primary delay-200 duration-200 ease-in-out ${
              !sidebarOpen && '!w-full delay-500'
            }`}
          ></span>
        </span>
        <span className="absolute right-0 h-full w-full rotate-45">
          <span
            className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-primary delay-300 duration-200 ease-in-out ${
              !sidebarOpen && '!h-0 !delay-[0]'
            }`}
          ></span>
          <span
            className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-primary duration-200 ease-in-out ${
              !sidebarOpen && '!h-0 !delay-200'
            }`}
          ></span>
        </span>
      </span>
    </button>
  );
};

export default HamburgerButton;
