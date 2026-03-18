import LoginForm from "@/components/auth/business/Login";

/**
 * A login page for users.
 *
 * The page has a grid layout. On large screens, the left column displays the Strimz logo,
 * a heading, and a subheading. The right column displays the login form.
 *
 * The login form is rendered by the `LoginForm` component. The form is placed in the
 * center of the page, both horizontally and vertically.
 *
 * The page also includes two background patterns that are displayed as absolute positioned
 * elements. The patterns are displayed below the logo and the login form respectively.
 *
 * The page is fully responsive, ensuring a seamless viewing experience across devices.
 */
export default function UserLogin() {
    return (
        <section className="md:col-span-5 flex justify-center items-center bg-[#F9FAFB]">
            <LoginForm />
        </section>
    );
}