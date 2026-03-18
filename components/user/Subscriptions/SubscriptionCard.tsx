'use client'
import React, { useState } from 'react'
import Image, { StaticImageData } from 'next/image'
import { MdOutlineSubscriptions } from 'react-icons/md'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface SubscriptionCardProps {
    icon: StaticImageData
    name: string
    plan: string
    amount: string
    nextBillingDate: string
    status: 'active' | 'expired' | 'cancelled'
}

const SubscriptionCard = ({
    icon,
    name,
    plan,
    amount,
    nextBillingDate,
    status,
}: SubscriptionCardProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const statusColors = {
        active: 'text-[#10B981] bg-[#D1FAE5]',
        expired: 'text-[#EF4444] bg-[#FEE2E2]',
        cancelled: 'text-[#6B7280] bg-[#F3F4F6]'
    }

    const statusLabels = {
        active: 'Active',
        expired: 'Expired',
        cancelled: 'Cancelled'
    }

    const handleCancelSubscription = () => {
        console.log(`Cancelling ${name} subscription`)
        // TODO: Implement cancel subscription API call
        setIsDialogOpen(false)
    }

    const handleRenewSubscription = () => {
        console.log(`Renewing ${name} subscription`)
        // TODO: Implement renew subscription API call
        setIsDialogOpen(false)
    }

    const handleUpdatePlan = () => {
        console.log(`Updating ${name} plan`)
        // TODO: Implement update plan functionality
        setIsDialogOpen(false)
    }

    return (
        <>
            <div className="w-full flex flex-col gap-4 bg-white border border-[#E5E7EB] rounded-[12px] p-5 hover:shadow-[0px_4px_12px_0px_#0000001A] transition-shadow">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center p-2">
                        <Image
                            src={icon}
                            alt={name}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain"
                            quality={100}
                            priority
                        />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <h5 className="text-[#050020] font-poppins text-base font-[600]">{name}</h5>
                        <p className="text-xs text-[#58556A] font-poppins font-[400]">{plan}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6]">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-[#58556A] font-poppins font-[400]">Amount</p>
                        <p className="text-sm text-[#050020] font-poppins font-[600]">{amount}</p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                        <p className="text-xs text-[#58556A] font-poppins font-[400]">
                            {status === 'active' ? 'Next Billing' : status === 'expired' ? 'Expired On' : 'Cancelled On'}
                        </p>
                        <p className="text-sm text-[#050020] font-poppins font-[400]">{nextBillingDate}</p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-poppins font-[500] ${statusColors[status]}`}>
                        {statusLabels[status]}
                    </span>
                    {status === 'active' && (
                        <button
                            onClick={() => setIsDialogOpen(true)}
                            className="text-xs text-accent font-poppins font-[500] hover:underline"
                        >
                            Manage
                        </button>
                    )}
                </div>
            </div>

            {/* Manage Subscription Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span className="w-[40px] h-[40px] flex justify-center items-center bg-white border-[0.5px] border-[#E5E7EB] shadow-[0px_1px_2px_0px_#00000014] rounded-full">
                                <MdOutlineSubscriptions className="w-4 h-4 text-primary" />
                            </span>
                            <span className="text-black font-[500] font-sora capitalize text-sm">manage subscription</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Subscription Details */}
                        <div className="flex items-center gap-3 p-4 bg-[#F9FAFB] rounded-[8px]">
                            <div className="w-12 h-12 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center p-2">
                                <Image
                                    src={icon}
                                    alt={name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h5 className="text-[#050020] font-poppins text-base font-[600]">{name}</h5>
                                <p className="text-xs text-[#58556A] font-poppins font-[400]">{plan} • {amount}/month</p>
                                <p className="text-xs text-[#58556A] font-poppins font-[400]">
                                    Next billing: {nextBillingDate}
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col gap-2 sm:flex-col">
                        <button
                            onClick={handleUpdatePlan}
                            className="w-full h-[40px] flex justify-center items-center rounded-[8px] bg-accent text-white font-poppins font-[500] text-[12px] capitalize hover:bg-accent/90 transition-colors"
                        >
                            update plan
                        </button>
                        <button
                            onClick={handleRenewSubscription}
                            className="w-full h-[40px] flex justify-center items-center rounded-[8px] border border-accent text-accent font-poppins font-[500] text-[12px] capitalize hover:bg-accent/5 transition-colors"
                        >
                            renew now
                        </button>
                        <button
                            onClick={handleCancelSubscription}
                            className="w-full h-[40px] flex justify-center items-center rounded-[8px] border border-[#EF4444] text-[#EF4444] font-poppins font-[500] text-[12px] capitalize hover:bg-[#FEE2E2] transition-colors"
                        >
                            cancel subscription
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default SubscriptionCard
