import Link from 'next/link';
import { CgFileDocument } from 'react-icons/cg';
import { IoMdHelpCircleOutline } from 'react-icons/io';

/**
 * Business sidebar footer with support contact and help links.
 */
const BusinessSidebarFooter = () => {
  return (
    <div className="w-full flex flex-col pb-8 gap-2">
      <div className="w-full flex items-center gap-2 rounded-[12px] bg-white px-4 py-2">
        <p className="text-accent font-[500] font-sora text-base bg-[#E7FEF3] rounded-full w-8 h-8 flex items-center justify-center">
          S
        </p>
        <div className="flex flex-col">
          <h3 className="text-[#58556A] text-sm font-poppins font-[500]">Strimz</h3>
          <Link
            href="mailto:help@strimz.com"
            className="text-[#6B7280] text-xs"
          >
            Help@strimz.com
          </Link>
        </div>
      </div>
      <Link
        href="/business"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm font-[400] p-[12px] rounded-[8px] font-poppins text-[#58556A] transition-all hover:bg-[#FFFFFF] border hover:border-[#E5E7EB] hover:shadow-sidebarLinkShadow hover:text-primary"
      >
        <CgFileDocument className="w-[21px] h-[21px]" />
        Documentation
      </Link>
      <Link
        href="/business"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm font-[400] p-[12px] rounded-[8px] font-poppins text-[#58556A] transition-all hover:bg-[#FFFFFF] border hover:border-[#E5E7EB] hover:shadow-sidebarLinkShadow hover:text-primary"
      >
        <IoMdHelpCircleOutline className="w-[21px] h-[21px]" />
        Help
      </Link>
    </div>
  );
};

export default BusinessSidebarFooter;
