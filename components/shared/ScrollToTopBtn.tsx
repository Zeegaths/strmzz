'use client'
import { useEffect, useState } from "react";
import { MdDoubleArrow } from "react-icons/md";

/**
 * ScrollToTop renders a button that becomes visible when the user scrolls down more than 200px.
 * Upon clicking the button, the page scrolls smoothly back to the top.
 * The component uses a state variable to manage the button's visibility and 
 * an effect to attach a scroll event listener for toggling visibility.
 * @returns {JSX.Element} A button component for scrolling to the top.
 */

const ScrollToTopBtn: React.FC = (): JSX.Element => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const toggleVisibility = (): void => {
            if (window && window.scrollY > 200) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        if (window) {
            window.addEventListener('scroll', toggleVisibility);

            return () => {
                window.removeEventListener('scroll', toggleVisibility);
            };
        }
    }, []);

    const scrollToTop = (): void => {
        if (window) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="fixed md:bottom-8 md:right-8 bottom-6 right-4 z-[999]">
            {
                isVisible && (
                    <button
                        type="button"
                        onClick={scrollToTop}
                        className="px-3.5 py-3.5 duration-200 transition-all text-white md:text-2xl text-base rounded-[8px] bg-gradient-to-br from-[#02C76A] to-[#028D4B]"
                    >
                        <MdDoubleArrow className="-rotate-90" />
                    </button>
                )
            }
        </div>
    )
}

export default ScrollToTopBtn