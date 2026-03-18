'use client'
import React from 'react'
import { HiOutlineExternalLink } from "react-icons/hi";


interface Transaction {
    id: string
    email: string
    amount: number
    currency: string
    status: 'Pending' | 'Completed' | 'Failed'
}

// Sample transaction data
const recentTransactions: Transaction[] = [
    {
        id: '1',
        email: 'jason.kim@fakemail.com',
        amount: 20.00,
        currency: 'USDC',
        status: 'Pending'
    },
    {
        id: '2',
        email: 'lila.morales@randommail.com',
        amount: 40.00,
        currency: 'USDC',
        status: 'Pending'
    },
    {
        id: '3',
        email: 'tina.smith@samplemail.com',
        amount: 250.00,
        currency: 'USDC',
        status: 'Completed'
    }
]

const Transactions = () => {
    const settledAmount = 515.00
    const pendingAmount = 80.00
    const failedAmount = 10.00
    const totalAmount = settledAmount + pendingAmount + failedAmount

    const settledPercentage = (settledAmount / totalAmount) * 100
    const pendingPercentage = (pendingAmount / totalAmount) * 100
    const failedPercentage = (failedAmount / totalAmount) * 100

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'text-[#01753E] bg-[#E7FEF3]'
            case 'Pending':
                return 'text-[#723B13] bg-[#FDFDEA]'
            case 'Failed':
                return 'text-[#B91C1C] bg-[#FEEAEA]'
            default:
                return 'text-[#6B7280]'
        }
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
                            <span className='text-[#050020] font-poppins font-[500] text-sm'>{settledAmount.toFixed(2)} USD</span>
                        </div>

                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <span className='w-3 h-3 rounded-full bg-[#FCD34D]' />
                                <span className='text-[#58556A] font-poppins font-[400] text-sm'>Pending</span>
                            </div>
                            <span className='text-[#050020] font-poppins font-[500] text-sm'>{pendingAmount.toFixed(2)} USD</span>
                        </div>

                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <span className='w-3 h-3 rounded-full bg-red-400' />
                                <span className='text-[#58556A] font-poppins font-[400] text-sm'>Failed</span>
                            </div>
                            <span className='text-[#050020] font-poppins font-[500] text-sm'>{failedAmount.toFixed(2)} USD</span>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className='w-full bg-white lg:border-l border-[#E5EAF5] md:p-6 flex flex-col gap-4'>
                    <h4 className='text-[#050020] font-[500] font-poppins text-sm'>Recent Transactions</h4>

                    <div className='w-full flex flex-col gap-1'>
                        {recentTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className='flex justify-between items-center py-2 border-b border-[#E5E7EB] last:border-b-0'
                            >
                                <div className='flex flex-col gap-0.5 min-w-0'>
                                    <span className='text-[#58556A] font-poppins font-[400] text-sm truncate max-w-[120px] sm:max-w-[200px]'>{transaction.email}</span>
                                </div>

                                <div className='flex items-center md:gap-6 gap-3'>
                                    <span className='text-[#050020] font-poppins font-[500] text-sm whitespace-nowrap'>
                                        {transaction.amount.toFixed(2)} <span className='text-[#58556A] font-poppins font-[400]'>{transaction.currency}</span>
                                    </span>
                                    <span className={`font-poppins font-[400] text-xs px-2 py-0.5 rounded-md ${getStatusColor(transaction.status)}`}>
                                        {transaction.status}
                                    </span>
                                    <button
                                        type='button'
                                        className='text-[#6B7280] hover:text-[#050020] transition-colors'
                                        aria-label='View transaction details'
                                    >
                                        <HiOutlineExternalLink className='w-4 h-4' />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </section>
    )
}

export default Transactions
