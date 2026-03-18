'use client'
import strimzBlueLogoIcon from "@/public/logoIcons/strimzBlueLogoPNG.svg"
import Image from "next/image"
import Marquee from "react-fast-marquee"

/**
 * A horizontally scrolling marquee of strimz logos.
 *
 * Renders a `<Marquee>` component with a CSS class of `w-full h-[60px] bg-[#F9FAFB]`.
 * The marquee contains a component `<Content>`, which is rendered 12 times.
 *
 * The component is designed to be used as a header element, and is intended to be
 * visually appealing and attention-grabbing.
 *
 * @returns {JSX.Element} A horizontally scrolling marquee of strimz logos.
 */
const MovingText = () => {
    return (
        <Marquee className="w-full h-[60px] bg-[#F9FAFB]">
            <Content />
            <Content />
            <Content />
            <Content />
            <Content />
            <Content />
            <Content />
            <Content />
            <Content />
            <Content />
            <Content />
        </Marquee>
    )
}

export default MovingText


export const Content = () => {
    return (
        <div className="w-full flex items-center mr-4 gap-4">
            <Image src={strimzBlueLogoIcon} className="md:w-[18.97px] md:h-[20.28px] w-[16.97px] h-[18.28px]" alt="Strimz logo" width={19} height={22} quality={100} priority />
            <p className="font-poppins px-2.5 font-[400] text-primary md:text-base text-sm"> Streamline payments anytime</p>
        </div >
    )
}