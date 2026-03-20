'use client'
import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { PiUsersLight } from "react-icons/pi"
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/lib/api'

interface Customer {
    payer: string
    totalSpent: number
    paymentCount: number
    firstPayment: string
    lastPayment: string
}

const Customers = () => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const { data: custRes, isLoading } = useQuery({
        queryKey: ['merchant-customers'],
        queryFn: () => apiGet('/merchants/me/customers?limit=5'),
    })

    const customers: Customer[] = (custRes?.data?.rows || custRes?.message?.rows || []) as Customer[]
    const totalCustomers = custRes?.data?.count || custRes?.message?.count || 0

    // Calculate repeat vs first-time from data
    const repeatCount = customers.filter(c => c.paymentCount > 1).length
    const firstTimeCount = customers.filter(c => c.paymentCount === 1).length

    const customerTypeData = [
        { name: 'Repeat', value: repeatCount || 0, color: '#02C76A' },
        { name: 'First time', value: firstTimeCount || 0, color: '#01753E' }
    ]

    const truncateAddress = (addr: string) => {
        if (!addr) return '—'
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    return (
        <section className='w-full flex flex-col gap-2'>
            <h3 className='text-[#050020] font-sora font-[600] md:text-xl text-lg'>Customers</h3>

            <main className='w-full grid lg:grid-cols-2 gap-4 lg:gap-4'>
                {/* Customers List */}
                <div className='w-full bg-white md:p-4 flex flex-col gap-4'>
                    <h4 className='text-[#050020] font-[500] font-poppins text-sm'>
                        Top customers {totalCustomers > 0 && `(${totalCustomers})`}
                    </h4>

                    <div className='w-full flex flex-col'>
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className='w-full flex justify-between items-center py-1 border-b border-[#E5E7EB]'>
                                    <span className='w-32 h-4 bg-gray-100 rounded animate-pulse' />
                                    <span className='w-20 h-4 bg-gray-100 rounded animate-pulse' />
                                </div>
                            ))
                        ) : customers.length === 0 ? (
                            <p className='text-[#58556A] font-poppins text-sm py-4 text-center'>No customers yet</p>
                        ) : (
                            customers.map((customer, index) => (
                                <div
                                    key={index}
                                    className='w-full flex justify-between items-center py-1 border-b border-[#E5E7EB] last:border-b-0'
                                >
                                    <div className='flex items-center md:gap-3 gap-2'>
                                        <span className='text-lg'>👤</span>
                                        <span className='text-[#58556A] font-poppins font-[400] text-sm'>
                                            {truncateAddress(customer.payer)}
                                        </span>
                                    </div>

                                    <div className='flex items-center md:gap-10 gap-6'>
                                        <div className='flex items-center gap-1'>
                                            <span className='text-[#58556A] font-poppins font-[400] text-sm'>
                                                {customer.paymentCount}
                                            </span>
                                            <PiUsersLight className='w-4 h-4 text-[#6B7280]' />
                                        </div>
                                        <span className='text-[#050020] font-poppins font-[500] text-sm'>
                                            {Number(customer.totalSpent).toFixed(2)} <span className='text-[#58556A] font-[400]'>USDC</span>
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Repeat vs First Time Customers */}
                <div className='w-full bg-white lg:border-l border-[#E5EAF5] py-4 md:px-8 flex flex-col gap-4'>
                    <h4 className='text-[#050020] font-[500] font-poppins text-sm'>Repeat vs. first time customers</h4>

                    <div className='flex items-center md:gap-8 gap-4'>
                        {/* Donut Chart */}
                        <div className='relative w-[180px] h-[180px] min-w-[180px]'>
                            {mounted && (repeatCount > 0 || firstTimeCount > 0) ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={customerTypeData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            {customerTypeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className='w-full h-full flex items-center justify-center'>
                                    <p className='text-[#9CA3AF] font-poppins text-xs text-center'>No data yet</p>
                                </div>
                            )}
                        </div>

                        {/* Legend */}
                        <div className='flex flex-col gap-4'>
                            <div className='flex items-center md:gap-6 gap-3'>
                                <div className='flex items-center gap-2'>
                                    <span className='w-3 h-3 rounded-sm bg-[#02C76A]' />
                                    <span className='text-[#58556A] font-poppins font-[400] text-sm'>Repeat</span>
                                </div>
                                <span className='text-[#050020] font-sora font-[500] text-sm'>{repeatCount}</span>
                            </div>

                            <div className='flex items-center md:gap-6 gap-3'>
                                <div className='flex items-center gap-2'>
                                    <span className='w-3 h-3 rounded-sm bg-[#01753E]' />
                                    <span className='text-[#58556A] font-poppins font-[400] text-sm'>First time</span>
                                </div>
                                <span className='text-[#050020] font-sora font-[500] text-sm'>{firstTimeCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </section>
    )
}

export default Customers