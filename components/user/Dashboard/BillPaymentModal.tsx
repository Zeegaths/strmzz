'use client'
import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import { FiLoader } from 'react-icons/fi'
import { FiCheck, FiAlertTriangle } from 'react-icons/fi'
import { X } from 'lucide-react'
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { ERC20_ABI, STRIMZ_PAYMENTS_ABI, CONTRACTS, toTokenUnits, TOKEN_DECIMALS } from '@/config/contracts'
import { formatUnits } from 'viem'
import { toast } from 'sonner'
import airtime from "@/public/bills/airtime.png"
import data from "@/public/bills/data.png"
import electricity from "@/public/bills/electricity.png"
import cable from "@/public/bills/cable.png"

type BillType = 'airtime' | 'data' | 'electricity' | 'cable'

interface BillPaymentModalProps {
  type: BillType
  onClose: () => void
  userAddress?: `0x${string}`
}

const BILL_CONFIG = {
  airtime: {
    label: 'Airtime',
    img: airtime,
    providers: ['MTN', 'Airtel', 'Glo', '9mobile'],
    amountOptions: [100, 200, 500, 1000],
    fields: [{ name: 'phone', label: 'Phone Number', placeholder: '080XXXXXXXX', type: 'tel' }],
  },
  data: {
    label: 'Data',
    img: data,
    providers: ['MTN', 'Airtel', 'Glo', '9mobile'],
    amountOptions: [500, 1000, 2000, 5000],
    fields: [{ name: 'phone', label: 'Phone Number', placeholder: '080XXXXXXXX', type: 'tel' }],
  },
  electricity: {
    label: 'Electricity',
    img: electricity,
    providers: ['EEDC', 'AEDC', 'IKEDC', 'EKEDC'],
    amountOptions: [1000, 2000, 5000, 10000],
    fields: [{ name: 'meter', label: 'Meter Number', placeholder: 'Enter meter number', type: 'text' }],
  },
  cable: {
    label: 'Cable TV',
    img: cable,
    providers: ['DSTV', 'GOTV', 'Startimes'],
    amountOptions: [1500, 2500, 5000, 10000],
    fields: [{ name: 'smartcard', label: 'Smartcard Number', placeholder: 'Enter smartcard number', type: 'text' }],
  },
}

type ModalStep = 'form' | 'approve' | 'pay' | 'success' | 'error'

