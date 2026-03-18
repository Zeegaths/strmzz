import Logo from "@/components/shared/Logo";
import StrimzLogo from "@/public/logo/whiteLogo.png"
import authPattern from "@/public/patterns/authPattern.png"
import authPattern2 from "@/public/patterns/authPattern2.png"
import Image from "next/image";
/**
 * The AuthLayout component renders a basic layout for authentication pages.
 * It is a functional component that accepts a single prop, "children", which
 * is a React node that contains the content to be rendered within the layout.
 *
 * The component wraps the content in a section element with a class of "w-full".
 * This results in the content being displayed in a full-width container.
 *
 * @param {{ children: React.ReactNode }} props The props for the component.
 * @prop {React.ReactNode} children The content to be rendered within the layout.
 * @returns {JSX.Element} The rendered component.
 */
export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <main className="w-full min-h-screen grid md:grid-cols-8 px-5 md:px-0">
            <section className="md:col-span-3 hidden md:flex flex-col bg-[#050020] overflow-hidden relative lg:pt-12 pt-8 lg:px-12 px-6 gap-16">
                <Logo href='/' className='w-[101px]' image={StrimzLogo} />
                <div className="lg:w-[337px] flex flex-col gap-2 lg:gap-4">
                    <h3 className="text-[40px] lg:text-[52px] leading-[48px] font-[700] font-sora text-white">Streamline payments anytime ⚡</h3>
                    <p className="text-base lg:text-lg font-[400] font-poppins text-[#8E8C9C]">Log in to manage your payments/subscriptions with ease.</p>
                </div>
                <div className="absolute lg:left-0 -left-12 lg:bottom-0 -bottom-12 flex">
                    <Image src={authPattern} className="w-[348.05px] h-[295.76px]" alt="pattern" width={1258} height={740} priority quality={100} />
                    <Image src={authPattern2} className="w-[348.05px] -ml-20 h-[295.76px]" alt="pattern" width={1107} height={740} priority quality={100} />
                </div>
            </section>
            {children}
        </main>
    );
}