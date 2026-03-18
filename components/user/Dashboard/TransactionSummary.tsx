import Link from "next/link"
import Image, { StaticImageData } from "next/image"
import netflixIcon from "@/public/history/netflix.png"
import mtnIcon from "@/public/history/mtn.png"
import airtelIcon from "@/public/history/airtel.png"
import electricityIcon from "@/public/history/electricity.png"
import tvIcon from "@/public/history/tv.png"
import spotifyIcon from "@/public/history/spotify.png"

interface TransactionItemProps {
    icon: StaticImageData
    title: string
    date: string
    amount: string
    status: string
}

const TransactionItem = ({ icon, title, date, amount, status }: TransactionItemProps) => {
    return (
        <div className="w-full flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center p-2">
                    <Image src={icon} alt={title} width={40} height={40} className="w-full h-full object-contain" quality={100} priority />
                </div>
                <div className="flex flex-col gap-1">
                    <h5 className="text-black font-[500] font-poppins text-sm">{title}</h5>
                    <p className="text-[#58556A] text-xs font-[400] font-poppins">{date}</p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1">
                <p className="text-black font-[500] font-poppins text-sm">{amount}</p>
                <span className="flex items-center gap-1.5 text-[#10B981] text-xs font-[400] font-poppins">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                    {status}
                </span>
            </div>
        </div>
    )
}

/**
 * TransactionSummary component renders a section with a summary of the user's recent transactions.
 *
 * The component displays information about the user's recent transactions, including the date, amount,
 * and transaction status. The component also includes a link to the user's transaction history.
 *
 * @returns {React.ReactElement} A styled component displaying the user's recent transactions.
 */
const TransactionSummary = () => {
    return (
        <section className="w-full flex flex-col gap-3 mt-4">
            <div className="w-full flex justify-between items-center px-1.5">
                <h4 className="text-primary font-[500] font-poppins text-sm capitalize">Transaction history</h4>
                <Link href="/user/tx-history" className="text-[#58556A] text-sm font-[400] font-poppins hover:underline">See all</Link>
            </div>

            {/* with data */}
            <div className="w-full flex flex-col bg-white rounded-[12px] divide-y divide-[#F3F4F6] px-4">
                <TransactionItem
                    icon={netflixIcon}
                    title="Netflix standard plan"
                    date="Feb 10, 2025 · 9:30AM"
                    amount="$8.00"
                    status="Completed"
                />
                <TransactionItem
                    icon={mtnIcon}
                    title="MTN Airtime - 08030224350"
                    date="Feb 10, 2025 · 9:30AM"
                    amount="$2.50"
                    status="Completed"
                />
                <TransactionItem
                    icon={airtelIcon}
                    title="Airtel Data-5GB - 08030224350"
                    date="Feb 10, 2025 · 9:30AM"
                    amount="$3.00"
                    status="Completed"
                />
                <TransactionItem
                    icon={electricityIcon}
                    title="EEDC Electricity - 0023421092"
                    date="Feb 10, 2025 · 9:30AM"
                    amount="$32.50"
                    status="Completed"
                />
                <TransactionItem
                    icon={tvIcon}
                    title="GOTV Max - 0023421092"
                    date="Feb 10, 2025 · 9:30AM"
                    amount="$2.50"
                    status="Completed"
                />
                <TransactionItem
                    icon={spotifyIcon}
                    title="Spotify family plan"
                    date="Feb 10, 2025 · 9:30AM"
                    amount="$20.00"
                    status="Completed"
                />
            </div>
        </section>
    )
}

export default TransactionSummary