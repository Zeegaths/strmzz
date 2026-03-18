import Image from 'next/image'
import React from 'react'
import elementPix from "@/public/elements/payforsub.png"

/**
 * PayForSubs is a component that renders a section highlighting the ability to pay for subscriptions with crypto.
 * It displays an image and some text describing the benefits of using Strimz to pay for subscriptions.
 * The component is styled with responsive design considerations, ensuring compatibility across various screen sizes.
 */
const PayForSubs = () => {
    return (
        <div className="w-full bg-[#F9FAFB] border-[1px] border-[#E5E7EB] rounded-[16px] grid md:grid-cols-2 gap-6 md:gap-0 lg:px-20 lg:py-0 px-6 py-10">
            {/* image */}
            <Image src={elementPix} alt='image' className='max-w-[599px] order-2 md:order-1  w-full' width={2396} height={2148} quality={100} priority />

            {/* text */}
            <div className="w-full flex flex-col justify-center lg:pl-24 order-1 md:order-2 ">
                <h3 className="md:text-[32px] font-[700] text-[24px] leading-[40px] font-sora text-primary mb-3">Pay for subscriptions with crypto</h3>
                <p className='font-[400] text-base leading-[28px] text-[#58556A] font-poppins'>Use crypto to pay for your favorite services like Netflix, Spotify, and other streaming platforms. No need for a bank card—just set up your payments and let Strimz handle the rest.</p>
            </div>

        </div>
    )
}

export default PayForSubs