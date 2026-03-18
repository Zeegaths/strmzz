'use client'
import React, { useState, useRef, useEffect } from 'react'
import { TIME_PERIOD_OPTIONS } from './constants'

interface TimeperiodDropdownProps {
    selectedValue: string
    onChange: (value: string) => void
}

const TimeperiodDropdown: React.FC<TimeperiodDropdownProps> = ({
    selectedValue,
    onChange
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

    const selectOption = (value: string) => {
        onChange(value)
        setIsOpen(false)
    }

    const getDisplayText = () => {
        const option = TIME_PERIOD_OPTIONS.find(opt => opt.value === selectedValue)
        return option?.label || 'Time period'
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="h-[36px] px-3 border border-[#E5E7EB] bg-white rounded-[8px] flex items-center gap-2 text-sm font-poppins text-[#050020] hover:border-accent transition-colors"
            >
                <span className="whitespace-nowrap">{getDisplayText()}</span>
                <svg
                    className={`w-4 h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg z-50 min-w-[160px]">
                    <div className="py-2 px-1">
                        {TIME_PERIOD_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => selectOption(option.value)}
                                className={`w-full text-left px-3 py-2 text-sm font-poppins rounded-[4px] transition-colors ${selectedValue === option.value
                                    ? 'bg-[#E7FEF3] text-accent font-[500]'
                                    : 'text-[#050020] hover:bg-[#F9FAFB]'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default TimeperiodDropdown