import GuestFooter from "@/components/shared/Footer";
import NavBar from "@/components/shared/NavBar";
import ScrollToTopBtn from "@/components/shared/ScrollToTopBtn";

/**
 * GuestLayout is a functional component that serves as the layout for guest pages.
 * It includes a navigation bar, a main content area for children components,
 * a scroll-to-top button, and a footer.
 *
 * @param {React.ReactNode} children - The content to be displayed within the main section.
 * @returns {JSX.Element} A section element that wraps the guest page layout.
 */

export default function GuestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="w-full">
            <NavBar />
            <main className="w-full bg-white">
                {children}
            </main>
            <ScrollToTopBtn />
            <GuestFooter />
        </section>
    );
}