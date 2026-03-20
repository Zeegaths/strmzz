'use client'
import React, { useMemo } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
    ColumnDef,
    SortingState,
} from '@tanstack/react-table'
import { Transaction } from '@/types/transactions'
import { PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE } from './constants'
import { getStatusColor, copyToClipboard } from './utils'
import { RiExternalLinkLine } from 'react-icons/ri'
import { IoCopyOutline } from 'react-icons/io5'
import { BiSortAlt2, BiSortUp, BiSortDown } from 'react-icons/bi'

interface TransactionTableProps {
    data: Transaction[]
}

const TransactionTable: React.FC<TransactionTableProps> = ({ data }) => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [currentPage, setCurrentPage] = React.useState(0)
    const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE)

    const columns = useMemo<ColumnDef<Transaction>[]>(
        () => [
            {
                accessorKey: 'email',
                header: 'Email address',
                cell: ({ getValue }) => (
                    <span className="text-[#58556A] font-poppins font-[400] text-sm">
                        {getValue() as string}
                    </span>
                ),
            },
            {
                accessorKey: 'amount',
                header: 'Amount($)',
                cell: ({ row }) => (
                    <span className=" text-[#050020] font-poppins font-[500] text-sm">
                        {row.original.amount.toFixed(2)} <span className='text-[#58556A] font-[400]'>{row.original.token}</span>
                    </span>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ getValue }) => {
                    const status = getValue() as string
                    return (
                        <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-[400] font-poppins ${getStatusColor(
                                status
                            )}`}
                        >
                            {status}
                        </span>
                    )
                },
            },
            {
                accessorKey: 'frequency',
                header: 'Frequency',
                cell: ({ getValue }) => (
                    <span className="text-[#58556A] font-poppins font-[400] text-sm">
                        {getValue() as string}
                    </span>
                ),
            },
            {
                accessorKey: 'paidVia',
                header: 'Paid via',
                cell: ({ getValue }) => (
                    <span className="text-[#58556A] font-poppins font-[400] text-sm">
                        {getValue() as string}
                    </span>
                ),
            },
            {
                accessorKey: 'timestamp',
                header: ({ column }) => (
                    <button
                        type="button"
                        onClick={() => column.toggleSorting()}
                        className="flex items-center gap-1 hover:text-accent text-[#58556A] transition-colors"
                    >
                        Timestamp
                        {column.getIsSorted() === 'asc' ? (
                            <BiSortUp className="w-4 h-4" />
                        ) : column.getIsSorted() === 'desc' ? (
                            <BiSortDown className="w-4 h-4" />
                        ) : (
                            <BiSortAlt2 className="w-4 h-4" />
                        )}
                    </button>
                ),
                cell: ({ getValue }) => (
                    <span className="text-[#58556A] font-poppins text-sm">
                        {getValue() as string}
                    </span>
                ),
            },
            {
                accessorKey: 'txnHash',
                header: 'Txn Hash',
                cell: ({ getValue }) => {
                    const hash = getValue() as string
                    return (
                        <div className="flex items-center gap-2 font-[400]">
                            <span className="text-[#58556A] font-poppins text-sm">
                                {hash}
                            </span>
                            <button
                                type="button"
                                onClick={() => copyToClipboard(hash)}
                                className="text-[#6B7280] hover:text-accent transition-colors"
                                aria-label="Copy transaction hash"
                            >
                                <IoCopyOutline className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                className="text-[#6B7280] hover:text-accent transition-colors"
                                aria-label="View transaction details"
                            >
                                <RiExternalLinkLine className="w-4 h-4" />
                            </button>
                        </div>
                    )
                },
            },
        ],
        []
    )

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination: {
                pageIndex: currentPage,
                pageSize,
            },
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Table */}
            <div className="w-full overflow-x-auto bg-white border border-[#E5E7EB] rounded-[12px]">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-3 text-left text-sm font-[600] font-poppins text-[#58556A] whitespace-nowrap"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-4 py-4 whitespace-nowrap">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-[#6B7280] font-poppins text-sm">
                                    No transactions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="w-full flex items-center justify-between flex-wrap gap-4">
                {/* Left: Results count and page size selector */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-[#6B7280] font-poppins">
                        {data.length > 0 ? (
                            <>
                                {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, data.length)} of {data.length} items
                            </>
                        ) : (
                            'No results'
                        )}
                    </span>
                    {data.length > 0 && (
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value))
                                setCurrentPage(0)
                            }}
                            className="h-[32px] px-2 border border-[#E5E7EB] rounded-[6px] text-sm font-poppins text-[#050020] outline-none focus:border-accent bg-white"
                        >
                            {PAGE_SIZE_OPTIONS.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Right: Prev/Next buttons */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        className="w-8 h-8 flex items-center justify-center border border-[#E5E7EB] rounded-[6px] text-[#050020] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous page"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={(currentPage + 1) * pageSize >= data.length}
                        className="w-8 h-8 flex items-center justify-center border border-[#E5E7EB] rounded-[6px] text-[#050020] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next page"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TransactionTable