/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { businessInfoSchema, BusinessInfoInput } from '@/STRIMZ/types/auth';
import AuthFormContainer from '@/components/auth/shared/AuthFormContainer';
import FormInput from '@/components/auth/shared/FormInput';
import SubmitButton from '@/components/auth/shared/SubmitButton';
import CountrySelector from '@/components/auth/shared/CountrySelector';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

/**
 * Business types for selection
 */
const businessTypes = [
    { value: 'online_retail', label: 'Online Store/Retail' },
    { value: 'services_saas', label: 'Services/Freelance/SaaS' },
    { value: 'physical_store', label: 'Physical Store' },
    { value: 'non_profit', label: 'Non-profit' },
    { value: 'web3_crypto', label: 'Web3/Crypto Business' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'agency', label: 'Agency' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'subscription', label: 'Subscription Service' },
    { value: 'other', label: 'Other' },
];

/**
 * Business information form component
 */
const BusinessInfoSettings = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting, isValid, isDirty },
        reset,
    } = useForm<BusinessInfoInput>({
        resolver: zodResolver(businessInfoSchema),
        mode: 'onChange',
        defaultValues: {
            businessName: '',
            businessLocation: '',
            businessType: '',
        },
    });

    const onSubmit = async (data: BusinessInfoInput) => {
        try {
            console.log('Business info data:', data);

            // TODO: Replace with actual API call
            // await submitBusinessInfo(data);

            toast.success('Business information setup successful', {
                position: 'top-right',
            });

            router.push('/auth/business/verify-email');
        } catch (error: any) {
            console.error('Failed to setup business info:', error);
            toast.error(error?.message || 'Setup failed. Please try again.', {
                position: 'top-right',
            });
        } finally {
            reset();
        }
    };

    return (
        <AuthFormContainer title="Tell us about your business" className="md:w-[400px]">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3 mt-6">
                <FormInput
                    label="Business Name"
                    id="businessName"
                    type="text"
                    placeholder="Strimz Inc."
                    register={register('businessName')}
                    error={errors.businessName?.message}
                />

                <Controller
                    name="businessLocation"
                    control={control}
                    render={({ field }) => (
                        <CountrySelector
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.businessLocation?.message}
                            label="Business Location"
                            placeholder="Select country"
                        />
                    )}
                />

                <div className="w-full flex flex-col">
                    <label className="font-poppins text-[14px] text-[#58556A] leading-[24px] mb-1">
                        Business Type
                    </label>
                    <Controller
                        name="businessType"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger
                                    className={`w-full h-[44px] rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow font-poppins text-[14px] text-[#8E8C9C] px-4 outline-none focus:ring-0 transition duration-300 focus:border-accent ${errors.businessType ? 'border-red-500' : 'border-[#E5E7EB]'
                                        }`}
                                >
                                    <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {businessTypes.map((type) => (
                                        <SelectItem
                                            key={type.value}
                                            value={type.value}
                                            className="cursor-pointer hover:bg-[#F9FAFB]"
                                        >
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.businessType && (
                        <p className="text-red-500 text-[12px] font-poppins mt-1">
                            {errors.businessType.message}
                        </p>
                    )}
                </div>

                <SubmitButton
                    isSubmitting={isSubmitting}
                    disabled={!isDirty || !isValid}
                    text="Continue"
                    className="mt-3"
                />
            </form>
        </AuthFormContainer>
    );
};

export default BusinessInfoSettings;
