'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FiGlobe, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { RiRouterLine } from 'react-icons/ri'

interface WhitelistedIP {
    id: string
    address: string
}

const WhitelistedIPTab = () => {
    const [ipAddresses, setIpAddresses] = useState<WhitelistedIP[]>([
        { id: '1', address: '196.255.255.244' }
    ])
    const [newIpAddress, setNewIpAddress] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const hasIPs = ipAddresses.length > 0

    const handleAddIP = () => {
        if (newIpAddress.trim()) {
            setIpAddresses([...ipAddresses, { id: Date.now().toString(), address: newIpAddress }])
            setNewIpAddress('')
            setIsDialogOpen(false)
        }
    }

    const handleDeleteIP = (id: string) => {
        setIpAddresses(ipAddresses.filter(ip => ip.id !== id))
    }

    return (
        <div className="w-full max-w-[516px] mx-auto flex flex-col gap-4 py-6">
            {!hasIPs ? (
                /* Empty State */
                <div className="w-full flex flex-col items-center justify-center py-20 gap-6">
                    <div className="w-[120px] h-[120px] flex items-center justify-center">
                        <RiRouterLine className="w-24 h-24 text-[#D1D5DB]" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <h3 className="font-sora font-[600] text-lg text-primary">No Whitelisted IP</h3>
                        <p className="text-sm text-[#58556A] font-poppins text-center max-w-md">
                            When you pay for a subscription via Strimz, it will show up here.
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <button className="h-[40px] px-4 flex items-center gap-2 bg-gradient-to-b from-[#02C76A] to-[#00A859] rounded-[8px] shadow-[0px_-3px_2.7px_0px_#029751_inset] text-white font-poppins font-[500] text-sm">
                                Add an IP address
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <span className="w-[40px] h-[40px] flex justify-center items-center bg-white border-[0.5px] border-[#E5E7EB] shadow-[0px_1px_2px_0px_#00000014] rounded-full">
                                        <FiGlobe className="w-4 h-4 text-primary" />
                                    </span>
                                    <span className="text-black font-[500] font-sora text-sm">Whitelisted IP</span>
                                </DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <p className="text-sm text-[#58556A] font-poppins mb-4">
                                    Only IP addresses listed here can perform transactions on Strimz
                                </p>
                                <div className='w-full flex flex-col gap-2'>
                                    <label htmlFor="ip-address" className="font-poppins text-[14px] text-[#58556A] leading-[24px]">IP address</label>
                                    <input
                                        type="text"
                                        name="ip-address"
                                        id="ip-address"
                                        value={newIpAddress}
                                        onChange={(e) => setNewIpAddress(e.target.value)}
                                        placeholder='123.45.67.89'
                                        className="w-full rounded-[8px] border bg-[#F9FAFB] border-[#E5E7EB] shadow-navbarShadow h-[44px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent"
                                    />
                                </div>
                            </div>
                            <DialogFooter className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsDialogOpen(false)}
                                    className='flex-1 h-[40px] flex justify-center items-center rounded-[8px] border border-[#E5E7EB] bg-white text-primary font-poppins font-[500] text-[12px]'
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddIP}
                                    className='flex-1 h-[40px] flex justify-center items-center rounded-[8px] bg-accent text-[#FFFFFF] font-poppins font-[500] shadow-joinWaitlistBtnShadow text-shadow text-[12px]'
                                >
                                    Add IP address
                                </button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            ) : (
                /* IP List View */
                <>
                    {/* Add IP Button */}
                    <div className="w-full flex justify-end">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <button className="h-[40px] px-4 flex items-center gap-2 bg-gradient-to-b from-[#02C76A] to-[#00A859] rounded-[8px] shadow-[0px_-3px_2.7px_0px_#029751_inset] text-white font-poppins font-[500] text-sm">
                                    <span className="text-lg">+</span>
                                    Add IP address
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <span className="w-[40px] h-[40px] flex justify-center items-center bg-white border-[0.5px] border-[#E5E7EB] shadow-[0px_1px_2px_0px_#00000014] rounded-full">
                                            <FiGlobe className="w-4 h-4 text-primary" />
                                        </span>
                                        <span className="text-black font-[500] font-sora text-sm">Whitelisted IP</span>
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    <p className="text-sm text-[#58556A] font-poppins mb-4">
                                        Only IP addresses listed here can perform transactions on Strimz
                                    </p>
                                    <div className='w-full flex flex-col gap-2'>
                                        <label htmlFor="ip-address" className="font-poppins text-[14px] text-[#58556A] leading-[24px]">IP address</label>
                                        <input
                                            type="text"
                                            name="ip-address"
                                            id="ip-address"
                                            value={newIpAddress}
                                            onChange={(e) => setNewIpAddress(e.target.value)}
                                            placeholder='123.45.67.89'
                                            className="w-full rounded-[8px] border bg-[#F9FAFB] border-[#E5E7EB] shadow-navbarShadow h-[44px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent"
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsDialogOpen(false)}
                                        className='flex-1 h-[40px] flex justify-center items-center rounded-[8px] border border-[#E5E7EB] bg-white text-primary font-poppins font-[500] text-[12px]'
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddIP}
                                        className='flex-1 h-[40px] flex justify-center items-center rounded-[8px] bg-accent text-[#FFFFFF] font-poppins font-[500] shadow-joinWaitlistBtnShadow text-shadow text-[12px]'
                                    >
                                        Add IP address
                                    </button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Info Box */}
                    <div className="w-full bg-[#EFF6FF] border border-[#BFDBFE] rounded-[8px] p-4 flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">i</span>
                        </div>
                        <p className="text-sm text-[#1E40AF] font-poppins">
                            Only IP addresses listed here can perform transactions on Strimz
                        </p>
                    </div>

                    {/* IP Addresses List */}
                    <div className="w-full bg-white border border-[#E5E7EB] rounded-[12px] p-6 flex flex-col gap-4">
                        <h3 className="font-poppins font-[600] text-sm text-primary">IP addresses</h3>

                        {ipAddresses.map((ip) => (
                            <div key={ip.id} className="flex items-center justify-between py-3 border-b border-[#F3F4F6] last:border-b-0">
                                <span className="text-sm font-poppins text-primary">{ip.address}</span>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-[#F9FAFB] rounded-[6px] transition-colors">
                                        <FiEdit2 className="w-4 h-4 text-[#6B7280]" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteIP(ip.id)}
                                        className="p-2 hover:bg-[#FEF2F2] rounded-[6px] transition-colors"
                                    >
                                        <FiTrash2 className="w-4 h-4 text-[#DC2626]" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default WhitelistedIPTab
