'use client'
import React, { useState, useMemo } from 'react'
import { IoFilterSharp, IoSearchOutline } from 'react-icons/io5'
import FilterDropdown from './FilterDropdown'
import TransactionTable from './TransactionTable'
import { sampleTransactions } from '@/utils/sampleTransactionData'
import { FilterState, Transaction } from '@/types/transactions'
import { FILTER_OPTIONS } from './constants'

const TransactionBusinessDashboard = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [filters, setFilters] = useState<FilterState>({
        token: [],
        status: [],
        frequency: [],
        paidVia: [],
        timeperiod: ''
    })

    // Filter transactions
    const filteredTransactions = useMemo(() => {
        return sampleTransactions.filter((transaction: Transaction) => {
            // Search filter
            const matchesSearch =
                searchQuery === '' ||
                transaction.email.toLowerCase().includes(searchQuery.toLowerCase())

            // Token filter
            const matchesToken =
                filters.token.length === 0 ||
                filters.token.includes(transaction.token)

            // Status filter
            const matchesStatus =
                filters.status.length === 0 ||
                filters.status.includes(transaction.status)

            // Frequency filter
            const matchesFrequency =
                filters.frequency.length === 0 ||
                filters.frequency.includes(transaction.frequency)

            // Paid via filter
            const matchesPaidVia =
                filters.paidVia.length === 0 ||
                filters.paidVia.includes(transaction.paidVia)

            return matchesSearch && matchesToken && matchesStatus && matchesFrequency && matchesPaidVia
        })
    }, [searchQuery, filters])

    return (
        <section className="w-full flex flex-col gap-4">
            {/* Header */}
            <div className='w-full flex lg:flex-row flex-col lg:items-center lg:justify-between gap-4'>
                <div className='w-full flex flex-col gap-1'>
                    <h4 className="text-primary capitalize font-sora font-[600] text-xl">Transactions</h4>
                    <p className="text-sm text-[#58556A] font-poppins font-[400]">
                        View your Strimz transactions
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
                    label="Token"
                    options={FILTER_OPTIONS.token}
                    selectedValues={filters.token}
                    onChange={(values) => setFilters({ ...filters, token: values })}
                    showClose={filters.token.length > 0}
                />

                <FilterDropdown
                    label="Status"
                    options={FILTER_OPTIONS.status}
                    selectedValues={filters.status}
                    onChange={(values) => setFilters({ ...filters, status: values })}
                    showClose={filters.status.length > 0}
                />

                <FilterDropdown
                    label="Frequency"
                    options={FILTER_OPTIONS.frequency}
                    selectedValues={filters.frequency}
                    onChange={(values) => setFilters({ ...filters, frequency: values })}
                    showClose={filters.frequency.length > 0}
                />

                <FilterDropdown
                    label="Paid via"
                    options={FILTER_OPTIONS.paidVia}
                    selectedValues={filters.paidVia}
                    onChange={(values) => setFilters({ ...filters, paidVia: values })}
                    showClose={filters.paidVia.length > 0}
                />
            </section>


            {/* Table */}
            <TransactionTable data={filteredTransactions} />
        </section>
    )
}

export default TransactionBusinessDashboard