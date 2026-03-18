'use client'
import React, { useState } from 'react'
import SubscriptionCard from './SubscriptionCard'
import netflixIcon from "@/public/history/netflix.png"
import spotifyIcon from "@/public/history/spotify.png"
import tvIcon from "@/public/history/tv.png"
import { IoAdd } from 'react-icons/io5'
import Link from 'next/link'

// Mock data - Replace with actual API data
const mockSubscriptions = [
    {
        id: '1',
        icon: netflixIcon,
        name: 'Netflix',
        plan: 'Standard Plan',
        amount: '$8.00',
        nextBillingDate: 'March 10, 2025',
        status: 'active' as const
    },
    {
        id: '2',
        icon: spotifyIcon,
        name: 'Spotify',
        plan: 'Family Plan',
        amount: '$20.00',
        nextBillingDate: 'March 5, 2025',
        status: 'active' as const
    },
    {
        id: '3',
        icon: tvIcon,
        name: 'GOTV',
        plan: 'Max Package',
        amount: '$10.00',
        nextBillingDate: 'February 28, 2025',
        status: 'active' as const
    },
    {
        id: '4',
        icon: netflixIcon,
        name: 'Netflix',
        plan: 'Basic Plan',
        amount: '$5.00',
        nextBillingDate: 'January 15, 2025',
        status: 'expired' as const
    },
    {
        id: '5',
        icon: tvIcon,
        name: 'DSTV',
        plan: 'Compact Package',
        amount: '$25.00',
        nextBillingDate: 'December 20, 2024',
        status: 'cancelled' as const
    }
]

type FilterType = 'all' | 'active' | 'expired' | 'cancelled'

const Subscriptions = () => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all')

    const filters: { id: FilterType; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'active', label: 'Active' },
        { id: 'expired', label: 'Expired' },
        { id: 'cancelled', label: 'Cancelled' }
    ]

    const filteredSubscriptions = activeFilter === 'all'
        ? mockSubscriptions
        : mockSubscriptions.filter(sub => sub.status === activeFilter)

    const activeSubscriptions = mockSubscriptions.filter(sub => sub.status === 'active')

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

            {/* Active Subscriptions Summary */}
            {activeSubscriptions.length > 0 && (
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
                                ${activeSubscriptions.reduce((total, sub) => total + parseFloat(sub.amount.replace('$', '')), 0).toFixed(2)}
                            </h3>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
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
                                {mockSubscriptions.filter(sub => sub.status === filter.id).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Subscriptions Grid */}
            {filteredSubscriptions.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSubscriptions.map((subscription) => (
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
            ) : (
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
            )}
        </section>
    )
}

export default Subscriptions
