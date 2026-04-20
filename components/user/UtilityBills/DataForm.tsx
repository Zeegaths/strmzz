/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { dataSchema, DataInput, networkProviders, dataPlans } from '@/types/utilityBills'
import FormInput from '@/components/auth/shared/FormInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'
import usdcIcon from "@/public/brands/USDC.svg"
import usdtIcon from "@/public/brands/USDT.svg"
import { FiLoader, FiCheck } from 'react-icons/fi'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ERC20_ABI, STRIMZ_PAYMENTS_ABI, CONTRACTS, toTokenUnits, TOKEN_DECIMALS, getTokenAddress } from '@/config/contracts'
import { formatUnits } from 'viem'

type PayStep = 'form' | 'approve' | 'pay' | 'done'

interface DataFormProps {
    onSuccess: () => void
}

const DataForm = ({ onSuccess }: DataFormProps) => {
    const { address } = useAccount()
    const [payStep, setPayStep] = useState<PayStep>('form')
    const [formData, setFormData] = useState<DataInput | null>(null)
    const [selectedNetwork, setSelectedNetwork] = useState<string>('')

    const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<DataInput>({
        resolver: zodResolver(dataSchema),
        mode: 'onChange',
        defaultValues: { networkProvider: '', phoneNumber: '', dataPlan: '', amount: '', token: 'USDC', email: '' },
    })

    const networkProvider = watch('networkProvider')
    const dataPlan = watch('dataPlan')
    const watchedToken = watch('token')
    const watchedAmount = watch('amount')

    useEffect(() => {
        if (networkProvider) { setSelectedNetwork(networkProvider); setValue('dataPlan', ''); setValue('amount', '') }
    }, [networkProvider, setValue])

    useEffect(() => {
        if (dataPlan && selectedNetwork) {
            const plan = dataPlans[selectedNetwork as keyof typeof dataPlans]?.find(p => p.value === dataPlan)
            if (plan) setValue('amount', plan.amount)
        }
    }, [dataPlan, selectedNetwork, setValue])

    const availablePlans = selectedNetwork ? dataPlans[selectedNetwork as keyof typeof dataPlans] || [] : []
    const tokenAddress = getTokenAddress(watchedToken as 'USDC' | 'USDT')
    const amountRaw = watchedAmount && !isNaN(parseFloat(watchedAmount)) ? toTokenUnits(parseFloat(watchedAmount)) : BigInt(0)

    const { data: balance } = useReadContract({
        address: tokenAddress, abi: ERC20_ABI, functionName: 'balanceOf',
        args: address ? [address] : undefined, query: { enabled: !!address },
    })
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: tokenAddress, abi: ERC20_ABI, functionName: 'allowance',
        args: address ? [address, CONTRACTS.STRIMZ_PAYMENTS] : undefined, query: { enabled: !!address },
    })

    const formattedBalance = balance ? parseFloat(formatUnits(balance as bigint, TOKEN_DECIMALS)).toFixed(2) : '0.00'
    const hasInsufficientBalance = balance !== undefined && amountRaw > BigInt(0) && (balance as bigint) < amountRaw

    const { writeContract: writeApprove, data: approveHash, isPending: isApproving, error: approveError } = useWriteContract()
    const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({ hash: approveHash })
    const { writeContract: writePay, data: payHash, isPending: isPaying, error: payError } = useWriteContract()
    const { isSuccess: payConfirmed } = useWaitForTransactionReceipt({ hash: payHash })

    useEffect(() => { if (approveConfirmed) { refetchAllowance(); setPayStep('pay'); toast.success('Approval confirmed') } }, [approveConfirmed, refetchAllowance])
    useEffect(() => { if (payConfirmed) { setPayStep('done'); toast.success('Data purchase successful!'); setTimeout(() => onSuccess(), 1500) } }, [payConfirmed, onSuccess])
    useEffect(() => { if (approveError) toast.error(approveError.message.split('\n')[0]); if (payError) toast.error(payError.message.split('\n')[0]) }, [approveError, payError])

    const onSubmit = async (data: DataInput) => {
        if (!address) { toast.error('Wallet not connected'); return }
        setFormData(data)
        const currentAllowance = allowance as bigint | undefined
        if (!currentAllowance || currentAllowance < amountRaw) { setPayStep('approve') } else { setPayStep('pay') }
    }

    const handleApprove = () => {
        writeApprove({ address: tokenAddress, abi: ERC20_ABI, functionName: 'approve', args: [CONTRACTS.STRIMZ_PAYMENTS, amountRaw * BigInt(12)] })
    }

    const handlePay = () => {
        if (!formData || !address) return
        const preference = JSON.stringify({ type: 'data', provider: formData.networkProvider, phone: formData.phoneNumber, plan: formData.dataPlan, email: formData.email, amount: formData.amount })
        writePay({ address: CONTRACTS.STRIMZ_PAYMENTS, abi: STRIMZ_PAYMENTS_ABI, functionName: 'pay', args: [process.env.NEXT_PUBLIC_BILLS_MERCHANT_ID as `0x${string}`, tokenAddress, amountRaw, preference, BigInt(0)] })
    }

    if (payStep === 'approve') return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h4 className="font-sora font-[600] text-base text-primary">Approve {watchedToken}</h4>
                <p className="font-poppins text-sm text-[#58556A]">Allow Strimz to use {watchedAmount} {watchedToken} from your wallet.</p>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-[#F9FAFB] rounded-[8px] border border-[#E5E7EB]">
                <span className="font-poppins text-sm text-[#58556A]">Amount</span>
                <span className="font-sora font-[600] text-primary text-sm">{watchedAmount} {watchedToken}</span>
            </div>
            <button onClick={handleApprove} disabled={isApproving} className="w-full h-[40px] flex justify-center items-center rounded-[8px] bg-accent text-white font-poppins font-[600] text-[14px] disabled:opacity-70">
                {isApproving ? <span className="flex items-center gap-2"><FiLoader className="animate-spin w-4 h-4" /> Approving...</span> : 'Approve'}
            </button>
            <button onClick={() => setPayStep('form')} className="w-full text-sm font-poppins text-[#58556A] hover:text-accent transition-colors">← Back</button>
        </div>
    )

    if (payStep === 'pay') return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h4 className="font-sora font-[600] text-base text-primary">Confirm Purchase</h4>
                <p className="font-poppins text-sm text-[#58556A]">Review your data details before paying.</p>
            </div>
            <div className="flex flex-col gap-3 px-4 py-4 bg-[#F9FAFB] rounded-[8px] border border-[#E5E7EB]">
                <div className="flex justify-between"><span className="font-poppins text-xs text-[#9CA3AF] uppercase">Provider</span><span className="font-poppins text-sm font-[500] text-primary">{formData?.networkProvider}</span></div>
                <div className="flex justify-between"><span className="font-poppins text-xs text-[#9CA3AF] uppercase">Phone</span><span className="font-poppins text-sm font-[500] text-primary">{formData?.phoneNumber}</span></div>
                <div className="flex justify-between"><span className="font-poppins text-xs text-[#9CA3AF] uppercase">Plan</span><span className="font-poppins text-sm font-[500] text-primary">{formData?.dataPlan}</span></div>
                <hr className="border-[#E5E7EB]" />
                <div className="flex justify-between"><span className="font-poppins text-xs text-[#9CA3AF] uppercase">Total</span><span className="font-sora font-[600] text-primary">{formData?.amount} {formData?.token}</span></div>
            </div>
            <button onClick={handlePay} disabled={isPaying} className="w-full h-[40px] flex justify-center items-center rounded-[8px] bg-accent text-white font-poppins font-[600] text-[14px] disabled:opacity-70">
                {isPaying ? <span className="flex items-center gap-2"><FiLoader className="animate-spin w-4 h-4" /> Processing...</span> : `Pay ${formData?.amount} ${formData?.token}`}
            </button>
        </div>
    )

    if (payStep === 'done') return (
        <div className="w-full flex flex-col items-center gap-4 py-6">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center"><FiCheck className="w-7 h-7 text-green-500" /></div>
            <h4 className="font-sora font-[600] text-lg text-primary">Purchase Successful!</h4>
            <p className="font-poppins text-sm text-[#58556A] text-center">{formData?.dataPlan} data sent to {formData?.phoneNumber}</p>
        </div>
    )

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col">
                <label className="font-poppins text-[14px] text-[#58556A] leading-[24px]">Network provider</label>
                <Controller name="networkProvider" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full h-[44px] rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow font-poppins text-[14px] text-[#8E8C9C] px-4 focus:border-accent outline-none"><SelectValue placeholder="Select network" /></SelectTrigger>
                        <SelectContent>{networkProviders.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                    </Select>
                )} />
                {errors.networkProvider && <p className="text-red-500 text-[12px] font-poppins mt-1">{errors.networkProvider.message}</p>}
            </div>
            <FormInput label="Phone number" id="phoneNumber" type="text" placeholder="08030224350" register={register('phoneNumber')} error={errors.phoneNumber?.message} />
            <div className="w-full flex flex-col">
                <label className="font-poppins text-[14px] text-[#58556A] leading-[24px]">Select data plan</label>
                <Controller name="dataPlan" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={!selectedNetwork}>
                        <SelectTrigger className="w-full h-[44px] rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow font-poppins text-[14px] text-[#8E8C9C] px-4 focus:border-accent outline-none"><SelectValue placeholder={selectedNetwork ? "Select data plan" : "Select network first"} /></SelectTrigger>
                        <SelectContent>{availablePlans.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                    </Select>
                )} />
                {errors.dataPlan && <p className="text-red-500 text-[12px] font-poppins mt-1">{errors.dataPlan.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="w-full flex flex-col">
                    <label className="font-poppins text-[14px] text-[#58556A] leading-[24px]">Token</label>
                    <Controller name="token" control={control} render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full h-[44px] rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow font-poppins text-[14px] text-[#58556A] px-4 focus:border-accent outline-none"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USDC"><div className="flex items-center gap-1.5"><Image src={usdcIcon} alt="USDC" width={20} height={20} /><span>USDC</span></div></SelectItem>
                                <SelectItem value="USDT"><div className="flex items-center gap-1.5"><Image src={usdtIcon} alt="USDT" width={20} height={20} /><span>USDT</span></div></SelectItem>
                            </SelectContent>
                        </Select>
                    )} />
                </div>
                <FormInput label="Amount" id="amount" type="text" placeholder="Amount" register={register('amount')} error={errors.amount?.message} className="bg-[#E5E7EB] cursor-not-allowed" />
            </div>
            <FormInput label="Email address" id="email" type="email" placeholder="Email address" register={register('email')} error={errors.email?.message} />
            <div className="flex items-center justify-between">
                <span className="font-poppins text-xs text-[#9CA3AF]">Available balance</span>
                <span className="font-poppins text-xs font-[500] text-primary">{formattedBalance} {watchedToken}</span>
            </div>
            {hasInsufficientBalance && <p className="text-red-500 text-xs font-poppins">Insufficient {watchedToken} balance</p>}
            <button type="submit" disabled={isSubmitting || hasInsufficientBalance || !address} className="w-full h-[40px] flex justify-center items-center rounded-[8px] bg-accent text-white font-poppins font-[600] text-[14px] disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? 'Processing...' : 'Purchase data'}
            </button>
            {!address && <p className="text-center text-xs font-poppins text-[#9CA3AF]">Connect your wallet to continue</p>}
        </form>
    )
}

export default DataForm