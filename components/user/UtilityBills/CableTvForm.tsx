/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { cableTvSchema, CableTvInput, cableProviders, cablePlans } from '@/types/utilityBills'
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

interface CableTvFormProps {
    onSuccess: () => void
}

const CableTvForm = ({ onSuccess }: CableTvFormProps) => {
    const [selectedProvider, setSelectedProvider] = useState<string>('')

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CableTvInput>({
        resolver: zodResolver(cableTvSchema),
        mode: 'onChange',
        defaultValues: {
            cableProvider: '',
            iucNumber: '',
            cablePlan: '',
            amount: '',
            token: 'USDC',
            phoneNumber: '',
            email: '',
        },
    })

    const cableProvider = watch('cableProvider')
    const cablePlan = watch('cablePlan')

    useEffect(() => {
        if (cableProvider) {
            setSelectedProvider(cableProvider)
            setValue('cablePlan', '')
            setValue('amount', '')
        }
    }, [cableProvider, setValue])

    useEffect(() => {
        if (cablePlan && selectedProvider) {
            const plans = cablePlans[selectedProvider as keyof typeof cablePlans]
            const plan = plans?.find(p => p.value === cablePlan)
            if (plan) {
                setValue('amount', plan.amount)
            }
        }
    }, [cablePlan, selectedProvider, setValue])

    const onSubmit = async (data: CableTvInput) => {
        try {
            console.log('Cable TV subscription data:', data)

            // TODO: Replace with actual API call
            // await purchaseCableSubscription(data);

            onSuccess()
        } catch (error: any) {
            console.error('Failed to purchase subscription:', error)
            toast.error(error?.message || 'Purchase failed. Please try again.', {
                position: 'top-right',
            })
        }
    }

    const availablePlans = selectedProvider
        ? cablePlans[selectedProvider as keyof typeof cablePlans] || []
        : []

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
            {/* Cable Provider */}
            <div className="w-full flex flex-col gap-2">
                <label className="font-poppins text-[14px] text-[#58556A] leading-[24px]">
                    Cable provider
                </label>
                <Controller
                    name="cableProvider"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full h-[44px] rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow font-poppins text-[14px] text-[#8E8C9C] px-4 focus:border-accent outline-none">
                                <SelectValue placeholder="Select cable provider" />
                            </SelectTrigger>
                            <SelectContent>
                                {cableProviders.map((provider) => (
                                    <SelectItem key={provider.value} value={provider.value}>
                                        {provider.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.cableProvider && (
                    <p className="text-red-500 text-[12px] font-poppins">
                        {errors.cableProvider.message}
                    </p>
                )}
            </div>

            {/* IUC Number */}
            <FormInput
                label="IUC number"
                id="iucNumber"
                type="text"
                placeholder="Enter IUC number"
                register={register('iucNumber')}
                error={errors.iucNumber?.message}
            />

            {/* Cable Plan */}
            <div className="w-full flex flex-col gap-2">
                <label className="font-poppins text-[14px] text-[#58556A] leading-[24px]">
                    Select a plan
                </label>
                <Controller
                    name="cablePlan"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!selectedProvider}
                        >
                            <SelectTrigger className="w-full h-[44px] rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow font-poppins text-[14px] text-[#8E8C9C] px-4 focus:border-accent outline-none">
                                <SelectValue placeholder={selectedProvider ? "Select plan" : "Select provider first"} />
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
                {errors.cablePlan && (
                    <p className="text-red-500 text-[12px] font-poppins">
                        {errors.cablePlan.message}
                    </p>
                )}
            </div>

            {/* Token and Amount */}
            <div className="grid grid-cols-2 gap-4">
                {/* Token */}
                <div className="w-full flex flex-col gap-2">
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
                        <p className="text-red-500 text-[12px] font-poppins">
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

            {/* Phone Number */}
            <FormInput
                label="Phone number"
                id="phoneNumber"
                type="text"
                placeholder="Phone number"
                register={register('phoneNumber')}
                error={errors.phoneNumber?.message}
            />

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
                {isSubmitting ? 'Processing...' : 'Purchase subscription'}
            </button>
        </form>
    )
}

export default CableTvForm
