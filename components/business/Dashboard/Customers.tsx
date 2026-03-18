'use client'
import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { PiUsersLight } from "react-icons/pi";


interface CustomerLocation {
    country: string
    flag: string
    count: number
    amount: number
}

// Sample customer data
const customersByLocation: CustomerLocation[] = [
    { country: 'Nigeria', flag: '🇳🇬', count: 45, amount: 900.00 },
    { country: 'Argentina', flag: '🇦🇷', count: 32, amount: 640.00 },
    { country: 'Denmark', flag: '🇩🇰', count: 20, amount: 400.00 },
    { country: 'Belgium', flag: '🇧🇪', count: 13, amount: 260.00 },
    { country: 'Italy', flag: '🇮🇹', count: 5, amount: 100.00 }
]

const customerTypeData = [
    { name: 'Repeat', value: 24, color: '#02C76A' },
    { name: 'First time', value: 52, color: '#01753E' }
]

const Customers = () => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <section className='w-full flex flex-col gap-2'>
            <h3 className='text-[#050020] font-sora font-[600] md:text-xl text-lg'>Customers</h3>

            <main className='w-full grid lg:grid-cols-2 gap-4 lg:gap-4'>
                {/* Customers by Location */}
                <div className='w-full bg-white md:p-4 flex flex-col gap-4'>
                    <h4 className='text-[#050020] font-[500] font-poppins text-sm'>Customers by location</h4>

                    <div className='w-full flex flex-col'>
                        {customersByLocation.map((location, index) => (
                            <div
                                key={index}
                                className='w-full flex justify-between items-center py-1 border-b border-[#E5E7EB] last:border-b-0'
                            >
                                <div className='flex items-center md:gap-3 gap-2'>
                                    <span className='text-2xl'>{location.flag}</span>
                                    <span className='text-[#58556A] font-poppins font-[400] text-sm'>{location.country}</span>
                                </div>

                                <div className='flex items-center md:gap-10 gap-6'>
                                    <div className='flex items-center gap-1'>
                                        <span className='text-[#58556A] font-poppins font-[400] text-sm'>{location.count}</span>
                                        <PiUsersLight className='w-4 h-4 text-[#6B7280]' />
                                    </div>
                                    <span className='text-[#050020] font-poppins font-[500] text-sm '>
                                        {location.amount.toFixed(2)} <span className='text-[#58556A] font-[400]'>USD</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Repeat vs First Time Customers */}
                <div className='w-full bg-white lg:border-l border-[#E5EAF5] py-4 md:px-8 flex flex-col gap-4'>
                    <h4 className='text-[#050020] font-[500] font-poppins text-sm'>Repeat vs. first time customers</h4>

                    <div className='flex items-center md:gap-8 gap-4'>
                        {/* Donut Chart */}
                        <div className='relative w-[180px] h-[180px] min-w-[180px]'>
                            {mounted && (
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
                            )}
                        </div>

                        {/* Legend */}
                        <div className='flex flex-col gap-4'>
                            <div className='flex items-center md:gap-6 gap-3'>
                                <div className='flex items-center gap-2'>
                                    <span className='w-3 h-3 rounded-sm bg-[#02C76A]' />
                                    <span className='text-[#58556A] font-poppins font-[400] text-sm'>Repeat</span>
                                </div>
                                <span className='text-[#050020] font-sora font-[500] text-sm'>{customerTypeData[0].value}</span>
                            </div>

                            <div className='flex items-center md:gap-6 gap-3'>
                                <div className='flex items-center gap-2'>
                                    <span className='w-3 h-3 rounded-sm bg-[#01753E]' />
                                    <span className='text-[#58556A] font-poppins font-[400] text-sm'>First time</span>
                                </div>
                                <span className='text-[#050020] font-sora font-[500] text-sm'>{customerTypeData[1].value}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </section>
    )
}

export default Customers
