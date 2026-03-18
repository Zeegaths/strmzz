import Image from 'next/image'
import React from 'react'
import elementPix from "@/public/elements/payforutils.png"

/**
 * PayForUtils is a component that renders a section highlighting the ability to pay for utilities (e.g. rent, electricity, water, internet) with crypto.
 * It displays an image and some text describing the benefits of using Strimz to pay for utilities.
 * The component is styled with responsive design considerations, ensuring compatibility across various screen sizes.
 */
const PayForUtils = () => {
    return (
        <div className="w-full bg-[#F9FAFB] border-[1px] border-[#E5E7EB] rounded-[16px] grid md:grid-cols-2 lg:grid-cols-7 gap-6 md:gap-0 lg:pr-14 lg:pl-8 lg:py-10 px-6 py-10">
            {/* image */}
            <Image src={elementPix} alt='image' className='lg:col-span-4 max-w-[585px] order-2 md:order-1 w-full' width={2388} height={1788} quality={100} priority />

            {/* text */}
            <div className="lg:col-span-3 w-full max-w-[365px] font-[700] flex flex-col justify-center order-1 md:order-2">
                <h3 className="md:text-[32px] text-[24px] leading-[40px] font-sora text-primary mb-3">Pay for utilities without hassle</h3>
                <p className='font-[400] text-base leading-[28px] text-[#58556A] font-poppins'>Set up recurring payments for rent, electricity, water, and internet bills using crypto. No need to track due dates—Strimz ensures payments are made on time.</p>
            </div>

        </div>
    )
}

export default PayForUtils