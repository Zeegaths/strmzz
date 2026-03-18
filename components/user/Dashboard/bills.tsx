import Image from "next/image"
import airtime from "@/public/bills/airtime.png"
import data from "@/public/bills/data.png"
import electricity from "@/public/bills/electricity.png"
import cable from "@/public/bills/cable.png"

/**
 * A component that renders an alert with a checklist of steps to get started with Strimz.
 *
 * The alert has a white background and a gradient that transitions from a light blue to a darker blue.
 * The checklist is rendered as a list with three items, each with a white background and a light blue checkmark.
 * The items are separated by a small gap.
 * The alert also contains an image of a pattern at the bottom right corner.
 */
const Bills = () => {
    return (
        <div className="w-full flex flex-col gap-6 ">
            <h5 className="text-[#050020] font-poppins text-sm font-[500]">Pay Bills</h5>
            <div className="w-full grid md:grid-cols-4 grid-cols-2 gap-6">
                {/* airtime */}
                <div className="w-full flex flex-col gap-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-5 cursor-pointer hover:shadow-[0px_4px_12px_0px_#0000001A] transition-shadow">
                    <Image src={airtime} alt="airtime" width={60} height={60} quality={100} priority />
                    <div className="flex flex-col gap-2">
                        <h5 className="text-[#050020] font-poppins text-sm font-[500]">Airtime</h5>
                        <p className="text-xs text-[#58556A] font-poppins font-[400] uppercase">MTN, AIRTEL, GLO</p>
                    </div>
                </div>

                {/* data */}
                <div className="w-full flex flex-col gap-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-5 cursor-pointer hover:shadow-[0px_4px_12px_0px_#0000001A] transition-shadow">
                    <Image src={data} alt="data" width={60} height={60} quality={100} priority />
                    <div className="flex flex-col gap-2">
                        <h5 className="text-[#050020] font-poppins text-sm font-[500]">Data</h5>
                        <p className="text-xs text-[#58556A] font-poppins font-[400] uppercase">MTN, AIRTEL, GLO</p>
                    </div>
                </div>

                {/* electricity */}
                <div className="w-full flex flex-col gap-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-5 cursor-pointer hover:shadow-[0px_4px_12px_0px_#0000001A] transition-shadow">
                    <Image src={electricity} alt="electricity" width={60} height={60} quality={100} priority />
                    <div className="flex flex-col gap-2">
                        <h5 className="text-[#050020] font-poppins text-sm font-[500]">Electricity</h5>
                        <p className="text-xs text-[#58556A] font-poppins font-[400] uppercase">EEDC, AEDC</p>
                    </div>
                </div>

                {/* cable */}
                <div className="w-full flex flex-col gap-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-5 cursor-pointer hover:shadow-[0px_4px_12px_0px_#0000001A] transition-shadow">
                    <Image src={cable} alt="cable" width={60} height={60} quality={100} priority />
                    <div className="flex flex-col gap-2">
                        <h5 className="text-[#050020] font-poppins text-sm font-[500]">Cable</h5>
                        <p className="text-xs text-[#58556A] font-poppins font-[400] uppercase">GOTV, DSTV</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Bills