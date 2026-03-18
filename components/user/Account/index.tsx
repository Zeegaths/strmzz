'use client'
import React, { useState } from 'react'
import { FiUser, FiLock } from 'react-icons/fi'
import { RiErrorWarningLine } from 'react-icons/ri'
import { IoChevronBack } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

const nameSchema = z.object({
    name: z.string()
        .min(2, 'Too short!')
        .max(50, 'Too long!'),
})

const emailSchema = z.object({
    email: z.string()
        .email('Invalid email'),
})

const passwordSchema = z.object({
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number"),
})

const UserAccountSettings = () => {
    const router = useRouter()
    const [name, setName] = useState('Gregory Donald')
    const [email, setEmail] = useState('Gregory@gmail.com')

    const [isEditingName, setIsEditingName] = useState(false)
    const [isEditingEmail, setIsEditingEmail] = useState(false)
    const [isEditingPassword, setIsEditingPassword] = useState(false)

    const [nameInput, setNameInput] = useState(name)
    const [emailInput, setEmailInput] = useState(email)
    const [passwordInput, setPasswordInput] = useState('')

    const [nameError, setNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const handleNameUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        try {
            nameSchema.parse({ name: nameInput })
            setName(nameInput)
            setIsEditingName(false)
            setNameError('')
        } catch (error) {
            if (error instanceof z.ZodError) {
                setNameError(error.errors[0]?.message || 'Invalid input')
            }
        }
    }

    const handleEmailUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        try {
            emailSchema.parse({ email: emailInput })
            setEmail(emailInput)
            setIsEditingEmail(false)
            setEmailError('')
        } catch (error) {
            if (error instanceof z.ZodError) {
                setEmailError(error.errors[0]?.message || 'Invalid input')
            }
        }
    }

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        try {
            passwordSchema.parse({ password: passwordInput })
            setIsEditingPassword(false)
            setPasswordError('')
            console.log("Updated Password:", passwordInput)
            // TODO: Implement password update API call
        } catch (error) {
            if (error instanceof z.ZodError) {
                setPasswordError(error.errors[0]?.message || 'Invalid input')
            }
        }
    }

    const handleDeleteAccount = () => {
        console.log("Deleting account...")
        // TODO: Implement account deletion API call
        setIsDeleteDialogOpen(false)
    }

    const handleAvatarChange = () => {
        console.log("Change avatar")
        // TODO: Implement avatar change functionality
    }

    const handleAvatarRemove = () => {
        console.log("Remove avatar")
        // TODO: Implement avatar remove functionality
    }

    const getInitial = () => {
        return name.charAt(0).toUpperCase()
    }

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-primary font-poppins text-sm font-[500] hover:text-accent transition-colors w-fit"
            >
                <IoChevronBack className="w-5 h-5" />
                Back
            </button>

            {/* Header */}
            <div className="flex flex-col gap-1">
                <h4 className="text-primary font-poppins font-[600] text-xl">Profile settings</h4>
                <p className="text-sm text-[#58556A] font-poppins font-[400]">
                    Manage your account and preferences
                </p>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-[600px] mx-auto flex flex-col gap-6">
                {/* Profile Section */}
                <div className="w-full bg-white rounded-[12px] border border-[#E5E7EB] p-6 flex flex-col gap-6">
                    {/* Header with Icon */}
                    <div className="flex items-center gap-3">
                        <div className="w-[40px] h-[40px] rounded-full bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-poppins font-[600] text-lg text-primary">{name}</h3>
                            <p className="text-sm text-[#58556A] font-poppins">{email}</p>
                        </div>
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                        <div className="w-[80px] h-[80px] rounded-full bg-[#E5E7EB] flex items-center justify-center">
                            <span className="text-[#6B7280] font-poppins font-[600] text-3xl">{getInitial()}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleAvatarChange}
                                className="px-4 py-2 rounded-[8px] border border-[#E5E7EB] bg-white text-sm font-poppins font-[500] text-primary hover:bg-[#F9FAFB] transition-colors"
                            >
                                Change
                            </button>
                            <button
                                onClick={handleAvatarRemove}
                                className="px-4 py-2 rounded-[8px] border border-[#E5E7EB] bg-white text-sm font-poppins font-[500] text-primary hover:bg-[#F9FAFB] transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    </div>

                    {/* Name Field */}
                    <div className="flex items-center justify-between py-3 border-b border-[#F3F4F6]">
                        <div className="w-full flex flex-col gap-1">
                            <span className="text-sm font-poppins font-[500] text-primary">Name</span>
                            {!isEditingName ? (
                                <span className="text-sm font-poppins text-[#58556A]">{name}</span>
                            ) : (
                                <form onSubmit={handleNameUpdate} className="w-full flex flex-col gap-1">
                                    <input
                                        type="text"
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        className="w-full rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow h-[40px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent border-[#E5E7EB]"
                                    />
                                    {nameError && <p className="text-xs text-rose-600 mt-1">{nameError}</p>}
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditingName(false)
                                                setNameInput(name)
                                                setNameError('')
                                            }}
                                            className="px-3 py-1.5 text-sm font-poppins font-[500] border border-[#E5E7EB] rounded-[6px] bg-white text-primary hover:bg-[#F9FAFB] transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-3 py-1.5 text-sm font-poppins font-[500] bg-accent text-white rounded-[6px] hover:opacity-90 transition-opacity"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                        {!isEditingName && (
                            <button
                                onClick={() => {
                                    setIsEditingName(true)
                                    setNameInput(name)
                                }}
                                className="text-sm font-poppins font-[500] text-primary hover:text-accent transition-colors"
                            >
                                Edit
                            </button>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="flex items-center justify-between py-3 border-b border-[#F3F4F6]">
                        <div className="w-full flex flex-col gap-1">
                            <span className="text-sm font-poppins font-[500] text-primary">Email</span>
                            {!isEditingEmail ? (
                                <span className="text-sm font-poppins text-[#58556A]">{email}</span>
                            ) : (
                                <form onSubmit={handleEmailUpdate} className="w-full flex flex-col gap-1">
                                    <input
                                        type="email"
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        className="w-full rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow h-[40px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent border-[#E5E7EB]"
                                    />
                                    {emailError && <p className="text-xs text-rose-600 mt-1">{emailError}</p>}
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditingEmail(false)
                                                setEmailInput(email)
                                                setEmailError('')
                                            }}
                                            className="px-3 py-1.5 text-sm font-poppins font-[500] border border-[#E5E7EB] rounded-[6px] bg-white text-primary hover:bg-[#F9FAFB] transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-3 py-1.5 text-sm font-poppins font-[500] bg-accent text-white rounded-[6px] hover:opacity-90 transition-opacity"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                        {!isEditingEmail && (
                            <button
                                onClick={() => {
                                    setIsEditingEmail(true)
                                    setEmailInput(email)
                                }}
                                className="text-sm font-poppins font-[500] text-primary hover:text-accent transition-colors"
                            >
                                Edit
                            </button>
                        )}
                    </div>

                    {/* Wallet Field */}
                    <div className="flex items-center justify-between py-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-poppins font-[500] text-primary">Wallet</span>
                            <span className="text-sm font-poppins text-[#58556A]">Wallet not connected</span>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="w-full bg-white rounded-[12px] border border-[#E5E7EB] p-6 flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-[40px] h-[40px] rounded-full bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center">
                            <FiLock className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-poppins font-[600] text-lg text-primary">Security</h3>
                    </div>

                    {/* Password */}
                    <div className="flex items-center justify-between py-3">
                        <div className="w-full flex flex-col gap-1">
                            <span className="text-sm font-poppins font-[500] text-primary">Password</span>
                            {!isEditingPassword ? (
                                <span className="text-sm font-poppins text-[#58556A]">**************</span>
                            ) : (
                                <form onSubmit={handlePasswordUpdate} className="w-full flex flex-col gap-1">
                                    <input
                                        type="password"
                                        value={passwordInput}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        placeholder="Enter new password"
                                        className="w-full rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow h-[40px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent border-[#E5E7EB]"
                                    />
                                    {passwordError && <p className="text-xs text-rose-600 mt-1">{passwordError}</p>}
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditingPassword(false)
                                                setPasswordInput('')
                                                setPasswordError('')
                                            }}
                                            className="px-3 py-1.5 text-sm font-poppins font-[500] border border-[#E5E7EB] rounded-[6px] bg-white text-primary hover:bg-[#F9FAFB] transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-3 py-1.5 text-sm font-poppins font-[500] bg-accent text-white rounded-[6px] hover:opacity-90 transition-opacity"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                        {!isEditingPassword && (
                            <button
                                onClick={() => setIsEditingPassword(true)}
                                className="text-sm font-poppins font-[500] text-primary hover:text-accent transition-colors"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                {/* Danger Zone Section */}
                <div className="w-full bg-white rounded-[12px] border border-[#E5E7EB] p-6 flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-[40px] h-[40px] rounded-full bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center">
                            <RiErrorWarningLine className="w-5 h-5 text-[#DC2626]" />
                        </div>
                        <h3 className="font-poppins font-[600] text-lg text-primary">Danger zone</h3>
                    </div>

                    {/* Delete Account Button */}
                    <button
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="w-fit px-4 py-2 rounded-[8px] border border-[#DC2626] bg-white text-sm font-poppins font-[500] text-[#DC2626] hover:bg-[#FEF2F2] transition-colors flex items-center gap-2"
                    >
                        <RiErrorWarningLine className="w-4 h-4" />
                        Delete account
                    </button>
                </div>
            </div>

            {/* Delete Account Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span className="w-[40px] h-[40px] flex justify-center items-center bg-[#FEF2F2] border-[0.5px] border-[#FEE2E2] shadow-[0px_1px_2px_0px_#00000014] rounded-full">
                                <RiErrorWarningLine className="w-5 h-5 text-[#DC2626]" />
                            </span>
                            <span className="text-black font-[500] font-sora capitalize text-sm">delete account</span>
                        </DialogTitle>
                        <DialogDescription className="font-poppins text-sm text-[#58556A] pt-2">
                            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex flex-col gap-2 sm:flex-col pt-4">
                        <button
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="w-full h-[40px] flex justify-center items-center rounded-[8px] border border-[#E5E7EB] text-primary font-poppins font-[500] text-[12px] capitalize hover:bg-[#F9FAFB] transition-colors"
                        >
                            cancel
                        </button>
                        <button
                            onClick={handleDeleteAccount}
                            className="w-full h-[40px] flex justify-center items-center rounded-[8px] bg-[#DC2626] text-white font-poppins font-[500] text-[12px] capitalize hover:bg-[#B91C1C] transition-colors"
                        >
                            yes, delete account
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UserAccountSettings
