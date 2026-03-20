/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { airtimeSchema, AirtimeInput, networkProviders } from '@/types/utilityBills'
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

interface AirtimeFormProps {
    onSuccess: () => void
}

const AirtimeForm = ({ onSuccess }: AirtimeFormProps) => {
    const {
        register,
        handleSubmit,
        control,
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

    const onSubmit = async (data: AirtimeInput) => {
        try {
            console.log('Airtime purchase data:', data)

            // TODO: Replace with actual API call
            // await purchaseAirtime(data);

            onSuccess()
        } catch (error: any) {
            console.error('Failed to purchase airtime:', error)
            toast.error(error?.message || 'Purchase failed. Please try again.', {
                position: 'top-right',
            })
        }
    }

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

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[40px] flex justify-center items-center rounded-[8px] bg-accent text-[#FFFFFF] font-poppins font-[600] shadow-joinWaitlistBtnShadow text-shadow text-[14px] disabled:opacity-80 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Processing...' : 'Purchase airtime'}
            </button>
        </form>
    )
}

export default AirtimeForm
