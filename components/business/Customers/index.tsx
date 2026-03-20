'use client'
import React, { useState, useMemo } from 'react'
import { IoFilterSharp, IoSearchOutline } from 'react-icons/io5'
import FilterDropdown from './FilterDropdown'
import CustomerTable from './CustomerTable'
import { sampleCustomers } from '@/utils/sampleCustomerData'
import { CustomerFilterState, Customer } from '@/types/customers'
import { CUSTOMER_FILTER_OPTIONS } from './constants'
import { matchesTotalSpentRange, matchesLastPaymentPeriod } from './utils'

const CustomersBusinessDashboard = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [filters, setFilters] = useState<CustomerFilterState>({
        totalSpent: [],
        frequency: [],
        lastPayment: [],
    })

    // Filter customers
    const filteredCustomers = useMemo(() => {
        return sampleCustomers.filter((customer: Customer) => {
            // Search filter
            const matchesSearch =
                searchQuery === '' ||
                customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchQuery.toLowerCase())

            // Total spent filter
            const matchesTotalSpent =
                filters.totalSpent.length === 0 ||
                filters.totalSpent.some(range => matchesTotalSpentRange(customer.totalSpent, range))

            // Frequency filter
            const matchesFrequency =
                filters.frequency.length === 0 ||
                filters.frequency.includes(customer.frequency)

            // Last payment filter
            const matchesLastPayment =
                filters.lastPayment.length === 0 ||
                filters.lastPayment.some(period => matchesLastPaymentPeriod(customer.lastPayment, period))

            return matchesSearch && matchesTotalSpent && matchesFrequency && matchesLastPayment
        })
    }, [searchQuery, filters])

    return (
        <section className="w-full flex flex-col gap-4">
            {/* Header */}
            <div className='w-full flex lg:flex-row flex-col lg:items-center lg:justify-between gap-4'>
                <div className='w-full flex flex-col gap-1'>
                    <h4 className="text-primary capitalize font-sora font-[600] text-xl">Customers</h4>
                    <p className="text-sm text-[#58556A] font-poppins font-[400]">
                        Track your customers in one place
                    </p>
                </div>
                <div className="relative w-full lg:max-w-[400px]">
                    <input
                        type="search"
                        placeholder="Search by name or email"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-[8px] border bg-[#F9FAFB] h-[44px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-[#050020] pl-10 pr-4 outline-none transition duration-300 focus:border-accent border-[#E5E7EB]"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#58556A] pointer-events-none">
                        <IoSearchOutline className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Filter section */}
            <section className='w-full flex items-center gap-3 flex-wrap'>
                <span className='flex items-center gap-2 text-[#58556A] text-sm font-[500] font-poppins'>
                    <IoFilterSharp className="w-4 h-4" />
                    Filters:
                </span>

                <FilterDropdown
                    label="Total Spent"
                    options={CUSTOMER_FILTER_OPTIONS.totalSpent}
                    selectedValues={filters.totalSpent}
                    onChange={(values) => setFilters({ ...filters, totalSpent: values })}
                    showClose={filters.totalSpent.length > 0}
                />

                <FilterDropdown
                    label="Frequency"
                    options={CUSTOMER_FILTER_OPTIONS.frequency}
                    selectedValues={filters.frequency}
                    onChange={(values) => setFilters({ ...filters, frequency: values })}
                    showClose={filters.frequency.length > 0}
                />

                <FilterDropdown
                    label="Last Payment"
                    options={CUSTOMER_FILTER_OPTIONS.lastPayment}
                    selectedValues={filters.lastPayment}
                    onChange={(values) => setFilters({ ...filters, lastPayment: values })}
                    showClose={filters.lastPayment.length > 0}
                />
            </section>

            {/* Table */}
            <CustomerTable data={filteredCustomers} />
        </section>
    )
}

export default CustomersBusinessDashboard
