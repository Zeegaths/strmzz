import ResetPasswordForm from "@/components/auth/business/ResetPassword";

/**
 * Renders the reset password page layout.
 *
 * The page is divided into two sections:
 * 1. A left section that is visible on medium to large screens, which includes 
 *    the Strimz logo, a heading, a subheading, and decorative background patterns.
 * 2. A right section that contains the `ResetPasswordForm` component, which allows 
 *    users to enter their email to reset their password.
 *
 * The layout is responsive, with the left section being hidden on smaller screens,
 * and the right section occupying the full width.
 *
 * @returns A JSX element representing the reset password page.
 */

export default function ResetPassword() {
    return (
        <section className="md:col-span-5 flex justify-center items-center bg-[#F9FAFB]">
            <ResetPasswordForm />
        </section>
    )
}