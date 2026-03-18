'use client'
import { useRouter } from 'next/navigation'
import { Building2, User } from 'lucide-react'
export default function AuthPage() {

    const router = useRouter()

    return (
        <section className="md:col-span-5 flex justify-center items-center bg-[#F9FAFB] min-h-screen py-8">
            {/* content */}
            <div className="shadow-authCardShadow md:w-[480px] w-full rounded-[16px] bg-white border border-[#E5E7EB] flex flex-col items-center py-10 px-6 md:px-8">
                <h4 className="font-[600] font-sora text-primary text-center text-2xl mb-3">
                    Welcome to Strimz
                </h4>
                <p className="text-[#58556A] font-poppins font-[400] text-sm text-center mb-8">
                    Choose how you want to continue
                </p>

                {/* Business Login */}
                <div className="w-full">
                    <button
                        onClick={() => router.push('/auth/business/login')}
                        className="w-full h-[150px] rounded-[12px] border border-[#E5E7EB] hover:border-accent transition-all duration-200 flex flex-col items-center justify-center gap-3 group cursor-pointer bg-white hover:bg-[#F0FFF8]"
                    >
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                            <Building2 className="w-6 h-6 text-accent" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="font-[600] font-sora text-primary text-base">
                                Continue as Business
                            </span>
                            <span className="font-[400] font-poppins text-[#58556A] text-xs">
                                Integrate SDK and accept crypto payments
                            </span>
                        </div>
                    </button>
                </div>

                {/* Divider with text */}
                <div className="w-full flex items-center gap-4 my-6">
                    <div className="flex-1 h-[1px] bg-[#E5E7EB]"></div>
                    <span className="text-[#58556A] font-poppins text-sm">or</span>
                    <div className="flex-1 h-[1px] bg-[#E5E7EB]"></div>
                </div>

                {/* User Login */}
                <div className="w-full">
                    <button
                        onClick={() => router.push('/auth/user/login')}
                        className="w-full h-[150px] rounded-[12px] border border-[#E5E7EB] hover:border-accent transition-all duration-200 flex flex-col items-center justify-center gap-3 group cursor-pointer bg-white hover:bg-[#F0FFF8]"
                    >
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                            <User className="w-6 h-6 text-accent" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="font-[600] font-sora text-primary text-base">
                                Continue as User
                            </span>
                            <span className="font-[400] font-poppins text-[#58556A] text-xs">
                                Pay for subscriptions and utilities with crypto
                            </span>
                        </div>
                    </button>
                </div>

            </div>
        </section>
    )
}