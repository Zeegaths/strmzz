'use client'
import React, { useState, useRef, useEffect } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import { IoCheckmark } from 'react-icons/io5'

interface FilterOption {
    label: string
    value: string
}

interface FilterDropdownProps {
    label: string
    options: FilterOption[]
    selectedValues: string[]
    onChange: (values: string[]) => void
    showClose?: boolean
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
    label,
    options,
    selectedValues,
    onChange,
    showClose = false
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const toggleOption = (value: string) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter(v => v !== value))
        } else {
            onChange([...selectedValues, value])
        }
    }

    const clearAll = () => {
        onChange([])
        setIsOpen(false)
    }

    const getDisplayText = () => {
        if (selectedValues.length === 0) return label
        if (selectedValues.length === 1) {
            const option = options.find(opt => opt.value === selectedValues[0])
            return option?.label || label
        }
        return `${selectedValues.join(', ')}`
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`h-[36px] px-3 border rounded-[8px] flex items-center gap-2 text-sm font-poppins transition-colors ${selectedValues.length > 0
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-[#050020] border-[#E5E7EB] hover:border-accent'
                    }`}
            >
                <span className="whitespace-nowrap">{getDisplayText()}</span>
                {showClose && selectedValues.length > 0 ? (
                    <IoIosCloseCircle
                        className="w-4 h-4 flex-shrink-0"
                        onClick={(e) => {
                            e.stopPropagation()
                            clearAll()
                        }}
                    />
                ) : (
                    <svg
                        className={`w-4 h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg z-50 min-w-[160px]">
                    <div className="py-2 px-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => toggleOption(option.value)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-poppins text-[#050020] hover:bg-[#F9FAFB] rounded-[4px] transition-colors"
                            >
                                <div
                                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${selectedValues.includes(option.value)
                                        ? 'bg-accent border-accent'
                                        : 'border-[#E5E7EB]'
                                        }`}
                                >
                                    {selectedValues.includes(option.value) && (
                                        <IoCheckmark className="w-3 h-3 text-white" />
                                    )}
                                </div>
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default FilterDropdown