/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { dataSchema, DataInput, networkProviders, dataPlans } from '@/types/utilityBills'
import FormInput from '@/components/auth/shared/FormInput'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'
import usdcIcon from "@/public/brands/USDC.svg"
import usdtIcon from "@/public/brands/USDT.svg"

interface DataFormProps {
    onSuccess: () => void
}

const DataForm = ({ onSuccess }: DataFormProps) => {
    const [selectedNetwork, setSelectedNetwork] = useState<string>('')

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<DataInput>({
        resolver: zodResolver(dataSchema),
        mode: 'onChange',
        defaultValues: {
            networkProvider: '',
            phoneNumber: '',
            dataPlan: '',
            amount: '',
            token: 'USDC',
            email: '',
        },
    })

    const networkProvider = watch('networkProvider')
    const dataPlan = watch('dataPlan')

    useEffect(() => {
        if (networkProvider) {
            setSelectedNetwork(networkProvider)
            setValue('dataPlan', '')
            setValue('amount', '')
        }
    }, [networkProvider, setValue])

    useEffect(() => {
        if (dataPlan && selectedNetwork) {
            const plans = dataPlans[selectedNetwork as keyof typeof dataPlans]
            const plan = plans?.find(p => p.value === dataPlan)
            if (plan) {
                setValue('amount', plan.amount)
            }
        }
    }, [dataPlan, selectedNetwork, setValue])

    const onSubmit = async (data: DataInput) => {
        try {
            console.log('Data purchase data:', data)

            // TODO: Replace with actual API call
            // await purchaseData(data);

            onSuccess()
        } catch (error: any) {
            console.error('Failed to purchase data:', error)
            toast.error(error?.message || 'Purchase failed. Please try again.', {
                position: 'top-right',
            })
        }
    }

    const availablePlans = selectedNetwork
        ? dataPlans[selectedNetwork as keyof typeof dataPlans] || []
        : []

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
            {/* Network Provider */}
            <div className="w-full flex flex-col">
                <label className="font-poppins text-[14px] text-[#58556A] leading-[24px]">
                    Network provider
                </label>
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
                                    <SelectItem key={provider.value} value={provider.value}>
                                        {provider.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.networkProvider && (
                    <p className="text-red-500 text-[12px] font-poppins mt-1">
                        {errors.networkProvider.message}
                    </p>
                )}
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

            {/* Data Plan */}
            <div className="w-full flex flex-col">
                <label className="font-poppins text-[14px] text-[#58556A] leading-[24px]">
                    Select data plan
                </label>
                <Controller
                    name="dataPlan"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!selectedNetwork}
                        >
                            <SelectTrigger className="w-full h-[44px] rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow font-poppins text-[14px] text-[#8E8C9C] px-4 focus:border-accent outline-none">
                                <SelectValue placeholder={selectedNetwork ? "Select data plan" : "Select network first"} />
                            </SelectTrigger>
                            <SelectContent>
                                {availablePlans.map((plan) => (
                                    <SelectItem key={plan.value} value={plan.value}>
                                        {plan.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.dataPlan && (
                    <p className="text-red-500 text-[12px] font-poppins mt-1">
                        {errors.dataPlan.message}
                    </p>
                )}
            </div>

            {/* Token and Amount */}
            <div className="grid grid-cols-2 gap-4">
                {/* Token */}
                <div className="w-full flex flex-col">
                    <label className="font-poppins text-[14px] text-[#58556A] leading-[24px]">
                        Token
                    </label>
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
                                            <Image src={usdcIcon} alt="USDC" width={20} height={20} className="object-contain" />
                                            <span>USDC</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="USDT">
                                        <div className="flex items-center gap-1.5">
                                            <Image src={usdtIcon} alt="USDT" width={20} height={20} className="object-contain" />
                                            <span>USDT</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.token && (
                        <p className="text-red-500 text-[12px] font-poppins mt-1">
                            {errors.token.message}
                        </p>
                    )}
                </div>

                {/* Amount */}
                <FormInput
                    label="Amount"
                    id="amount"
                    type="text"
                    placeholder="Amount"
                    register={register('amount')}
                    error={errors.amount?.message}
                    className="bg-[#E5E7EB] cursor-not-allowed"
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

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[40px] flex justify-center items-center rounded-[8px] bg-accent text-[#FFFFFF] font-poppins font-[600] shadow-joinWaitlistBtnShadow text-shadow text-[14px] disabled:opacity-80 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Processing...' : 'Purchase data'}
            </button>
        </form>
    )
}

export default DataForm
