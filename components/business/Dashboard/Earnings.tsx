'use client'
import React, { useState, useEffect } from 'react'
import { CiCalendar } from "react-icons/ci"
import { GoArrowUpRight } from "react-icons/go"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Sample data for the chart
const earningsData = [
    { date: 'Jul 10', amount: 0 },
    { date: 'Jul 11', amount: 45 },
    { date: 'Jul 12', amount: 35 },
    { date: 'Jul 13', amount: 75 },
    { date: 'Jul 14', amount: 78 },
    { date: 'Jul 15', amount: 75 },
    { date: 'Jul 16', amount: 42 },
]

const Earnings = () => {
    const [timeRange] = useState('Last 7 days')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <section className='w-full flex flex-col gap-3'>
            <div className='w-full flex justify-between items-start'>
                <h3 className='text-[#050020] font-sora font-[600] md:text-xl text-lg'>Earnings</h3>
                <button
                    type='button'
                    className='w-[125px] h-[36px] border border-[#E5E7EB] bg-white rounded-[8px] flex justify-center items-center text-primary gap-1.5 text-sm font-poppins hover:bg-gray-50 transition-colors'
                >
                    <CiCalendar className='w-[20px] h-[20px]' />
                    {timeRange}
                </button>
            </div>

            <main className='w-full grid lg:grid-cols-4 gap-4 lg:gap-0 border border-[#E5EAF5] bg-white rounded-[12px] p-4 md:p-6'>
                {/* Chart Section */}
                <div className='lg:col-span-3 flex flex-col gap-4 lg:pr-6'>
                    <div className='flex flex-col gap-1'>
                        <h6 className='text-sm text-[#050020] font-[500] font-poppins'>Earnings</h6>
                        <div className='flex gap-3 items-center flex-wrap'>
                            <h2 className='font-sora font-[600] text-[#050020] text-2xl'>
                                1,255.50
                                <span className='text-[#6B7280] font-poppins font-[500] text-base ml-1'>USD</span>
                            </h2>
                            <span className='flex gap-1.5 items-center'>
                                <span className='w-[18px] h-[18px] rounded-full bg-[#E7FEF3] text-accent flex justify-center items-center'>
                                    <GoArrowUpRight className='w-[14px] h-[14px]' />
                                </span>
                                <span className='text-sm text-accent font-poppins font-[500]'>7%</span>
                                <span className='text-[#58556A] font-poppins font-[400] text-sm'>vs Last 7 days</span>
                            </span>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className='w-full h-[190px]'>
                        {mounted && (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                data={earningsData}
                                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="0" stroke="#F3F4F6" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    ticks={[0, 25, 50, 75, 100]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                    formatter={(value: number) => [`${value}`, 'Amount']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#00B871"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4, fill: '#00B871' }}
                                />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* All Time Earnings Section */}
                <div className='w-full lg:border-l border-[#E5E7EB] lg:pl-6 pt-4 pl-2 lg:pt-0 flex flex-col gap-4 justify-center'>
                    <div className='flex flex-col gap-1'>
                        <h4 className='uppercase text-[#58556A] font-poppins font-[400] text-xs'>All time earnings</h4>
                        <h3 className='text-[#050020] font-sora font-[600] text-xl'>
                            $ 345,250.
                            <span className='font-poppins font-[500] text-sm'>50</span>
                        </h3>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <h4 className='uppercase text-[#58556A] font-poppins font-[400] text-xs'>usdt</h4>
                        <h3 className='text-[#050020] font-sora font-[600] text-xl'>
                            $ 120,250.
                            <span className='font-poppins font-[500] text-sm'>00</span>
                        </h3>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <h4 className='uppercase text-[#58556A] font-poppins font-[400] text-xs'>usdc</h4>
                        <h3 className='text-[#050020] font-sora font-[600] text-xl'>
                            $ 201,250.
                            <span className='font-poppins font-[500] text-sm'>00</span>
                        </h3>
                    </div>
                </div>
            </main>
        </section>
    )
}

export default Earnings
