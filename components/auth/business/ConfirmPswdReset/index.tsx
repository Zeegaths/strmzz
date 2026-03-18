import { BsEnvelope } from "react-icons/bs"


/**
 * Renders a card that displays a success message after a user has submitted the reset password form.
 *
 * It displays an envelope icon and a message that tells the user to check their email
 * for instructions to reset their password.
 *
 * @returns A JSX element representing the card.
 */
const ConfirmPasswordResetEmail = () => {
    return (
        <div className="shadow-authCardShadow md:w-[380px] w-full rounded-[16px] bg-white border border-[#E5E7EB] flex flex-col gap-4 items-center py-8 px-6 relative">
            <div className="w-[56px] h-[56px] flex justify-center items-center bg-white border-[0.7px] border-[#E5E7EB] rounded-full shadow-verifyMShadow text-accent">
                <BsEnvelope className="w-5 h-5" />
            </div>

            <div className="w-full flex flex-col gap-3">
                <h4 className="font-poppins font-[600] text-base text-primary text-center">Check your email</h4>
                <p className="font-poppins font-[400] text-[14px] leading-[24px] text-[#58556A] text-center px-3">Please check <span className="font-[500]">gregory@gmail.com</span> for instructions to reset your password.
                </p>
            </div>
        </div>
    )
}

export default ConfirmPasswordResetEmail