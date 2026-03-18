import SignupForm from "@/components/auth/business/Signup";

/**
 * A page for users to sign up.
 *
 * The page displays a grid layout. On large screens, the left column displays
 * the Strimz logo, a heading, a subheading, and a background pattern. The right
 * column displays the SignupForm component.
 *
 * The design includes responsive styling for different screen sizes and
 * backgrounds with patterns for visual interest.
 */
export default function UserSignup() {
    return (
        <section className="md:col-span-5 flex justify-center items-center bg-[#F9FAFB]">
            <SignupForm />
        </section>
    );
}