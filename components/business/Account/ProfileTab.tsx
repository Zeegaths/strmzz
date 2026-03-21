'use client'
import React, { useState, useEffect } from 'react'
import { FiUser, FiLock } from 'react-icons/fi'
import { Wallet } from 'lucide-react'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPut } from '@/lib/api'
import { toast } from 'sonner'
import { getStoredUser } from '@/lib/auth'

const businessNameSchema = z.object({
    businessName: z.string().min(2, 'Too short!').max(100, 'Too long!'),
})

const emailSchema = z.object({
    email: z.string().email('Invalid email'),
})

const walletSchema = z.object({
    walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Must be a valid Ethereum address'),
})

const ProfileTab = () => {
    const queryClient = useQueryClient()
    const storedUser = getStoredUser()

    // Fetch merchant profile
    const { data: merchantRes, isLoading } = useQuery({
        queryKey: ['merchant-profile'],
        queryFn: () => apiGet('/merchants/me'),
    })

    const merchant = merchantRes?.data || merchantRes?.message || null

    // Local state initialized from API data
    const [businessName, setBusinessName] = useState('')
    const [email, setEmail] = useState('')
    const [walletAddress, setWalletAddress] = useState('')
    const [username, setUsername] = useState('')

    const [isEditingBusinessName, setIsEditingBusinessName] = useState(false)
    const [isEditingEmail, setIsEditingEmail] = useState(false)
    const [isEditingWallet, setIsEditingWallet] = useState(false)

    const [businessNameInput, setBusinessNameInput] = useState('')
    const [emailInput, setEmailInput] = useState('')
    const [walletInput, setWalletInput] = useState('')

    const [businessNameError, setBusinessNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [walletError, setWalletError] = useState('')

    // Populate from API data
    useEffect(() => {
        if (merchant) {
            setBusinessName(merchant.name || '')
            setEmail(merchant.businessEmail || '')
            setWalletAddress(merchant.walletAddress || '')
            setBusinessNameInput(merchant.name || '')
            setEmailInput(merchant.businessEmail || '')
            setWalletInput(merchant.walletAddress || '')
        }
        if (storedUser) {
            setUsername(storedUser.username || '')
        }
    }, [merchant])

    // Update merchant mutation
    const updateMerchant = useMutation({
        mutationFn: (data: any) => apiPut('/merchants/me', data),
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ['merchant-profile'] })
                toast.success('Profile updated!', { position: 'top-right' })
            } else {
                toast.error(res.error || 'Update failed', { position: 'top-right' })
            }
        },
    })

    // Update wallet mutation
    const updateWallet = useMutation({
        mutationFn: (walletAddress: string) => apiPut('/merchants/me/wallet', { walletAddress }),
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ['merchant-profile'] })
                toast.success('Wallet updated!', { position: 'top-right' })
            } else {
                toast.error(res.error || 'Update failed', { position: 'top-right' })
            }
        },
    })

    const handleBusinessNameUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        try {
            businessNameSchema.parse({ businessName: businessNameInput })
            updateMerchant.mutate({ name: businessNameInput })
            setBusinessName(businessNameInput)
            setIsEditingBusinessName(false)
            setBusinessNameError('')
        } catch (error) {
            if (error instanceof z.ZodError) {
                setBusinessNameError(error.errors[0]?.message || 'Invalid input')
            }
        }
    }

    const handleEmailUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        try {
            emailSchema.parse({ email: emailInput })
            updateMerchant.mutate({ businessEmail: emailInput })
            setEmail(emailInput)
            setIsEditingEmail(false)
            setEmailError('')
        } catch (error) {
            if (error instanceof z.ZodError) {
                setEmailError(error.errors[0]?.message || 'Invalid input')
            }
        }
    }

    const handleWalletUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        try {
            walletSchema.parse({ walletAddress: walletInput })
            updateWallet.mutate(walletInput)
            setWalletAddress(walletInput)
            setIsEditingWallet(false)
            setWalletError('')
        } catch (error) {
            if (error instanceof z.ZodError) {
                setWalletError(error.errors[0]?.message || 'Invalid input')
            }
        }
    }

    const truncateAddress = (addr: string) => {
        if (!addr) return '—'
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    if (isLoading) {
        return (
            <div className="w-full max-w-[516px] mx-auto flex flex-col gap-4 py-6">
                <div className="w-full bg-white rounded-[12px] border border-[#E5E7EB] p-6">
                    <div className="animate-pulse flex flex-col gap-4">
                        <div className="h-6 w-48 bg-gray-100 rounded" />
                        <div className="h-4 w-64 bg-gray-100 rounded" />
                        <div className="h-4 w-40 bg-gray-100 rounded" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-[516px] mx-auto flex flex-col gap-4 py-6">
            {/* Business Profile Section */}
            <div className="w-full bg-white rounded-[12px] border border-[#E5E7EB] p-6 flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="w-[40px] h-[40px] rounded-full bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-sora font-[600] text-lg text-primary">{businessName}</h3>
                        <p className="text-sm text-[#58556A] font-poppins">{email}</p>
                    </div>
                </div>

                {/* Avatar Upload */}
                <div className="flex items-center gap-4">
                    <div className="w-[80px] h-[80px] rounded-full bg-[#E5E7EB] flex items-center justify-center">
                        <FiUser className="w-10 h-10 text-[#6B7280]" />
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-[8px] border border-[#E5E7EB] bg-white text-sm font-poppins font-[500] text-primary hover:bg-[#F9FAFB] transition-colors">
                            Change
                        </button>
                        <button className="px-4 py-2 rounded-[8px] border border-[#E5E7EB] bg-white text-sm font-poppins font-[500] text-[#DC2626] hover:bg-[#FEF2F2] transition-colors">
                            Remove
                        </button>
                    </div>
                </div>

                {/* Business Name */}
                <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                    <div className="w-full flex flex-col gap-1">
                        <span className="text-sm font-poppins font-[500] text-primary">Business name</span>
                        {!isEditingBusinessName ? (
                            <span className="text-sm font-poppins text-[#58556A]">{businessName}</span>
                        ) : (
                            <form onSubmit={handleBusinessNameUpdate} className='w-full flex flex-col gap-1'>
                                <input
                                    type="text"
                                    value={businessNameInput}
                                    onChange={(e) => setBusinessNameInput(e.target.value)}
                                    className="w-full rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow h-[40px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent border-[#E5E7EB]"
                                />
                                {businessNameError && <p className="text-xs text-rose-600">{businessNameError}</p>}
                                <div className='flex gap-2 mt-1'>
                                    <button type="button" onClick={() => { setIsEditingBusinessName(false); setBusinessNameInput(businessName); setBusinessNameError('') }} className="px-3 py-1.5 text-sm font-poppins font-[500] border border-[#E5E7EB] rounded-[6px] bg-white text-primary hover:bg-[#F9FAFB] transition-colors">Cancel</button>
                                    <button type="submit" className="px-3 py-1.5 text-sm font-poppins font-[500] bg-accent text-white rounded-[6px] hover:opacity-90 transition-opacity">{updateMerchant.isPending ? 'Saving...' : 'Save'}</button>
                                </div>
                            </form>
                        )}
                    </div>
                    {!isEditingBusinessName && (
                        <button onClick={() => { setIsEditingBusinessName(true); setBusinessNameInput(businessName) }} className="text-sm font-poppins font-[500] text-primary hover:text-accent transition-colors">Edit</button>
                    )}
                </div>

                {/* Username */}
                <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                    <div className="w-full flex flex-col gap-1">
                        <span className="text-sm font-poppins font-[500] text-primary">Username</span>
                        <span className="text-sm font-poppins text-[#58556A]">{username || '—'}</span>
                    </div>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                    <div className="w-full flex flex-col gap-1">
                        <span className="text-sm font-poppins font-[500] text-primary">Email</span>
                        {!isEditingEmail ? (
                            <span className="text-sm font-poppins text-[#58556A]">{email}</span>
                        ) : (
                            <form onSubmit={handleEmailUpdate} className='w-full flex flex-col gap-1'>
                                <input
                                    type="email"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    className="w-full rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow h-[40px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent border-[#E5E7EB]"
                                />
                                {emailError && <p className="text-xs text-rose-600">{emailError}</p>}
                                <div className='flex gap-2 mt-1'>
                                    <button type="button" onClick={() => { setIsEditingEmail(false); setEmailInput(email); setEmailError('') }} className="px-3 py-1.5 text-sm font-poppins font-[500] border border-[#E5E7EB] rounded-[6px] bg-white text-primary hover:bg-[#F9FAFB] transition-colors">Cancel</button>
                                    <button type="submit" className="px-3 py-1.5 text-sm font-poppins font-[500] bg-accent text-white rounded-[6px] hover:opacity-90 transition-opacity">{updateMerchant.isPending ? 'Saving...' : 'Save'}</button>
                                </div>
                            </form>
                        )}
                    </div>
                    {!isEditingEmail && (
                        <button onClick={() => { setIsEditingEmail(true); setEmailInput(email) }} className="text-sm font-poppins font-[500] text-primary hover:text-accent transition-colors">Edit</button>
                    )}
                </div>

                {/* Wallet Address */}
                <div className="flex items-center justify-between py-2">
                    <div className="w-full flex flex-col gap-1">
                        <span className="text-sm font-poppins font-[500] text-primary flex items-center gap-2">
                            <Wallet className="w-4 h-4" /> Settlement Wallet
                        </span>
                        {!isEditingWallet ? (
                            <span className="text-sm font-mono text-[#58556A]">{walletAddress ? truncateAddress(walletAddress) : '—'}</span>
                        ) : (
                            <form onSubmit={handleWalletUpdate} className='w-full flex flex-col gap-1'>
                                <input
                                    type="text"
                                    value={walletInput}
                                    onChange={(e) => setWalletInput(e.target.value)}
                                    placeholder="0x..."
                                    className="w-full rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow h-[40px] font-mono text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent border-[#E5E7EB]"
                                />
                                {walletError && <p className="text-xs text-rose-600">{walletError}</p>}
                                <div className='flex gap-2 mt-1'>
                                    <button type="button" onClick={() => { setIsEditingWallet(false); setWalletInput(walletAddress); setWalletError('') }} className="px-3 py-1.5 text-sm font-poppins font-[500] border border-[#E5E7EB] rounded-[6px] bg-white text-primary hover:bg-[#F9FAFB] transition-colors">Cancel</button>
                                    <button type="submit" className="px-3 py-1.5 text-sm font-poppins font-[500] bg-accent text-white rounded-[6px] hover:opacity-90 transition-opacity">{updateWallet.isPending ? 'Saving...' : 'Save'}</button>
                                </div>
                            </form>
                        )}
                    </div>
                    {!isEditingWallet && (
                        <button onClick={() => { setIsEditingWallet(true); setWalletInput(walletAddress) }} className="text-sm font-poppins font-[500] text-primary hover:text-accent transition-colors">Edit</button>
                    )}
                </div>
            </div>

            {/* Security Section */}
            <div className="w-full bg-white rounded-[12px] border border-[#E5E7EB] p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-[40px] h-[40px] rounded-full bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center">
                        <FiLock className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-sora font-[600] text-lg text-primary">Security</h3>
                </div>

                <div className="flex items-center justify-between py-2">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-poppins font-[500] text-primary">Password</span>
                        <span className="text-sm font-poppins text-[#58556A]">••••••••••••</span>
                    </div>
                    <button
                        onClick={() => toast.info('Password change coming soon', { position: 'top-right' })}
                        className="text-sm font-poppins font-[500] text-primary hover:text-accent transition-colors"
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileTab