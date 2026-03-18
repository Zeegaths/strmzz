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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FiUserPlus } from 'react-icons/fi'

interface TeamMember {
    id: string
    name: string
    email: string
    role: 'Owner' | 'Admin' | 'Viewer'
    lastLogin: string
    time: string
}

const TeamTab = () => {
    const [teamMembers] = useState<TeamMember[]>([
        {
            id: '1',
            name: 'Cosmos Nduka',
            email: 'Cosmos@coscharismotors.com',
            role: 'Owner',
            lastLogin: 'Aug 5, 2024',
            time: '10:25'
        },
        {
            id: '2',
            name: 'David Adeleke',
            email: 'David@coscharismotors.com',
            role: 'Admin',
            lastLogin: 'Aug 5, 2024',
            time: '00:05'
        }
    ])

    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteRole, setInviteRole] = useState('')

    return (
        <div className="w-full max-w-[960px] mx-auto flex flex-col gap-4 py-6">
            {/* Invite Button */}
            <div className="w-full flex justify-end">
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="h-[40px] px-4 flex items-center gap-2 bg-gradient-to-b from-[#02C76A] to-[#00A859] rounded-[8px] shadow-[0px_-3px_2.7px_0px_#029751_inset] text-white font-poppins font-[500] text-sm">
                            <span className="text-lg">+</span>
                            Invite team member
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <span className="w-[40px] h-[40px] flex justify-center items-center bg-white border-[0.5px] border-[#E5E7EB] shadow-[0px_1px_2px_0px_#00000014] rounded-full">
                                    <FiUserPlus className="w-4 h-4 text-primary" />
                                </span>
                                <span className="text-black font-[500] font-sora text-sm">Invite team member</span>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {/* Email */}
                            <div className='w-full flex flex-col gap-2'>
                                <label htmlFor="email" className="font-poppins text-[14px] text-[#58556A] leading-[24px]">Email address</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder='Zeddicus@coscharismotors.com'
                                    className="w-full rounded-[8px] border bg-[#F9FAFB] border-[#E5E7EB] shadow-navbarShadow h-[44px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent"
                                />
                            </div>

                            {/* Role */}
                            <div className='w-full flex flex-col gap-2'>
                                <label htmlFor="role" className="font-poppins text-[14px] text-[#58556A] leading-[24px]">Role</label>
                                <Select value={inviteRole} onValueChange={setInviteRole}>
                                    <SelectTrigger className="focus:ring-0 focus:outline-none w-full rounded-[8px] border bg-[#F9FAFB] border-[#E5E7EB] shadow-navbarShadow h-[44px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent">
                                        <SelectValue placeholder="Admin" />
                                    </SelectTrigger>
                                    <SelectContent className="focus:ring-0 focus:outline-none z-[99999]">
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <button type="button" className='w-full h-[40px] flex justify-center items-center rounded-[8px] bg-accent text-[#FFFFFF] font-poppins font-[500] shadow-joinWaitlistBtnShadow text-shadow text-[12px]'>
                                Invite team member
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Team Table */}
            <div className="w-full overflow-x-auto bg-white border border-[#E5E7EB] rounded-[12px]">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-[600] font-poppins text-[#58556A]">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-[600] font-poppins text-[#58556A]">Email address</th>
                            <th className="px-4 py-3 text-left text-sm font-[600] font-poppins text-[#58556A]">Role</th>
                            <th className="px-4 py-3 text-left text-sm font-[600] font-poppins text-[#58556A]">Last login</th>
                            <th className="px-4 py-3 text-left text-sm font-[600] font-poppins text-[#58556A]">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamMembers.map((member) => (
                            <tr key={member.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                                <td className="px-4 py-4">
                                    <span className="text-[#050020] font-poppins font-[400] text-sm">{member.name}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-[#58556A] font-poppins font-[400] text-sm">{member.email}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-[#58556A] font-poppins font-[400] text-sm">{member.role}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-[#58556A] font-poppins font-[400] text-sm">{member.lastLogin}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-[#58556A] font-poppins font-[400] text-sm">{member.time}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TeamTab
