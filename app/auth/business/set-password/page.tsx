import SetNewPasswordForm from "@/components/auth/business/SetNewPassword";


/**
 * A page for setting a new password.
 *
 * The page displays a grid layout. On large screens, the left column displays
 * the Strimz logo, a heading, a subheading, and a background pattern. The right
 * column displays the SetNewPasswordForm component.
 *
 * The page is fully responsive, ensuring a seamless viewing experience across
 * devices.
 */
export default function SetNewPassword() {
    return (
        <section className="md:col-span-5 flex justify-center items-center bg-[#F9FAFB]">
            <SetNewPasswordForm />
        </section>
    )
}