const BillPaymentModal = ({ type, onClose, userAddress }: BillPaymentModalProps) => {
  const config = BILL_CONFIG[type]

  const [step, setStep] = useState<ModalStep>('form')
  const [provider, setProvider] = useState(config.providers[0])
  const [amount, setAmount] = useState<number>(config.amountOptions[0])
  const [customAmount, setCustomAmount] = useState('')
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [txError, setTxError] = useState<string | null>(null)

  // Convert NGN amount to USDC (simplified — in production use a real rate API)
  const USDC_RATE = 1600 // 1 USDC = ~1600 NGN
  const usdcAmount = parseFloat(((customAmount ? Number(customAmount) : amount) / USDC_RATE).toFixed(4))
  const amountRaw = toTokenUnits(usdcAmount)

  // Read balance
  const { data: balance } = useReadContract({
    address: CONTRACTS.USDC,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  })

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.USDC,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: userAddress ? [userAddress, CONTRACTS.STRIMZ_PAYMENTS] : undefined,
    query: { enabled: !!userAddress },
  })

  const formattedBalance = balance
    ? parseFloat(formatUnits(balance as bigint, TOKEN_DECIMALS)).toFixed(2)
    : '0.00'

  const hasInsufficientBalance = balance !== undefined && (balance as bigint) < amountRaw

  // Approve
  const { writeContract: writeApprove, data: approveHash, isPending: isApproving } = useWriteContract()
  const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({ hash: approveHash })

  // Pay
  const { writeContract: writePay, data: payHash, isPending: isPaying } = useWriteContract()
  const { isSuccess: payConfirmed } = useWaitForTransactionReceipt({ hash: payHash })

  React.useEffect(() => {
    if (approveConfirmed) {
      refetchAllowance()
      setStep('pay')
    }
  }, [approveConfirmed, refetchAllowance])

  React.useEffect(() => {
    if (payConfirmed) {
      setStep('success')
      toast.success(`${config.label} payment successful!`)
    }
  }, [payConfirmed, config.label])

  const handleSubmitForm = useCallback(() => {
    // Validate fields
    for (const field of config.fields) {
      if (!fieldValues[field.name]) {
        toast.error(`Please enter ${field.label}`)
        return
      }
    }
    if (!userAddress) {
      toast.error('Wallet not connected')
      return
    }

    // Check if approval needed
    const currentAllowance = allowance as bigint | undefined
    if (!currentAllowance || currentAllowance < amountRaw) {
      setStep('approve')
    } else {
      setStep('pay')
    }
  }, [config.fields, fieldValues, userAddress, allowance, amountRaw])

  const handleApprove = useCallback(() => {
    setTxError(null)
    writeApprove({
      address: CONTRACTS.USDC,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACTS.STRIMZ_PAYMENTS, amountRaw * BigInt(12)],
    })
  }, [writeApprove, amountRaw])

  const handlePay = useCallback(() => {
    if (!userAddress) return
    setTxError(null)

    // Use a placeholder merchantId for bills — in production this would be your bills service merchant ID
    const billsMerchantId = process.env.NEXT_PUBLIC_BILLS_MERCHANT_ID as `0x${string}`
    const preference = JSON.stringify({ type, provider, ...fieldValues })

    writePay({
      address: CONTRACTS.STRIMZ_PAYMENTS,
      abi: STRIMZ_PAYMENTS_ABI,
      functionName: 'pay',
      args: [billsMerchantId, CONTRACTS.USDC, amountRaw, preference, BigInt(0)],
    })
  }, [userAddress, writePay, amountRaw, type, provider, fieldValues])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-[480px] bg-white rounded-[16px] shadow-xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <Image src={config.img} alt={config.label} width={32} height={32} quality={100} />
            <h3 className="font-sora font-[600] text-base text-[#050020]">Pay {config.label}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] transition-colors">
            <X className="w-4 h-4 text-[#58556A]" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">

          {/* FORM STEP */}
          {step === 'form' && (
            <>
              {/* Provider */}
              <div className="flex flex-col gap-2">
                <label className="font-poppins text-sm font-[500] text-[#050020]">Provider</label>
                <div className="flex flex-wrap gap-2">
                  {config.providers.map((p) => (
                    <button
                      key={p}
                      onClick={() => setProvider(p)}
                      className={`px-4 py-2 rounded-[8px] text-sm font-poppins font-[500] border transition-all ${
                        provider === p
                          ? 'bg-accent text-white border-accent'
                          : 'bg-white text-[#58556A] border-[#E5E7EB] hover:border-accent'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic fields */}
              {config.fields.map((field) => (
                <div key={field.name} className="flex flex-col gap-2">
                  <label className="font-poppins text-sm font-[500] text-[#050020]">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={fieldValues[field.name] || ''}
                    onChange={(e) => setFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                    className="w-full h-[44px] rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 font-poppins text-sm text-[#050020] placeholder:text-[#9CA3AF] outline-none focus:border-accent transition-colors"
                  />
                </div>
              ))}

              {/* Amount */}
              <div className="flex flex-col gap-2">
                <label className="font-poppins text-sm font-[500] text-[#050020]">Amount (NGN)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {config.amountOptions.map((a) => (
                    <button
                      key={a}
                      onClick={() => { setAmount(a); setCustomAmount('') }}
                      className={`px-4 py-2 rounded-[8px] text-sm font-poppins font-[500] border transition-all ${
                        amount === a && !customAmount
                          ? 'bg-accent text-white border-accent'
                          : 'bg-white text-[#58556A] border-[#E5E7EB] hover:border-accent'
                      }`}
                    >
                      ₦{a.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Or enter custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full h-[44px] rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 font-poppins text-sm text-[#050020] placeholder:text-[#9CA3AF] outline-none focus:border-accent transition-colors"
                />
              </div>

              {/* USDC equivalent */}
              <div className="w-full flex items-center justify-between px-4 py-3 bg-[#F9FAFB] rounded-[8px] border border-[#E5E7EB]">
                <span className="font-poppins text-sm text-[#58556A]">You pay</span>
                <span className="font-sora font-[600] text-[#050020] text-sm">{usdcAmount} USDC</span>
              </div>

              {/* Balance */}
              <div className="flex items-center justify-between">
                <span className="font-poppins text-xs text-[#9CA3AF]">Available balance</span>
                <span className="font-poppins text-xs font-[500] text-[#050020]">{formattedBalance} USDC</span>
              </div>

              {hasInsufficientBalance && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-[8px]">
                  <FiAlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-xs font-poppins text-red-700">Insufficient USDC balance</p>
                </div>
              )}

              <button
                onClick={handleSubmitForm}
                disabled={hasInsufficientBalance}
                className="w-full h-[44px] rounded-[8px] bg-accent text-white font-poppins font-[500] text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                Continue
              </button>
            </>
          )}

          {/* APPROVE STEP */}
          {step === 'approve' && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h4 className="font-sora font-[600] text-base text-[#050020]">Approve USDC</h4>
                <p className="font-poppins text-sm text-[#58556A]">
                  Allow Strimz to use {usdcAmount} USDC from your wallet to complete this payment.
                </p>
              </div>

              <div className="w-full flex items-center justify-between px-4 py-3 bg-[#F9FAFB] rounded-[8px] border border-[#E5E7EB]">
                <span className="font-poppins text-sm text-[#58556A]">Amount to approve</span>
                <span className="font-sora font-[600] text-[#050020] text-sm">{usdcAmount} USDC</span>
              </div>

              {txError && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-[8px]">
                  <p className="text-xs font-poppins text-red-700">{txError}</p>
                </div>
              )}

              <button
                onClick={handleApprove}
                disabled={isApproving}
                className="w-full h-[44px] rounded-[8px] bg-accent text-white font-poppins font-[500] text-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              >
                {isApproving ? <><FiLoader className="w-4 h-4 animate-spin" /> Approving...</> : 'Approve'}
              </button>

              <button onClick={() => setStep('form')} className="w-full text-sm font-poppins text-[#58556A] hover:text-accent transition-colors">
                ← Back
              </button>
            </div>
          )}

          {/* PAY STEP */}
          {step === 'pay' && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h4 className="font-sora font-[600] text-base text-[#050020]">Confirm Payment</h4>
                <p className="font-poppins text-sm text-[#58556A]">Review and confirm your payment details.</p>
              </div>

              <div className="flex flex-col gap-3 px-4 py-4 bg-[#F9FAFB] rounded-[8px] border border-[#E5E7EB]">
                <div className="flex justify-between">
                  <span className="font-poppins text-xs text-[#9CA3AF] uppercase">Service</span>
                  <span className="font-poppins text-sm font-[500] text-[#050020]">{config.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-poppins text-xs text-[#9CA3AF] uppercase">Provider</span>
                  <span className="font-poppins text-sm font-[500] text-[#050020]">{provider}</span>
                </div>
                {config.fields.map((field) => (
                  <div key={field.name} className="flex justify-between">
                    <span className="font-poppins text-xs text-[#9CA3AF] uppercase">{field.label}</span>
                    <span className="font-poppins text-sm font-[500] text-[#050020]">{fieldValues[field.name]}</span>
                  </div>
                ))}
                <hr className="border-[#E5E7EB]" />
                <div className="flex justify-between">
                  <span className="font-poppins text-xs text-[#9CA3AF] uppercase">Total</span>
                  <span className="font-sora font-[600] text-[#050020]">{usdcAmount} USDC</span>
                </div>
              </div>

              {txError && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-[8px]">
                  <p className="text-xs font-poppins text-red-700">{txError}</p>
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={isPaying}
                className="w-full h-[44px] rounded-[8px] bg-accent text-white font-poppins font-[500] text-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              >
                {isPaying ? <><FiLoader className="w-4 h-4 animate-spin" /> Processing...</> : `Pay ${usdcAmount} USDC`}
              </button>
            </div>
          )}

          {/* SUCCESS STEP */}
          {step === 'success' && (
            <div className="flex flex-col items-center gap-5 py-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <FiCheck className="w-8 h-8 text-green-500" />
              </div>
              <div className="text-center flex flex-col gap-1">
                <h4 className="font-sora font-[600] text-lg text-[#050020]">Payment Successful!</h4>
                <p className="font-poppins text-sm text-[#58556A]">
                  Your {config.label} payment of {usdcAmount} USDC has been processed.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full h-[44px] rounded-[8px] bg-accent text-white font-poppins font-[500] text-sm hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default BillPaymentModal