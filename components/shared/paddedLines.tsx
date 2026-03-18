import { cn } from '@/lib/utils'
import React from 'react'

const PaddedLines = ({ className }: { className?: string }) => {
    return (
        <div className={cn(`w-full`, className)}>
            <div className="w-full h-[10px] bg-[#02C76A]" />
            <div className="w-full h-[10px] bg-[#03FC86]" />
            <div className="w-full h-[10px] bg-[#95FECC]" />
        </div>
    )
}

export default PaddedLines