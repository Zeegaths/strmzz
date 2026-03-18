'use client'
import React, { useState } from 'react'
import { FiUser, FiLock } from 'react-icons/fi'
import { z } from 'zod'

const businessNameSchema = z.object({
    businessName: z.string()
        .min(2, 'Too short!')
        .max(100, 'Too long!'),
})

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

const ProfileTab = () => {
    const [businessName, setBusinessName] = useState('Coscharis motors')
    const [name, setName] = useState('Gregory Donald')
    const [email, setEmail] = useState('Cosmos@coscharismotors.com')

    const [isEditingBusinessName, setIsEditingBusinessName] = useState(false)
    const [isEditingName, setIsEditingName] = useState(false)
    const [isEditingEmail, setIsEditingEmail] = useState(false)
    const [isEditingPassword, setIsEditingPassword] = useState(false)

    const [businessNameInput, setBusinessNameInput] = useState(businessName)
    const [nameInput, setNameInput] = useState(name)
    const [emailInput, setEmailInput] = useState(email)
    const [passwordInput, setPasswordInput] = useState('')

    const [businessNameError, setBusinessNameError] = useState('')
    const [nameError, setNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const handleBusinessNameUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        try {
            businessNameSchema.parse({ businessName: businessNameInput })
            setBusinessName(businessNameInput)
            setIsEditingBusinessName(false)
            setBusinessNameError('')
        } catch (error) {
            if (error instanceof z.ZodError) {
                setBusinessNameError(error.errors[0]?.message || 'Invalid input')
            }
        }
    }

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
        } catch (error) {
            if (error instanceof z.ZodError) {
                setPasswordError(error.errors[0]?.message || 'Invalid input')
            }
        }
    }

    return (
        <div className="w-full max-w-[516px] mx-auto flex flex-col gap-4 py-6">
            {/* Business Profile Section */}
            <div className="w-full bg-white rounded-[12px] border border-[#E5E7EB] p-6 flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="w-[40px] h-[40px] rounded-full bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-sora font-[600] text-lg text-primary">Coscharis Motors</h3>
                        <p className="text-sm text-[#58556A] font-poppins">{email}</p>
                    </div>
                </div>

                {/* Avatar Upload */}
                <div className="flex items-center gap-4">
                    <div className="w-[80px] h-[80px] rounded-full bg-[#E5E7EB] flex items-center justify-center">
                        <FiUser className="w-10 h-10 text-[#6B7280]" />
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-[8px] border border-[#E5E7EB] bg-white text-sm font-poppins font-[500] text-primary hover:bg-[#F9FAFB] transition-colors">
                            Change
                        </button>
                        <button className="px-4 py-2 rounded-[8px] border border-[#E5E7EB] bg-white text-sm font-poppins font-[500] text-[#DC2626] hover:bg-[#FEF2F2] transition-colors">
                            Remove
                        </button>
                    </div>
                </div>

                {/* Business Name */}
                <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                    <div className="w-full flex flex-col gap-1">
                        <span className="text-sm font-poppins font-[500] text-primary">Business name</span>
                        {!isEditingBusinessName ? (
                            <span className="text-sm font-poppins text-[#58556A]">{businessName}</span>
                        ) : (
                            <form onSubmit={handleBusinessNameUpdate} className='w-full flex flex-col gap-1'>
                                <input
                                    type="text"
                                    value={businessNameInput}
                                    onChange={(e) => setBusinessNameInput(e.target.value)}
                                    className="w-full rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow h-[40px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent border-[#E5E7EB]"
                                />
                                {businessNameError && <p className="text-xs text-rose-600">{businessNameError}</p>}
                                <div className='flex gap-2 mt-1'>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditingBusinessName(false)
                                            setBusinessNameInput(businessName)
                                            setBusinessNameError('')
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
                    {!isEditingBusinessName && (
                        <button onClick={() => {
                            setIsEditingBusinessName(true)
                            setBusinessNameInput(businessName)
                        }} className="text-sm font-poppins font-[500] text-primary hover:text-accent transition-colors">
                            Edit
                        </button>
                    )}
                </div>

                {/* Name */}
                <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                    <div className="w-full flex flex-col gap-1">
                        <span className="text-sm font-poppins font-[500] text-primary">Name</span>
                        {!isEditingName ? (
                            <span className="text-sm font-poppins text-[#58556A]">{name}</span>
                        ) : (
                            <form onSubmit={handleNameUpdate} className='w-full flex flex-col gap-1'>
                                <input
                                    type="text"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    className="w-full rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow h-[40px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent border-[#E5E7EB]"
                                />
                                {nameError && <p className="text-xs text-rose-600">{nameError}</p>}
                                <div className='flex gap-2 mt-1'>
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
                        <button onClick={() => {
                            setIsEditingName(true)
                            setNameInput(name)
                        }} className="text-sm font-poppins font-[500] text-primary hover:text-accent transition-colors">
                            Edit
                        </button>
                    )}
                </div>

                {/* Email */}
                <div className="flex items-center justify-between py-2">
                    <div className="w-full flex flex-col gap-1">
                        <span className="text-sm font-poppins font-[500] text-primary">Email</span>
                        {!isEditingEmail ? (
                            <span className="text-sm font-poppins text-[#58556A]">{email}</span>
                        ) : (
                            <form onSubmit={handleEmailUpdate} className='w-full flex flex-col gap-1'>
                                <input
                                    type="email"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    className="w-full rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow h-[40px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent border-[#E5E7EB]"
                                />
                                {emailError && <p className="text-xs text-rose-600">{emailError}</p>}
                                <div className='flex gap-2 mt-1'>
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
                        <button onClick={() => {
                            setIsEditingEmail(true)
                            setEmailInput(email)
                        }} className="text-sm font-poppins font-[500] text-primary hover:text-accent transition-colors">
                            Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Security Section */}
            <div className="w-full bg-white rounded-[12px] border border-[#E5E7EB] p-6 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="w-[40px] h-[40px] rounded-full bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center">
                        <FiLock className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-sora font-[600] text-lg text-primary">Security</h3>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between py-2">
                    <div className="w-full flex flex-col gap-1">
                        <span className="text-sm font-poppins font-[500] text-primary">Password</span>
                        {!isEditingPassword ? (
                            <span className="text-sm font-poppins text-[#58556A]">••••••••••••</span>
                        ) : (
                            <form onSubmit={handlePasswordUpdate} className='w-full flex flex-col gap-1'>
                                <input
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow h-[40px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent border-[#E5E7EB]"
                                />
                                {passwordError && <p className="text-xs text-rose-600">{passwordError}</p>}
                                <div className='flex gap-2 mt-1'>
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
                        <button onClick={() => setIsEditingPassword(true)} className="text-sm font-poppins font-[500] text-primary hover:text-accent transition-colors">
                            Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfileTab
