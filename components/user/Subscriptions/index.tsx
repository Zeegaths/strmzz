'use client'
import React, { useState, useMemo } from 'react'
import SubscriptionCard from './SubscriptionCard'
import netflixIcon from "@/public/history/netflix.png"
import spotifyIcon from "@/public/history/spotify.png"
import tvIcon from "@/public/history/tv.png"
import { IoAdd } from 'react-icons/io5'
import Link from 'next/link'
import { useUserSubscriptions } from '@/app/providers/Web3Provider'

interface ApiSubscription {
    id: string;
    onChainSubscriptionId: string;
    merchantId: string;
    subscriber: string;
    token: string;
    amount: string | number;
    interval: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    status: 'active' | 'paused' | 'cancelled' | 'past_due';
    chargeCount: number;
    failedChargeCount: number;
    lastChargeAt?: string;
    nextChargeAt?: string;
    customerEmail?: string;
    metadata?: Record<string, any>;
    createdAt: string;
}

interface SubscriptionDisplay {
    id: string;
    icon: any;
    name: string;
    plan: string;
    amount: string;
    nextBillingDate: string;
    status: 'active' | 'expired' | 'cancelled'
}

const DEFAULT_ICONS = [netflixIcon, spotifyIcon, tvIcon]

function transformSubscription(sub: ApiSubscription, index: number): SubscriptionDisplay {
    const iconIndex = index % DEFAULT_ICONS.length;
    
    const intervalLabel: Record<string, string> = {
        weekly: 'Weekly',
        monthly: 'Monthly',
        quarterly: 'Quarterly',
        yearly: 'Yearly',
    };
    
    const merchantName = sub.metadata?.merchantName || sub.metadata?.name || 'Merchant';
    
    let status: 'active' | 'expired' | 'cancelled' = 'active';
    if (sub.status === 'cancelled') {
        status = 'cancelled';
    } else if (sub.status === 'paused' || sub.status === 'past_due') {
        status = 'expired';
    }

    return {
        id: sub.id,
        icon: DEFAULT_ICONS[iconIndex],
        name: merchantName,
        plan: `${intervalLabel[sub.interval] || 'Subscription'} Plan`,
        amount: `$${Number(sub.amount).toFixed(2)}`,
        nextBillingDate: sub.nextChargeAt 
            ? new Date(sub.nextChargeAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })
            : 'N/A',
        status,
    };
}

type FilterType = 'all' | 'active' | 'expired' | 'cancelled'

const Subscriptions = () => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all')
    const [currentPage, setCurrentPage] = useState(0)
    const pageSize = 20
    
    const { data: subsResponse, isLoading, error } = useUserSubscriptions(currentPage, pageSize)
    
    const subscriptions = useMemo(() => {
        if (!subsResponse) return []
        const rows = (subsResponse as any)?.rows || subsResponse || []
        return rows.map(transformSubscription)
    }, [subsResponse])

    const filters: { id: FilterType; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'active', label: 'Active' },
        { id: 'expired', label: 'Expired' },
        { id: 'cancelled', label: 'Cancelled' }
    ]

    const filteredSubscriptions = activeFilter === 'all'
        ? subscriptions
        : subscriptions.filter((sub: SubscriptionDisplay) => sub.status === activeFilter)

    const activeSubscriptions = subscriptions.filter((sub: SubscriptionDisplay) => sub.status === 'active')

    return (
        <section className="w-full flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h4 className="text-primary capitalize font-poppins font-[600] md:text-xl text-lg">
                    My Subscriptions
                </h4>
                <p className="text-sm text-[#58556A] font-poppins font-[400]">
                    Manage your active subscriptions and view history
                </p>
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="w-full py-8 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Error state */}
            {error && !isLoading && (
                <div className="w-full py-8 text-center text-red-500">
                    <p>Failed to load subscriptions. Please try again.</p>
                </div>
            )}

            {/* Active Subscriptions Summary */}
            {!isLoading && !error && activeSubscriptions.length > 0 && (
                <div className="w-full bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-[12px] p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-[#58556A] font-poppins font-[400]">
                                Active Subscriptions
                            </p>
                            <h3 className="text-3xl text-primary font-poppins font-[600]">
                                {activeSubscriptions.length}
                            </h3>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                            <p className="text-sm text-[#58556A] font-poppins font-[400]">
                                Monthly Total
                            </p>
                            <h3 className="text-2xl text-primary font-poppins font-[600]">
                                ${activeSubscriptions.reduce((total: number, sub: SubscriptionDisplay) => total + parseFloat(sub.amount.replace('$', '')), 0).toFixed(2)}
                            </h3>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            {!isLoading && !error && (
                <div className="flex items-center gap-2 border-b border-[#E5E7EB] overflow-x-auto">
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`pb-3 px-2 text-sm font-[500] font-poppins transition-colors relative whitespace-nowrap ${activeFilter === filter.id
                                ? 'text-black border-b-2 border-black'
                                : 'text-[#58556A] hover:text-black'
                                }`}
                        >
                            {filter.label}
                            {filter.id !== 'all' && (
                                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-[#F3F4F6]">
                                    {subscriptions.filter((sub: SubscriptionDisplay) => sub.status === filter.id).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Subscriptions Grid */}
            {!isLoading && !error && filteredSubscriptions.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSubscriptions.map((subscription: SubscriptionDisplay) => (
                        <SubscriptionCard
                            key={subscription.id}
                            icon={subscription.icon}
                            name={subscription.name}
                            plan={subscription.plan}
                            amount={subscription.amount}
                            nextBillingDate={subscription.nextBillingDate}
                            status={subscription.status}
                        />
                    ))}
                </div>
            ) : !isLoading && !error ? (
                <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#F9FAFB] flex items-center justify-center">
                        <IoAdd className="w-8 h-8 text-[#58556A]" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <h5 className="text-primary font-poppins text-base font-[600]">
                            No {activeFilter !== 'all' && activeFilter} subscriptions
                        </h5>
                        <p className="text-sm text-[#58556A] font-poppins font-[400] text-center max-w-md">
                            {activeFilter === 'all'
                                ? "You don't have any subscriptions yet. Start by subscribing to your favorite services."
                                : `You don't have any ${activeFilter} subscriptions.`}
                        </p>
                    </div>
                    {activeFilter === 'all' && (
                        <Link
                            href="/user/utility-bills"
                            className="mt-4 px-6 py-2 bg-accent text-white rounded-[8px] font-poppins font-[500] text-sm hover:bg-accent/90 transition-colors"
                        >
                            Subscribe Now
                        </Link>
                    )}
                </div>
            ) : null}
        </section>
    )
}

export default Subscriptions
