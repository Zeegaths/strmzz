/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { BsEnvelope } from "react-icons/bs"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useEffect, useState } from "react"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { useRouter } from "next/navigation"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { RxCaretLeft } from "react-icons/rx";
import { toast } from "sonner"


/**
 * Renders a form for verifying an email address.
 *
 * The form displays an envelope icon and a message that tells the user to check their email
 * for instructions to verify their email address. It also includes the FormInputs component
 * for user input and a button to resend the verification email.
 *
 * @returns A JSX element representing the verification form.
 */
const VerificationForm = () => {
    const router = useRouter()
    const [user, setUser] = useState<{ email?: string }>({});
    const [isSending, setIsSending] = useState<boolean>(false)

    useEffect(() => {
        const data = window.localStorage.getItem("strimzUser");
        const parsedUser = data ? JSON.parse(data) : { email: "andrew@gmail.com" };
        setUser(parsedUser);
    }, []);

    const handleResendOTP = async () => {
        setIsSending(true)
        try {
            const data = JSON.stringify({ email: user?.email });
            console.log(data);
        } catch (error: any) {
            console.error(error);

        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="shadow-authCardShadow md:w-[380px] w-full rounded-[16px] bg-white border border-[#E5E7EB] flex flex-col gap-4 items-center py-8 px-6 relative">
            <div className="w-[56px] h-[56px] flex justify-center items-center bg-white border-[0.7px] border-[#E5E7EB] rounded-full shadow-verifyMShadow text-accent">
                <BsEnvelope className="w-5 h-5" />
            </div>

            <div className="w-full flex flex-col gap-3">
                <h4 className="font-poppins font-[600] text-base text-primary text-center">Verify email address</h4>
                <p className="font-poppins font-[400] text-[14px] leading-[24px] text-[#58556A] text-center px-3">Please check <span className="font-[500]">{user?.email}</span> for an email and enter your code below. </p>
            </div>

            <FormInputs />

            <p className="text-[#58556A] font-[400] font-poppins text-[14px] leading-[24px]">
                Didn&apos;t get an email?
                <button type="button" onClick={handleResendOTP} className={`${!isSending && "underline"} ml-2 text-accent font-[500]`}>
                    {
                        isSending ?
                            (<span className="flex items-center gap-1">
                                <AiOutlineLoading3Quarters className="animate-spin" />
                                Sending...
                            </span>)
                            : (<span>Resend code</span>)
                    }
                </button>
            </p>

            {/* go back btn */}
            <button type="button" onClick={() => router.back()} className="absolute top-5 left-5 text-primary font-bold">
                <RxCaretLeft className="w-8 h-8" />
            </button>
        </div>
    )
}

export default VerificationForm

/**
 * Renders a form for the user to enter a verification code sent to their email.
 * The form is an input with a length of 4, and it only accepts digits and letters.
 * When the user enters a valid code, the form calls the validateOTP function to
 * verify the code. If the verification is successful, the user is redirected to
 * the plans page.
 *
 * @returns A JSX element representing the verification form.
 */
const FormInputs = () => {
    const [value, setValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const validateOTP = async (otp: string) => {
        setIsLoading(true)
        try {

            console.log(otp);
            if (otp === "1234") {
                toast.success("user verified", {
                    position: "top-right",
                })
                router.push("/user");
            }

        } catch (error: any) {
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (value: string) => {
        setValue(value)
        if (value.length === 4) {
            validateOTP(value)
        }
    }

    return (
        <>
            <InputOTP
                maxLength={4}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                value={value}
                onChange={handleChange}
                disabled={isLoading}
            >
                <InputOTPGroup className="gap-1">
                    {[...Array(4)].map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                    ))}
                </InputOTPGroup>
            </InputOTP>
            {isLoading &&
                <p className="flex justify-center text-sm items-center text-accent gap-1">
                    <AiOutlineLoading3Quarters className="animate-spin text-accent" />
                    Verifying...
                </p>
            }
        </>
    )
}