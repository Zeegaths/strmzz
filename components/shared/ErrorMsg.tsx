'use client'
import { ErrorDisplayProps } from '@/types/auth';
import React from 'react';
import { IoWarningOutline } from "react-icons/io5";

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
    if (!message) return null;

    return (
        <div className="flex gap-1 items-center ml-3 mt-1 text-red-600">
            <IoWarningOutline className="w-3 h-3" />
            <span className="text-[12px]">{message}</span>
        </div>
    );
};

export default ErrorDisplay;