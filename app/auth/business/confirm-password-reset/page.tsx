import ConfirmPasswordResetEmail from "@/components/auth/business/ConfirmPswdReset";


/**
 * Renders the Confirm Password Reset page layout.
 *
 * This page is divided into two main sections:
 * 1. A hidden on mobile, visible on larger screens side section that provides
 *    branding and information about the service.
 * 2. The main section that displays the ConfirmPasswordResetEmail component,
 *    inviting users to check their email for password reset instructions.
 *
 * The design includes responsive styling for different screen sizes and
 * backgrounds with patterns for visual interest.
 */

export default function ConfirmPasswordReset() {
    return (
        <section className="md:col-span-5 flex justify-center items-center bg-[#F9FAFB]">
            <ConfirmPasswordResetEmail />
        </section>
    )
}