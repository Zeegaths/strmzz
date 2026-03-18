import VerificationForm from "@/components/auth/business/Verify";

/**
 * A page for verifying an email address.
 *
 * The page has a grid layout. On large screens, the left column displays the Strimz logo,
 * a heading, and a subheading. The right column displays the VerificationForm component.
 *
 * The VerificationForm component displays an envelope icon and a message that tells the user to check their email
 * for instructions to verify their email address. It also includes the FormInputs component
 * for user input and a button to resend the verification email.
 *
 * The page also includes two background patterns that are displayed as absolute positioned
 * elements. The patterns are displayed below the logo and the VerificationForm respectively.
 *
 * The page is fully responsive, ensuring a seamless viewing experience across devices.
 */
export default function VerifyEmail() {
    return (
        <section className="md:col-span-5 flex justify-center items-center bg-[#F9FAFB]">
            <VerificationForm />
        </section>
    )
}


