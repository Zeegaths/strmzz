/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { airtimeSchema, AirtimeInput, networkProviders } from '@/types/utilityBills'
import FormInput from '@/components/auth/shared/FormInput'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'
import usdcIcon from "@/public/brands/USDC.svg"
import usdtIcon from "@/public/brands/USDT.svg"
import { FiLoader, FiCheck } from 'react-icons/fi'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ERC20_ABI, STRIMZ_PAYMENTS_ABI, CONTRACTS, toTokenUnits, TOKEN_DECIMALS, getTokenAddress } from '@/config/contracts'
import { formatUnits } from 'viem'

type PayStep = 'form' | 'approve' | 'pay' | 'done'

interface AirtimeFormProps {
    onSuccess: () => void
}

const AirtimeForm = ({ onSuccess }: AirtimeFormProps) => {
    const { address } = useAccount()
    const [payStep, setPayStep] = useState<PayStep>('form')
    const [formData, setFormData] = useState<AirtimeInput | null>(null)

    const {
        register, handleSubmit, control, watch,
        formState: { errors, isSubmitting },
    } = useForm<AirtimeInput>({
        resolver: zodResolver(airtimeSchema),
        mode: 'onChange',
        defaultValues: {
            networkProvider: '',
            phoneNumber: '',
            amount: '',
            token: 'USDC',
            email: '',
        },
    })

    const watchedToken = watch('token')
    const watchedAmount = watch('amount')

    const tokenAddress = getTokenAddress(watchedToken as 'USDC' | 'USDT')
    const amountRaw = watchedAmount && !isNaN(parseFloat(watchedAmount))
        ? toTokenUnits(parseFloat(watchedAmount))
        : BigInt(0)

    // Balance
    const { data: balance } = useReadContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    })

    // Allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: address ? [address, CONTRACTS.STRIMZ_PAYMENTS] : undefined,
        query: { enabled: !!address },
    })

    const formattedBalance = balance
        ? parseFloat(formatUnits(balance as bigint, TOKEN_DECIMALS)).toFixed(2)
        : '0.00'

    const hasInsufficientBalance = balance !== undefined && amountRaw > BigInt(0) && (balance as bigint) < amountRaw

    // Approve
    const { writeContract: writeApprove, data: approveHash, isPending: isApproving, error: approveError } = useWriteContract()
    const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({ hash: approveHash })

    // Pay
    const { writeContract: writePay, data: payHash, isPending: isPaying, error: payError } = useWriteContract()
    const { isSuccess: payConfirmed } = useWaitForTransactionReceipt({ hash: payHash })

    useEffect(() => {
        if (approveConfirmed) {
            refetchAllowance()
            setPayStep('pay')
            toast.success('Approval confirmed')
        }
    }, [approveConfirmed, refetchAllowance])

    useEffect(() => {
        if (payConfirmed) {
            setPayStep('done')
            toast.success('Airtime purchase successful!')
            setTimeout(() => onSuccess(), 1500)
        }
    }, [payConfirmed, onSuccess])

    useEffect(() => {
        if (approveError) toast.error(approveError.message.split('\n')[0])
        if (payError) toast.error(payError.message.split('\n')[0])
    }, [approveError, payError])

    // Step 1 — validate form and decide approve vs pay
    const onSubmit = async (data: AirtimeInput) => {
        if (!address) {
            toast.error('Wallet not connected')
            return
        }
        setFormData(data)

        const currentAllowance = allowance as bigint | undefined
        if (!currentAllowance || currentAllowance < amountRaw) {
            setPayStep('approve')
        } else {
            setPayStep('pay')
        }
    }

    // Step 2 — approve
    const handleApprove = () => {
        writeApprove({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [CONTRACTS.STRIMZ_PAYMENTS, amountRaw * BigInt(12)],
        })
    }

    // Step 3 — pay
    const handlePay = () => {
        if (!formData || !address) return

        const preference = JSON.stringify({
            type: 'airtime',
            provider: formData.networkProvider,
            phone: formData.phoneNumber,
            email: formData.email,
            amount: formData.amount,
        })

        const billsMerchantId = process.env.NEXT_PUBLIC_BILLS_MERCHANT_ID as `0x${string}`

        writePay({
            address: CONTRACTS.STRIMZ_PAYMENTS,
            abi: STRIMZ_PAYMENTS_ABI,
            functionName: 'pay',
            args: [billsMerchantId, tokenAddress, amountRaw, preference, BigInt(0)],
        })
    }

    // ── Approve UI ──
    if (payStep === 'approve') {
        return (
            <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h4 className="font-sora font-[600] text-base text-primary">Approve {watchedToken}</h4>
                    <p className="font-poppins text-sm text-[#58556A]">
                        Allow Strimz to use {watchedAmount} {watchedToken} from your wallet.
                    </p>
                </div>

                <div className="flex items-center justify-between px-4 py-3 bg-[#F9FAFB] rounded-[8px] border border-[#E5E7EB]">
                    <span className="font-poppins text-sm text-[#58556A]">Amount</span>
                    <span className="font-sora font-[600] text-primary text-sm">{watchedAmount} {watchedToken}</span>
                </div>

                <button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="w-full h-[40px] flex justify-center items-center rounded-[8px] bg-accent text-white font-poppins font-[600] text-[14px] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isApproving
                        ? <span className="flex items-center gap-2"><FiLoader className="animate-spin w-4 h-4" /> Approving...</span>
                        : 'Approve'}
                </button>

                <button
                    onClick={() => setPayStep('form')}
                    className="w-full text-sm font-poppins text-[#58556A] hover:text-accent transition-colors"
                >
                    ← Back
                </button>
            </div>
        )
    }

    // ── Pay confirmation UI ──
    if (payStep === 'pay') {
        return (
            <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h4 className="font-sora font-[600] text-base text-primary">Confirm Purchase</h4>
                    <p className="font-poppins text-sm text-[#58556A]">Review your airtime details before paying.</p>
                </div>

                <div className="flex flex-col gap-3 px-4 py-4 bg-[#F9FAFB] rounded-[8px] border border-[#E5E7EB]">
                    <div className="flex justify-between">
                        <span className="font-poppins text-xs text-[#9CA3AF] uppercase">Provider</span>
                        <span className="font-poppins text-sm font-[500] text-primary">{formData?.networkProvider}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-poppins text-xs text-[#9CA3AF] uppercase">Phone</span>
                        <span className="font-poppins text-sm font-[500] text-primary">{formData?.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-poppins text-xs text-[#9CA3AF] uppercase">Email</span>
                        <span className="font-poppins text-sm font-[500] text-primary">{formData?.email}</span>
                    </div>
                    <hr className="border-[#E5E7EB]" />
                    <div className="flex justify-between">
                        <span className="font-poppins text-xs text-[#9CA3AF] uppercase">Total</span>
                        <span className="font-sora font-[600] text-primary">{formData?.amount} {formData?.token}</span>
                    </div>
                </div>

                <button
                    onClick={handlePay}
                    disabled={isPaying}
                    className="w-full h-[40px] flex justify-center items-center rounded-[8px] bg-accent text-white font-poppins font-[600] text-[14px] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isPaying
                        ? <span className="flex items-center gap-2"><FiLoader className="animate-spin w-4 h-4" /> Processing...</span>
                        : `Pay ${formData?.amount} ${formData?.token}`}
                </button>
            </div>
        )
    }

    // ── Success UI ──
    if (payStep === 'done') {
        return (
            <div className="w-full flex flex-col items-center gap-4 py-6">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                    <FiCheck className="w-7 h-7 text-green-500" />
                </div>
                <h4 className="font-sora font-[600] text-lg text-primary">Purchase Successful!</h4>
                <p className="font-poppins text-sm text-[#58556A] text-center">
                    {formData?.amount} {formData?.token} airtime sent to {formData?.phoneNumber}
                </p>
            </div>
        )
    }

    // ── Main form UI ──
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">

            {/* Network Provider */}
            <div className="w-full flex flex-col">
                <label className="font-poppins text-[14px] text-[#58556A] leading-[24px]">Network provider</label>
                <Controller
                    name="networkProvider"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full h-[44px] rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow font-poppins text-[14px] text-[#8E8C9C] px-4 focus:border-accent outline-none">
                                <SelectValue placeholder="Select network" />
                            </SelectTrigger>
                            <SelectContent>
                                {networkProviders.map((provider) => (
                                    <SelectItem key={provider.value} value={provider.value}>{provider.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.networkProvider && <p className="text-red-500 text-[12px] font-poppins mt-1">{errors.networkProvider.message}</p>}
            </div>

            {/* Phone Number */}
            <FormInput
                label="Phone number"
                id="phoneNumber"
                type="text"
                placeholder="08030224350"
                register={register('phoneNumber')}
                error={errors.phoneNumber?.message}
            />

            {/* Token + Amount */}
            <div className="grid grid-cols-2 gap-4">
                <div className="w-full flex flex-col">
                    <label className="font-poppins text-[14px] text-[#58556A] leading-[24px]">Token</label>
                    <Controller
                        name="token"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full h-[44px] rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow font-poppins text-[14px] text-[#58556A] px-4 focus:border-accent outline-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USDC">
                                        <div className="flex items-center gap-1.5">
                                            <Image src={usdcIcon} alt="USDC" width={20} height={20} />
                                            <span>USDC</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="USDT">
                                        <div className="flex items-center gap-1.5">
                                            <Image src={usdtIcon} alt="USDT" width={20} height={20} />
                                            <span>USDT</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.token && <p className="text-red-500 text-[12px] font-poppins mt-1">{errors.token.message}</p>}
                </div>

                <FormInput
                    label="Amount"
                    id="amount"
                    type="text"
                    placeholder="Enter amount"
                    register={register('amount')}
                    error={errors.amount?.message}
                />
            </div>

            {/* Email */}
            <FormInput
                label="Email address"
                id="email"
                type="email"
                placeholder="Email address"
                register={register('email')}
                error={errors.email?.message}
            />

            {/* Balance + insufficient warning */}
            <div className="flex items-center justify-between">
                <span className="font-poppins text-xs text-[#9CA3AF]">Available balance</span>
                <span className="font-poppins text-xs font-[500] text-primary">{formattedBalance} {watchedToken}</span>
            </div>

            {hasInsufficientBalance && (
                <p className="text-red-500 text-xs font-poppins">Insufficient {watchedToken} balance</p>
            )}

            <button
                type="submit"
                disabled={isSubmitting || hasInsufficientBalance || !address}
                className="w-full h-[40px] flex justify-center items-center rounded-[8px] bg-accent text-white font-poppins font-[600] text-[14px] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Processing...' : 'Purchase airtime'}
            </button>

            {!address && (
                <p className="text-center text-xs font-poppins text-[#9CA3AF]">Connect your wallet to continue</p>
            )}
        </form>
    )
}

export default AirtimeForm