'use client'
import Image from "next/image"
import { useRouter } from "next/navigation"
import airtime from "@/public/bills/airtime.png"
import data from "@/public/bills/data.png"
import electricity from "@/public/bills/electricity.png"
import cable from "@/public/bills/cable.png"

const billItems = [
  { type: 'airtime', img: airtime, label: 'Airtime', sub: 'MTN, AIRTEL, GLO' },
  { type: 'data', img: data, label: 'Data', sub: 'MTN, AIRTEL, GLO' },
  { type: 'electricity', img: electricity, label: 'Electricity', sub: 'EEDC, AEDC' },
  { type: 'cable', img: cable, label: 'Cable', sub: 'GOTV, DSTV' },
]

const Bills = () => {
  const router = useRouter()

  return (
    <div className="w-full flex flex-col gap-6">
      <h5 className="text-[#050020] font-poppins text-sm font-[500]">Pay Bills</h5>
      <div className="w-full grid md:grid-cols-4 grid-cols-2 gap-6">
        {billItems.map((bill) => (
          <div
            key={bill.type}
            onClick={() => router.push(`/user/utility-bills?tab=${bill.type}`)}
            className="w-full flex flex-col gap-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-5 cursor-pointer hover:shadow-[0px_4px_12px_0px_#0000001A] transition-shadow"
          >
            <Image src={bill.img} alt={bill.label} width={60} height={60} quality={100} priority />
            <div className="flex flex-col gap-2">
              <h5 className="text-[#050020] font-poppins text-sm font-[500]">{bill.label}</h5>
              <p className="text-xs text-[#58556A] font-poppins font-[400] uppercase">{bill.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Bills