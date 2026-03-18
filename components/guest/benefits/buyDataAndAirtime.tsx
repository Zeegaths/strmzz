import React from 'react'
import elementPix from "@/public/elements/buydataairtime.png"
import Image from 'next/image'
import network1 from "@/public/elements/1.png"
import network2 from "@/public/elements/2.png"
import network3 from "@/public/elements/3.png"
import network4 from "@/public/elements/4.png"

/**
 * BuyDataAndAirtime is a component that renders a section highlighting the ability to buy data and airtime using crypto.
 * It displays an image and some text describing the benefits of using Strimz to top up mobile data or airtime.
 * The component is styled with responsive design considerations, ensuring compatibility across various screen sizes.
 */
const BuyDataAndAirtime = () => {
    const networks = [network1, network2, network3, network4];
    return (
        <div className="w-full bg-[#F9FAFB] border-[1px] border-[#E5E7EB] rounded-[16px] grid md:grid-cols-2 gap-6 md:gap-0 lg:px-20 lg:py-20 px-6 py-10">
            {/* text */}
            <div className="w-full max-w-[365px] font-[700] flex flex-col justify-center">
                <div className='flex justify-start items-center gap-1 mb-1'>
                    {
                        networks.map((network, index) => (
                            <Image key={index} src={network} alt='image' className='w-[70px] h-[70px] drop-shadow-brandShadow' width={144} height={144} quality={100} priority />
                        ))
                    }
                </div>
                <h3 className="md:text-[32px] text-[24px] leading-[40px] font-sora text-primary mb-3">Buy data and airtime instantly</h3>
                <p className='font-[400] text-base leading-[28px] text-[#58556A] font-poppins'>Top up your mobile data or airtime using crypto, anytime. Whether for yourself or someone else, Strimz makes it fast, easy, and borderless.</p>
            </div>
            {/* image */}
            <Image src={elementPix} alt='image' className='max-w-[599px] w-full' width={2396} height={1593} quality={100} priority />
        </div>
    )
}

export default BuyDataAndAirtime