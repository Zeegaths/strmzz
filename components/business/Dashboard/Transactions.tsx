'use client'
import React from 'react'
import { HiOutlineExternalLink } from "react-icons/hi"
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/lib/api'

interface Transaction {
    id: string
    payer: string
    amount: string | number
    currency: string
    status: string
    transactionHash?: string
    createdAt: string
}

const Transactions = () => {
    const { data: statsRes } = useQuery({
        queryKey: ['merchant-stats'],
        queryFn: () => apiGet('/merchants/me/stats'),
    })

    const { data: txRes, isLoading } = useQuery({
        queryKey: ['merchant-transactions'],
        queryFn: () => apiGet('/merchants/me/transactions?limit=5'),
    })

    const stats = statsRes?.data || statsRes?.message || null
    const transactions: Transaction[] = (txRes?.data?.rows || txRes?.message?.rows || []) as Transaction[]

    const settledAmount = stats?.settledAmount ?? 0
    const pendingAmount = stats?.pendingAmount ?? 0
    const failedAmount = stats?.failedAmount ?? 0
    const totalAmount = settledAmount + pendingAmount + failedAmount || 1

    const settledPercentage = (settledAmount / totalAmount) * 100
    const pendingPercentage = (pendingAmount / totalAmount) * 100
    const failedPercentage = (failedAmount / totalAmount) * 100

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-[#01753E] bg-[#E7FEF3]'
            case 'pending':
                return 'text-[#723B13] bg-[#FDFDEA]'
            case 'failed':
                return 'text-[#B91C1C] bg-[#FEEAEA]'
            default:
                return 'text-[#6B7280]'
        }
    }

    const truncateAddress = (addr: string) => {
        if (!addr) return '—'
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    const getExplorerUrl = (hash?: string) => {
        if (!hash) return '#'
        return `https://sepolia.basescan.org/tx/${hash}`
    }

    return (
        <section className='w-full flex flex-col gap-2'>
            <h3 className='text-[#050020] font-sora font-[600] md:text-xl text-lg'>Transactions</h3>

            <main className='w-full grid lg:grid-cols-2 gap-y-8 lg:gap-4'>
                {/* Transaction Status */}
                <div className='w-full bg-white md:p-4 flex flex-col gap-4'>
                    <h4 className='text-[#050020] font-[500] font-poppins text-sm'>Transactions status</h4>

                    {/* Progress Bar */}
                    <div className='w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex'>
                        <div
                            className='h-full bg-accent rounded-l-full'
                            style={{ width: `${settledPercentage}%` }}
                        />
                        <div
                            className='h-full bg-[#FCD34D]'
                            style={{ width: `${pendingPercentage}%` }}
                        />
                        <div
                            className='h-full bg-red-400 rounded-r-full'
                            style={{ width: `${failedPercentage}%` }}
                        />
                    </div>

                    {/* Status Legend */}
                    <div className='flex flex-col gap-3'>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <span className='w-3 h-3 rounded-full bg-accent' />
                                <span className='text-[#58556A] font-poppins font-[400] text-sm'>Settled</span>
                            </div>
                            <span className='text-[#050020] font-poppins font-[500] text-sm'>{Number(settledAmount).toFixed(2)} USD</span>
                        </div>

                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <span className='w-3 h-3 rounded-full bg-[#FCD34D]' />
                                <span className='text-[#58556A] font-poppins font-[400] text-sm'>Pending</span>
                            </div>
                            <span className='text-[#050020] font-poppins font-[500] text-sm'>{Number(pendingAmount).toFixed(2)} USD</span>
                        </div>

                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <span className='w-3 h-3 rounded-full bg-red-400' />
                                <span className='text-[#58556A] font-poppins font-[400] text-sm'>Failed</span>
                            </div>
                            <span className='text-[#050020] font-poppins font-[500] text-sm'>{Number(failedAmount).toFixed(2)} USD</span>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className='w-full bg-white lg:border-l border-[#E5EAF5] md:p-6 flex flex-col gap-4'>
                    <h4 className='text-[#050020] font-[500] font-poppins text-sm'>Recent Transactions</h4>

                    <div className='w-full flex flex-col gap-1'>
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className='flex justify-between items-center py-2 border-b border-[#E5E7EB]'>
                                    <span className='w-32 h-4 bg-gray-100 rounded animate-pulse' />
                                    <span className='w-20 h-4 bg-gray-100 rounded animate-pulse' />
                                </div>
                            ))
                        ) : transactions.length === 0 ? (
                            <p className='text-[#58556A] font-poppins text-sm py-4 text-center'>No transactions yet</p>
                        ) : (
                            transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className='flex justify-between items-center py-2 border-b border-[#E5E7EB] last:border-b-0'
                                >
                                    <div className='flex flex-col gap-0.5 min-w-0'>
                                        <span className='text-[#58556A] font-poppins font-[400] text-sm truncate max-w-[120px] sm:max-w-[200px]'>
                                            {truncateAddress(tx.payer)}
                                        </span>
                                    </div>

                                    <div className='flex items-center md:gap-6 gap-3'>
                                        <span className='text-[#050020] font-poppins font-[500] text-sm whitespace-nowrap'>
                                            {Number(tx.amount).toFixed(2)} <span className='text-[#58556A] font-poppins font-[400]'>{tx.currency}</span>
                                        </span>
                                        <span className={`font-poppins font-[400] text-xs px-2 py-0.5 rounded-md capitalize ${getStatusColor(tx.status)}`}>
                                            {tx.status}
                                        </span>
                                        <a
                                            href={getExplorerUrl(tx.transactionHash)}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-[#6B7280] hover:text-[#050020] transition-colors'
                                            aria-label='View transaction on explorer'
                                        >
                                            <HiOutlineExternalLink className='w-4 h-4' />
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </section>
    )
}

export default Transactions