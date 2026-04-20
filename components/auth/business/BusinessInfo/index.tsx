/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Wallet } from 'lucide-react';
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
import { ACTIVE_CHAIN_ID } from '@/config/wagmi';

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

    const { address, isConnected, chain } = useAccount();
    const { connect, isPending: isConnecting } = useConnect();
    const { disconnect } = useDisconnect();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting, isValid, isDirty },
    } = useForm<MerchantSetupInput>({
        resolver: zodResolver(merchantSetupSchema),
        mode: 'onChange',
        defaultValues: {
            walletAddress: '',
        },
    });

    const walletAddress = watch('walletAddress');

    useEffect(() => {
        if (address && isConnected) {
            setValue('walletAddress', address, { shouldValidate: true });
        }
    }, [address, isConnected, setValue]);

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

    const handleConnectWallet = () => {
        connect({ connector: injected(), chainId: ACTIVE_CHAIN_ID });
    };

    const handleDisconnect = () => {
        disconnect();
        setValue('walletAddress', '', { shouldValidate: true });
    };

    const onSubmit = async (data: MerchantSetupInput) => {
        try {
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

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="walletAddress"
                        className="font-poppins text-[14px] font-[500] text-[#1A1A2E] leading-[24px]"
                    >
                        Settlement Wallet Address
                    </label>
                    {isConnected ? (
                        <div className="w-full flex items-center gap-2">
                            <div className="flex-1 h-[48px] px-4 rounded-[8px] border border-[#E5E7EB] bg-[#F0FDF4] flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                                <span className="font-mono text-[14px] text-[#1A1A2E] truncate">
                                    {address}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleDisconnect}
                                className="h-[48px] px-4 rounded-[8px] border border-[#E5E7EB] bg-white hover:bg-red-50 hover:border-red-200 text-[#58556A] hover:text-red-600 transition-colors text-sm font-poppins flex items-center gap-2"
                            >
                                Disconnect
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="0x..."
                                {...register('walletAddress')}
                                className="flex-1 h-[48px] px-4 rounded-[8px] border border-[#E5E7EB] bg-white font-mono text-[14px] text-[#1A1A2E] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                            />
                            <button
                                type="button"
                                onClick={handleConnectWallet}
                                disabled={isConnecting}
                                className="h-[48px] px-4 rounded-[8px] bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white transition-colors text-sm font-poppins font-[500] flex items-center gap-2 whitespace-nowrap"
                            >
                                <Wallet className="w-4 h-4" />
                                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                            </button>
                        </div>
                    )}
                    {errors.walletAddress && (
                        <p className="font-poppins text-[12px] text-red-500">
                            {errors.walletAddress.message}
                        </p>
                    )}
                    {chain && chain.id !== ACTIVE_CHAIN_ID && (
                        <p className="font-poppins text-[12px] text-yellow-600 mt-1">
                            Please switch to Base network in your wallet
                        </p>
                    )}
                    <p className="font-poppins text-[11px] text-[#9CA3AF] mt-1">
                        This is where you&apos;ll receive USDC payments.{' '}
                        {isConnected ? (
                            <span className="text-green-600 font-medium">Wallet connected.</span>
                        ) : (
                            <span>Make sure you can connect this wallet if needed.</span>
                        )}
                    </p>
                </div>

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
