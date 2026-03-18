import BillPaymentTx from "./BillPaymentTx"
import netflixIcon from "@/public/history/netflix.png"
import mtnIcon from "@/public/history/mtn.png"
import airtelIcon from "@/public/history/airtel.png"
import electricityIcon from "@/public/history/electricity.png"
import tvIcon from "@/public/history/tv.png"
import spotifyIcon from "@/public/history/spotify.png"

/**
 * AllTx component renders a section with all bill payment transactions.
 *
 * The component renders all bill payment transactions including subscriptions,
 * airtime, data, electricity, and cable payments.
 *
 * @returns {React.ReactElement} A section with all bill payment transactions.
 */
const AllTx = () => {
    return (
        <section className="w-full flex flex-col">
            <div className="flex flex-col gap-1 mt-4">
                <h3 className="text-[#58556A] font-[500] font-poppins text-sm">February 2025</h3>
                <div className="w-full flex flex-col bg-white rounded-[12px]">
                    <BillPaymentTx
                        icon={netflixIcon}
                        title="Netflix standard plan"
                        date="Feb 10, 2025 · 9:30AM"
                        amount="$8.00"
                        status="Completed"
                    />
                    <BillPaymentTx
                        icon={mtnIcon}
                        title="MTN Airtime - 08030224350"
                        date="Feb 10, 2025 · 9:30AM"
                        amount="$2.50"
                        status="Completed"
                    />
                    <BillPaymentTx
                        icon={airtelIcon}
                        title="Airtel Data-5GB - 08030224350"
                        date="Feb 10, 2025 · 9:30AM"
                        amount="$3.00"
                        status="Completed"
                    />
                    <BillPaymentTx
                        icon={electricityIcon}
                        title="EEDC Electricity - 0023421092"
                        date="Feb 10, 2025 · 9:30AM"
                        amount="$32.50"
                        status="Completed"
                    />
                    <BillPaymentTx
                        icon={tvIcon}
                        title="GOTV Max - 0023421092"
                        date="Feb 10, 2025 · 9:30AM"
                        amount="$2.50"
                        status="Completed"
                    />
                    <BillPaymentTx
                        icon={spotifyIcon}
                        title="Spotify family plan"
                        date="Feb 10, 2025 · 9:30AM"
                        amount="$20.00"
                        status="Completed"
                    />
                </div>
            </div>
        </section>
    )
}

export default AllTx