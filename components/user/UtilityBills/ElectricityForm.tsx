/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { electricitySchema, ElectricityInput, electricityProviders, meterTypes } from '@/types/utilityBills'
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

interface ElectricityFormProps {
    onSuccess: () => void
}

const ElectricityForm = ({ onSuccess }: ElectricityFormProps) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ElectricityInput>({
        resolver: zodResolver(electricitySchema),
        mode: 'onChange',
        defaultValues: {
            electricityProvider: '',
            meterType: '',
            meterNumber: '',
            amount: '',
            token: 'USDC',
            phoneNumber: '',
            email: '',
        },
    })

    const onSubmit = async (data: ElectricityInput) => {
        try {
            console.log('Electricity purchase data:', data)

            // TODO: Replace with actual API call
            // await purchaseElectricity(data);

            onSuccess()
        } catch (error: any) {
            console.error('Failed to purchase electricity:', error)
            toast.error(error?.message || 'Purchase failed. Please try again.', {
                position: 'top-right',
            })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
            {/* Electricity Provider */}
            <div className="w-full flex flex-col gap-2">
                <label className="font-poppins text-[14px] text-[#58556A] leading-[24px]">
                    Electricity provider
                </label>
                <Controller
                    name="electricityProvider"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full h-[44px] rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow font-poppins text-[14px] text-[#8E8C9C] px-4 focus:border-accent outline-none">
                                <SelectValue placeholder="Select electricity provider" />
                            </SelectTrigger>
                            <SelectContent>
                                {electricityProviders.map((provider) => (
                                    <SelectItem key={provider.value} value={provider.value}>
                                        {provider.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.electricityProvider && (
                    <p className="text-red-500 text-[12px] font-poppins">
                        {errors.electricityProvider.message}
                    </p>
                )}
            </div>

            {/* Meter Type */}
            <div className="w-full flex flex-col gap-2">
                <label className="font-poppins text-[14px] text-[#58556A] leading-[24px]">
                    Account/meter type
                </label>
                <Controller
                    name="meterType"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full h-[44px] rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow font-poppins text-[14px] text-[#8E8C9C] px-4 focus:border-accent outline-none">
                                <SelectValue placeholder="Select meter type" />
                            </SelectTrigger>
                            <SelectContent>
                                {meterTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.meterType && (
                    <p className="text-red-500 text-[12px] font-poppins">
                        {errors.meterType.message}
                    </p>
                )}
            </div>

            {/* Meter Number */}
            <FormInput
                label="Meter number"
                id="meterNumber"
                type="text"
                placeholder="Meter number"
                register={register('meterNumber')}
                error={errors.meterNumber?.message}
            />

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
                    placeholder="Enter amount"
                    register={register('amount')}
                    error={errors.amount?.message}
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
                {isSubmitting ? 'Processing...' : 'Purchase electricity'}
            </button>
        </form>
    )
}

export default ElectricityForm
