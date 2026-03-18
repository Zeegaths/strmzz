import Image, { StaticImageData } from "next/image"

interface BillPaymentTxProps {
    icon: StaticImageData
    title: string
    date: string
    amount: string
    status: string
}

/**
 * BillPaymentTx component renders a transaction item for bill payments.
 *
 * The component displays information about a bill payment transaction, including the icon,
 * title, date, amount, and transaction status.
 *
 * @param {StaticImageData} icon - The icon for the bill payment type.
 * @param {string} title - The title of the transaction.
 * @param {string} date - The date and time of the transaction.
 * @param {string} amount - The amount involved in the transaction.
 * @param {string} status - The status of the transaction.
 *
 * @returns {React.ReactElement} A styled component displaying bill payment transaction details.
 */

const BillPaymentTx = ({ icon, title, date, amount, status }: BillPaymentTxProps) => {
    return (
        <main className="w-full flex justify-between items-center cursor-pointer hover:bg-[#F9FAFB] transition-all px-2 py-3 rounded-[8px]">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center p-2">
                    <Image src={icon} alt={title} width={40} height={40} className="w-full h-full object-contain" quality={100} priority />
                </div>
                <div className="flex flex-col gap-1">
                    <h4 className="text-primary text-sm font-[500] font-poppins">{title}</h4>
                    <p className="text-xs font-[400] font-poppins text-[#58556A]">{date}</p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1">
                <h4 className="text-primary text-sm font-[500] font-poppins">{amount}</h4>
                <p className="flex items-center gap-1.5 text-xs font-[400] font-poppins text-[#10B981]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    {status}
                </p>
            </div>
        </main>
    )
}

export default BillPaymentTx
