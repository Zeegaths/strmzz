'use client'
import { useRouter } from "next/navigation"
import { RxCaretLeft } from "react-icons/rx"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import AllTx from "./AllTx"
import BillPaymentTx from "./BillPaymentTx"
import mtnIcon from "@/public/history/mtn.png"
import airtelIcon from "@/public/history/airtel.png"
import electricityIcon from "@/public/history/electricity.png"
import tvIcon from "@/public/history/tv.png"

/**
 * TxHistory component renders a section with all bill payment transactions.
 *
 * The component renders all bill payment transactions with filters for different
 * payment categories: All, Airtime, Data, Electricity, and Cable.
 *
 * @returns {React.ReactElement} A section with filtered bill payment transactions.
 */
const TxHistory = () => {
    const router = useRouter()

    return (
        <section className="w-full flex flex-col">
            <div className="w-full flex flex-col gap-1">
                <button type="button" className="flex focus:outline-none focus:border-none items-center gap-1 text-[#58556A] hover:text-black transition-colors" onClick={() => router.back()}>
                    <RxCaretLeft className="w-5 h-5" />
                    Back
                </button>
                <h3 className="font-[600] font-poppins md:text-xl text-lg text-black">Transaction history</h3>
                <p className="text-[#58556A] text-sm font-[400] font-poppins">Track and review all your payments</p>
            </div>
            {/* filters */}

            <main className="w-full mt-6">
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="w-full justify-start before:bg-border relative h-auto gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px border-b border-[#E5E7EB]">
                        <TabsTrigger className="px-3 py-3 text-sm font-[500] font-poppins rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#58556A] data-[state=active]:text-black" value="all">All</TabsTrigger>
                        <TabsTrigger className="px-3 py-3 text-sm font-[500] font-poppins rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#58556A] data-[state=active]:text-black" value="airtime">Airtime</TabsTrigger>
                        <TabsTrigger className="px-3 py-3 text-sm font-[500] font-poppins rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#58556A] data-[state=active]:text-black" value="data">Data</TabsTrigger>
                        <TabsTrigger className="px-3 py-3 text-sm font-[500] font-poppins rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#58556A] data-[state=active]:text-black" value="electricity">Electricity</TabsTrigger>
                        <TabsTrigger className="px-3 py-3 text-sm font-[500] font-poppins rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[#58556A] data-[state=active]:text-black" value="cable">Cable</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="">
                        <AllTx />
                    </TabsContent>
                    <TabsContent value="airtime" className="">
                        <div className="flex flex-col gap-1 mt-4">
                            <h3 className="text-[#58556A] font-[500] font-poppins text-sm">February 2025</h3>
                            <div className="w-full flex flex-col bg-white rounded-[12px]">
                                <BillPaymentTx
                                    icon={mtnIcon}
                                    title="MTN Airtime - 08030224350"
                                    date="Feb 10, 2025 · 9:30AM"
                                    amount="$2.50"
                                    status="Completed"
                                />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="data" className="">
                        <div className="flex flex-col gap-1 mt-4">
                            <h3 className="text-[#58556A] font-[500] font-poppins text-sm">February 2025</h3>
                            <div className="w-full flex flex-col bg-white rounded-[12px]">
                                <BillPaymentTx
                                    icon={airtelIcon}
                                    title="Airtel Data-5GB - 08030224350"
                                    date="Feb 10, 2025 · 9:30AM"
                                    amount="$3.00"
                                    status="Completed"
                                />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="electricity" className="">
                        <div className="flex flex-col gap-1 mt-4">
                            <h3 className="text-[#58556A] font-[500] font-poppins text-sm">February 2025</h3>
                            <div className="w-full flex flex-col bg-white rounded-[12px]">
                                <BillPaymentTx
                                    icon={electricityIcon}
                                    title="EEDC Electricity - 0023421092"
                                    date="Feb 10, 2025 · 9:30AM"
                                    amount="$32.50"
                                    status="Completed"
                                />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="cable" className="">
                        <div className="flex flex-col gap-1 mt-4">
                            <h3 className="text-[#58556A] font-[500] font-poppins text-sm">February 2025</h3>
                            <div className="w-full flex flex-col bg-white rounded-[12px]">
                                <BillPaymentTx
                                    icon={tvIcon}
                                    title="GOTV Max - 0023421092"
                                    date="Feb 10, 2025 · 9:30AM"
                                    amount="$2.50"
                                    status="Completed"
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </section>
    )
}

export default TxHistory