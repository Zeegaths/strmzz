import Image from 'next/image'
import React from 'react'
import { AiOutlineDollarCircle } from 'react-icons/ai'
import usdcIcon from "@/public/brands/USDC.svg"
import usdtIcon from "@/public/brands/USDT.svg"
import Earnings from './Earnings'
import Transactions from './Transactions'
import Customers from './Customers'
import Withdraw from '@/components/business/Dashboard/Withdraw'

const BusinessDashboardHome = () => {
    return (
        <section className="w-full flex flex-col gap-6">
            <main className="w-full bg-[#F9FAFB] rounded-[16px] p-4 flex flex-col gap-2.5">
                <h2 className="text-primary font-[500] ml-2 font-poppins text-sm">Wallet Overview</h2>
                {/* balance */}
                <div className="w-full h-auto p-5 flex flex-col lg:justify-between rounded-[12px] bg-white shadow-[0px_1px_2px_0px_#00000014]">
                    <div className='w-full grid lg:grid-cols-4 grid-cols-2 gap-4 lg:gap-0'>

                        {/* Wallet Balance */}
                        <div className="flex flex-col gap-3 ">
                            <span className="flex items-center gap-2 uppercase font-[400] font-poppins text-[#58556A] text-xs">
                                <span className="w-[24px] h-[24px] border-[0.2px] border-[#E5E7EB] shadow-[0px_-1.2px_1.2px_0px_#0000001F_inset] rounded-full flex justify-center items-center bg-white p-[1px]">
                                    <AiOutlineDollarCircle className="text-black w-[22px] h-[22px]" />
                                </span>
                                wallet balance
                            </span>
                            <h3 className="text-black font-[600] font-sora text-xl text-wrap">$ 6,780</h3>
                        </div>

                        {/* USDC */}
                        <div className="flex flex-col gap-3 md:border-l border-[#E5E7EB] md:pl-4 ">
                            <span className="flex items-center gap-2 uppercase font-[400] font-poppins text-[#58556A] text-xs">
                                <span className="w-[24px] h-[24px] border-[0.2px] border-[#E5E7EB] shadow-[0px_-1.2px_1.2px_0px_#0000001F_inset] rounded-full bg-white p-[1px]">
                                    <Image src={usdcIcon} alt='usdt icon' className='w-[24px] h-[24px]' width={68} height={69} quality={100} priority />
                                </span>
                                usdc
                            </span>
                            <h3 className="text-black font-[600] font-sora text-xl text-wrap">$ 3,150</h3>
                        </div>

                        {/* USDT */}
                        <div className="flex flex-col gap-3 md:border-l border-[#E5E7EB] md:pl-4">
                            <span className="flex items-center gap-2 uppercase font-[400] font-poppins text-[#58556A] text-xs">
                                <span className="w-[24px] h-[24px] border-[0.2px] border-[#E5E7EB] shadow-[0px_-1.2px_1.2px_0px_#0000001F_inset] rounded-full bg-white p-[1px]">
                                    <Image src={usdtIcon} alt='usdt icon' className='w-[24px] h-[24px]' width={68} height={69} quality={100} priority />
                                </span>
                                usdt
                            </span>
                            <h3 className="text-black font-[600] font-sora text-xl text-wrap">$ 4,890</h3>
                        </div>

                        {/* Withdrawals */}
                        <div className="flex flex-col gap-3 md:border-l border-[#E5E7EB] md:pl-4 ">
                            <span className="flex items-center gap-2 uppercase font-[400] font-poppins text-[#58556A] text-xs">
                                <span className="w-[24px] h-[24px] border-[0.2px] border-[#E5E7EB] shadow-[0px_-1.2px_1.2px_0px_#0000001F_inset] rounded-full flex justify-center items-center bg-white p-[1px]">
                                    <AiOutlineDollarCircle className="text-black w-[22px] h-[22px]" />
                                </span>
                                withdrawals
                            </span>
                            <h3 className="text-black font-[600] font-sora text-xl text-wrap">$ 104,320</h3>
                        </div>
                    </div>
                </div>
                <Withdraw />
            </main>

            {/* Earnings */}
            <Earnings />

            {/* Transactions */}
            <Transactions />

            {/* Customers */}
            <Customers />

        </section>
    )
}

export default BusinessDashboardHome