'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { FiKey, FiLock, FiEye, FiEyeOff, FiCopy } from 'react-icons/fi'

interface APIKeys {
    publicKey: string
    secretKey: string
    revealed: boolean
}

const APIKeysTab = () => {
    const [liveKeys] = useState<APIKeys>({
        publicKey: 'STRZlive_6gPzQlL8xNwA5fVdB7YtM2KjC9RoZ',
        secretKey: 'STRZ_9XrK2VbY4pLtN6MwA7QzCiJoF8Yd',
        revealed: false
    })

    const [testKeys] = useState<APIKeys>({
        publicKey: 'STRZtest_9XrK2VbY4pLtN6MwA7QzCiJoF8Yd',
        secretKey: 'STRZtest_secret_key_hidden',
        revealed: false
    })

    const [liveSecretRevealed, setLiveSecretRevealed] = useState(false)
    const [testSecretRevealed, setTestSecretRevealed] = useState(false)
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
    const [targetKey, setTargetKey] = useState<'live' | 'test'>('live')
    const [password, setPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)

    const handleRevealSecret = (keyType: 'live' | 'test') => {
        setTargetKey(keyType)
        setPasswordDialogOpen(true)
    }

    const handlePasswordSubmit = () => {
        // Simulate password verification
        if (password) {
            if (targetKey === 'live') {
                setLiveSecretRevealed(true)
            } else {
                setTestSecretRevealed(true)
            }
            setPasswordDialogOpen(false)
            setPassword('')
            setPasswordVisible(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        // You can add a toast notification here
    }

    return (
        <div className="w-full max-w-[516px] mx-auto flex flex-col gap-8 py-6">
            {/* Live API Keys */}
            <div className="w-full flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-[40px] h-[40px] rounded-full bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center">
                            <FiKey className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-sora font-[600] text-lg text-primary">Live API Keys</h3>
                    </div>
                    <button className="h-[40px] px-4 flex items-center gap-2 bg-gradient-to-b from-[#02C76A] to-[#00A859] rounded-[8px] shadow-[0px_-3px_2.7px_0px_#029751_inset] text-white font-poppins font-[500] text-sm">
                        Generate new API keys
                    </button>
                </div>

                {/* Public Key */}
                <div className="w-full flex flex-col gap-2">
                    <label className="font-poppins text-[14px] text-[#58556A] leading-[24px]">Public Key</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={liveKeys.publicKey}
                            readOnly
                            className="w-full rounded-[8px] border bg-[#F9FAFB] border-[#E5E7EB] shadow-navbarShadow h-[44px] font-poppins text-[14px] text-primary px-4 pr-12 outline-none"
                        />
                        <button
                            onClick={() => copyToClipboard(liveKeys.publicKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white rounded-[6px] transition-colors"
                        >
                            <FiCopy className="w-4 h-4 text-[#6B7280]" />
                        </button>
                    </div>
                </div>

                {/* Secret Key */}
                <div className="w-full flex flex-col gap-2">
                    <label className="font-poppins text-[14px] text-[#58556A] leading-[24px]">Secret key</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={liveSecretRevealed ? liveKeys.secretKey : '••••••••••••'}
                            readOnly
                            className="w-full rounded-[8px] border bg-[#F9FAFB] border-[#E5E7EB] shadow-navbarShadow h-[44px] font-poppins text-[14px] text-primary px-4 pr-12 outline-none"
                        />
                        <button
                            onClick={() => liveSecretRevealed ? setLiveSecretRevealed(false) : handleRevealSecret('live')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white rounded-[6px] transition-colors"
                        >
                            {liveSecretRevealed ? (
                                <FiEyeOff className="w-4 h-4 text-[#6B7280]" />
                            ) : (
                                <FiEye className="w-4 h-4 text-[#6B7280]" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Test API Keys */}
            <div className="w-full flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-[40px] h-[40px] rounded-full bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center">
                            <FiKey className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-sora font-[600] text-lg text-primary">Test API Keys</h3>
                    </div>
                    <button className="h-[40px] px-4 flex items-center gap-2 bg-gradient-to-b from-[#02C76A] to-[#00A859] rounded-[8px] shadow-[0px_-3px_2.7px_0px_#029751_inset] text-white font-poppins font-[500] text-sm">
                        Generate new test keys
                    </button>
                </div>

                {/* Public Key */}
                <div className="w-full flex flex-col gap-2">
                    <label className="font-poppins text-[14px] text-[#58556A] leading-[24px]">Public Key</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={testKeys.publicKey}
                            readOnly
                            className="w-full rounded-[8px] border bg-[#F9FAFB] border-[#E5E7EB] shadow-navbarShadow h-[44px] font-poppins text-[14px] text-primary px-4 pr-12 outline-none"
                        />
                        <button
                            onClick={() => copyToClipboard(testKeys.publicKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white rounded-[6px] transition-colors"
                        >
                            <FiCopy className="w-4 h-4 text-[#6B7280]" />
                        </button>
                    </div>
                </div>

                {/* Secret Key */}
                <div className="w-full flex flex-col gap-2">
                    <label className="font-poppins text-[14px] text-[#58556A] leading-[24px]">Secret key</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={testSecretRevealed ? testKeys.secretKey : '••••••••••••'}
                            readOnly
                            className="w-full rounded-[8px] border bg-[#F9FAFB] border-[#E5E7EB] shadow-navbarShadow h-[44px] font-poppins text-[14px] text-primary px-4 pr-12 outline-none"
                        />
                        <button
                            onClick={() => testSecretRevealed ? setTestSecretRevealed(false) : handleRevealSecret('test')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white rounded-[6px] transition-colors"
                        >
                            {testSecretRevealed ? (
                                <FiEyeOff className="w-4 h-4 text-[#6B7280]" />
                            ) : (
                                <FiEye className="w-4 h-4 text-[#6B7280]" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Password Dialog */}
            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span className="w-[40px] h-[40px] flex justify-center items-center bg-white border-[0.5px] border-[#E5E7EB] shadow-[0px_1px_2px_0px_#00000014] rounded-full">
                                <FiLock className="w-4 h-4 text-primary" />
                            </span>
                            <span className="text-black font-[500] font-sora text-sm">Enter password</span>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-[#58556A] font-poppins mb-4">
                            For security reasons, enter your password to view your secret keys
                        </p>
                        <div className='w-full flex flex-col gap-2'>
                            <label htmlFor="password" className="font-poppins text-[14px] text-[#58556A] leading-[24px]">Password</label>
                            <div className="relative">
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='••••••••••••'
                                    className="w-full rounded-[8px] border bg-[#F9FAFB] border-[#E5E7EB] shadow-navbarShadow h-[44px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 pr-12 outline-none transition duration-300 focus:border-accent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white rounded-[6px] transition-colors"
                                >
                                    {passwordVisible ? (
                                        <FiEyeOff className="w-4 h-4 text-[#6B7280]" />
                                    ) : (
                                        <FiEye className="w-4 h-4 text-[#6B7280]" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setPasswordDialogOpen(false)
                                setPassword('')
                                setPasswordVisible(false)
                            }}
                            className='flex-1 h-[40px] flex justify-center items-center rounded-[8px] border border-[#E5E7EB] bg-white text-primary font-poppins font-[500] text-[12px]'
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handlePasswordSubmit}
                            className='flex-1 h-[40px] flex justify-center items-center rounded-[8px] bg-accent text-[#FFFFFF] font-poppins font-[500] shadow-joinWaitlistBtnShadow text-shadow text-[12px]'
                        >
                            Continue
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default APIKeysTab
