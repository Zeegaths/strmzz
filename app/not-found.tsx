'use client'
import Link from "next/link";
import { TbError404 } from "react-icons/tb";
import Image from "next/image";
import pattern from "@/public/patterns/strimzPatterns.png"
import { useRouter } from "next/navigation";

/**
 * The NotFound component is a Next.js page component that renders a 404 page
 * with a custom design. It provides a link to go back to the previous page and
 * a link to return to the home page.
 *
 * @returns A JSX element representing the NotFound page.
 */
export default function NotFound() {
    const router = useRouter()
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB] p-4">

            <TbError404 className="md:w-[300px] md:h-[300px] w-[200px] h-[200px] text-accent" />

            <h1 className="text-center text-primary font-sora font-[700] lg:text-[52px] lg:leading-[52px] text-[36px] leading-[36px] tracking-tight lg:-mt-6 mb-4">
                Oops! Lost in the Flow?
            </h1>

            <p className="text-lg text-[#58556A] font-[400] font-poppins mb-6 text-center max-w-[500px]">
                It seems the page you&apos;re looking for has gone off-chain. Let&apos;s get you back on track!
            </p>


            <div className="w-full flex justify-center items-center gap-4 md:gap-8">
                <Link href="/" className="w-[130px] h-[40px] flex justify-center items-center rounded-[8px] bg-accent text-[#FFFFFF] font-poppins font-[500] shadow-joinWaitlistBtnShadow z-10 text-shadow text-[12px] hover:bg-primary">Return Home</Link>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className={`w-[130px] h-[40px] flex justify-center items-center bg-[#F9FAFB] rounded-[8px] border border-[#E5E7EB] shadow-[0px_-2px_4px_0px_#00000014_inset] z-10 cursor-pointer text-[12px] font-[500] font-poppins text-primary hover:bg-primary hover:text-[#F9FAFB]`}
                >
                    Go Back
                </button>
            </div>



            {/* Decorative SVG */}
            <div className="absolute -z-10 opacity-20 inset-x-0 bottom-0 pointer-events-none">
                <Image src={pattern} className="w-[1527px] h-[191px] object-cover" alt="LogoPattern" width={5760} height={764} quality={100} priority />
            </div>
            <div className="absolute -z-10 opacity-20 top-0 inset-x-0 pointer-events-none">
                <Image src={pattern} className="w-[1527px] h-[191px] object-cover" alt="LogoPattern" width={5760} height={764} quality={100} priority />
            </div>
        </div>
    );
}
