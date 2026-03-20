/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
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
import { apiFetch, apiGet } from '@/lib/api';

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
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'other', label: 'Other' },
];

const merchantSetupSchema = z.object({
    businessName: z.string().min(2, 'Business name must be at least 2 characters').max(100),
    businessLocation: z.string().min(1, 'Business location is required'),
    businessType: z.string().min(1, 'Business type is required'),
    walletAddress: z
        .string()
        .min(1, 'Wallet address is required')
        .regex(/^0x[a-fA-F0-9]{40}$/, 'Must be a valid Ethereum address (0x...)'),
});

type MerchantSetupInput = z.infer<typeof merchantSetupSchema>;

const BusinessInfoSettings = () => {
    const router = useRouter();

    // Check if merchant already exists — redirect to dashboard
    useEffect(() => {
        const checkMerchant = async () => {
            try {
                const res = await apiGet('/merchants/me');
                if (res.success && (res.data || res.message)) {
                    router.push('/business');
                }
            } catch {}
        };
        checkMerchant();
    }, [router]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting, isValid, isDirty },
    } = useForm<MerchantSetupInput>({
        resolver: zodResolver(merchantSetupSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: MerchantSetupInput) => {
        try {
            // Get stored user email
            const storedUser = localStorage.getItem('strimz_user');
            const user = storedUser ? JSON.parse(storedUser) : null;
            const email = user?.email || '';

            const res = await apiFetch('/merchants/register', {
                method: 'POST',
                body: JSON.stringify({
                    walletAddress: data.walletAddress,
                    name: data.businessName,
                    businessEmail: email,
                }),
            });

            if (!res.success) {
                const errorMsg = res.error || res.message || 'Registration failed';
                toast.error(typeof errorMsg === 'string' ? errorMsg : 'Registration failed', {
                    position: 'top-right',
                });
                return;
            }

            const resData = res.data || res.message;

            // Save API keys info if returned
            if (resData?.keys) {
                localStorage.setItem('strimz_merchant_keys', JSON.stringify(resData.keys));
            }

            toast.success('Merchant account created! Your API keys are ready.', {
                position: 'top-right',
                duration: 5000,
            });

            router.push('/business');
        } catch (error: any) {
            console.error('Failed to register merchant:', error);
            toast.error('Something went wrong. Please try again.', {
                position: 'top-right',
            });
        }
    };

    return (
        <AuthFormContainer title="Set Up Your Business">
            <p className="font-poppins text-center text-[14px] text-[#58556A] mt-2">
                Tell us about your business to start accepting payments
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3 mt-6">
                <FormInput
                    label="Business Name"
                    id="businessName"
                    type="text"
                    placeholder="Acme Inc."
                    register={register('businessName')}
                    error={errors.businessName?.message}
                />

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="businessLocation"
                        className="font-poppins text-[14px] font-[500] text-[#1A1A2E] leading-[24px]"
                    >
                        Business Location
                    </label>
                    <Controller
                        name="businessLocation"
                        control={control}
                        render={({ field }) => (
                            <CountrySelector
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {errors.businessLocation && (
                        <p className="font-poppins text-[12px] text-red-500 mt-1">
                            {errors.businessLocation.message}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="businessType"
                        className="font-poppins text-[14px] font-[500] text-[#1A1A2E] leading-[24px]"
                    >
                        Business Type
                    </label>
                    <Controller
                        name="businessType"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="w-full h-[48px] rounded-[8px] border border-[#E5E7EB] bg-white font-poppins text-[14px]">
                                    <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {businessTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.businessType && (
                        <p className="font-poppins text-[12px] text-red-500 mt-1">
                            {errors.businessType.message}
                        </p>
                    )}
                </div>

                <FormInput
                    label="Settlement Wallet Address"
                    id="walletAddress"
                    type="text"
                    placeholder="0x..."
                    register={register('walletAddress')}
                    error={errors.walletAddress?.message}
                />
                <p className="font-poppins text-[11px] text-[#9CA3AF] -mt-2">
                    This is where you&apos;ll receive USDC payments. Use a wallet you control on Base.
                </p>

                <SubmitButton
                    isSubmitting={isSubmitting}
                    disabled={!isDirty || !isValid}
                    text="Create Merchant Account"
                />
            </form>
        </AuthFormContainer>
    );
};

export default BusinessInfoSettings;