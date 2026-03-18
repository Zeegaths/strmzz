'use client'
import { InfinitySpin } from "react-loader-spinner"

/**
 * Loader is a full-screen loading animation. It is rendered as a client-side only
 * component, so it will not be visible on server-side rendered pages.
 *
 * The component renders a fixed position full-screen div with a white background,
 * and an InfinitySpin loader centered in the middle.
 */
const Loader = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-screen z-[9999] bg-[#F9FAFB] flex justify-center items-center">
            <InfinitySpin
                width="200"
                color="#02C76A"
            />
        </div>
    )
}

export default Loader