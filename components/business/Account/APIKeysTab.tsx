'use client'
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost, apiDelete } from '@/lib/api'
import { toast } from 'sonner'
import { FiCopy, FiTrash2, FiPlus, FiEye, FiEyeOff } from 'react-icons/fi'

interface ApiKey {
    id: string
    prefix: string
    keyType: 'public' | 'secret'
    environment: 'live' | 'test'
    active: boolean
    requestCount: number
    lastUsedAt: string | null
    createdAt: string
}

const APIKeysTab = () => {
    const queryClient = useQueryClient()
    const [newKeys, setNewKeys] = useState<{ publicKey?: string; secretKey?: string } | null>(null)
    const [showSecret, setShowSecret] = useState(false)

    const { data: keysRes, isLoading } = useQuery({
        queryKey: ['api-keys'],
        queryFn: () => apiGet('/merchants/me/api-keys'),
    })

    const keys: ApiKey[] = (keysRes?.data || keysRes?.message || []) as ApiKey[]

    const generateMutation = useMutation({
        mutationFn: (env: string) => apiPost('/merchants/me/api-keys', { environment: env }),
        onSuccess: (res) => {
            if (res.success) {
                const data = res.data || res.message
                setNewKeys(data)
                queryClient.invalidateQueries({ queryKey: ['api-keys'] })
                toast.success('API keys generated! Save them — they won\'t be shown again.', {
                    position: 'top-right',
                    duration: 10000,
                })
            } else {
                toast.error(res.error || 'Failed to generate keys', { position: 'top-right' })
            }
        },
    })

    const revokeMutation = useMutation({
        mutationFn: (keyId: string) => apiDelete(`/merchants/me/api-keys/${keyId}`),
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ['api-keys'] })
                toast.success('API key revoked', { position: 'top-right' })
            }
        },
    })

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied!`, { position: 'top-right' })
    }

    return (
        <div className='w-full flex flex-col gap-6'>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className='text-[#050020] font-sora font-[600] text-lg'>API Keys</h3>
                    <p className='text-[#58556A] font-poppins text-sm mt-1'>Manage your API keys for SDK integration</p>
                </div>
                <button
                    onClick={() => generateMutation.mutate('live')}
                    disabled={generateMutation.isPending}
                    className='flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-[8px] font-poppins text-sm hover:bg-accent/90 disabled:opacity-50 transition-colors'
                >
                    <FiPlus className='w-4 h-4' />
                    {generateMutation.isPending ? 'Generating...' : 'Generate Keys'}
                </button>
            </div>

            {/* Newly generated keys — shown once */}
            {newKeys && (
                <div className='w-full p-4 bg-[#E7FEF3] border border-[#02C76A]/20 rounded-[12px] flex flex-col gap-3'>
                    <p className='text-[#01753E] font-poppins font-[600] text-sm'>
                        Save these keys now — they won&apos;t be shown again!
                    </p>
                    {newKeys.publicKey && (
                        <div className='flex items-center gap-2'>
                            <span className='text-[#58556A] font-poppins text-sm w-20'>Public:</span>
                            <code className='flex-1 text-sm font-mono bg-white px-3 py-1.5 rounded border truncate'>
                                {newKeys.publicKey}
                            </code>
                            <button onClick={() => copyToClipboard(newKeys.publicKey!, 'Public key')} className='text-[#6B7280] hover:text-[#050020]'>
                                <FiCopy className='w-4 h-4' />
                            </button>
                        </div>
                    )}
                    {newKeys.secretKey && (
                        <div className='flex items-center gap-2'>
                            <span className='text-[#58556A] font-poppins text-sm w-20'>Secret:</span>
                            <code className='flex-1 text-sm font-mono bg-white px-3 py-1.5 rounded border truncate'>
                                {showSecret ? newKeys.secretKey : '••••••••••••••••••••••••'}
                            </code>
                            <button onClick={() => setShowSecret(!showSecret)} className='text-[#6B7280] hover:text-[#050020]'>
                                {showSecret ? <FiEyeOff className='w-4 h-4' /> : <FiEye className='w-4 h-4' />}
                            </button>
                            <button onClick={() => copyToClipboard(newKeys.secretKey!, 'Secret key')} className='text-[#6B7280] hover:text-[#050020]'>
                                <FiCopy className='w-4 h-4' />
                            </button>
                        </div>
                    )}
                    <button
                        onClick={() => setNewKeys(null)}
                        className='self-end text-[#58556A] font-poppins text-xs hover:underline mt-1'
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Existing keys list */}
            <div className='w-full bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden'>
                <div className='grid grid-cols-5 gap-4 px-4 py-3 bg-[#F9FAFB] border-b border-[#E5E7EB]'>
                    <span className='text-[#58556A] font-poppins font-[500] text-xs uppercase'>Prefix</span>
                    <span className='text-[#58556A] font-poppins font-[500] text-xs uppercase'>Type</span>
                    <span className='text-[#58556A] font-poppins font-[500] text-xs uppercase'>Env</span>
                    <span className='text-[#58556A] font-poppins font-[500] text-xs uppercase'>Requests</span>
                    <span className='text-[#58556A] font-poppins font-[500] text-xs uppercase text-right'>Actions</span>
                </div>

                {isLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className='grid grid-cols-5 gap-4 px-4 py-3 border-b border-[#E5E7EB]'>
                            <span className='w-24 h-4 bg-gray-100 rounded animate-pulse' />
                            <span className='w-16 h-4 bg-gray-100 rounded animate-pulse' />
                            <span className='w-12 h-4 bg-gray-100 rounded animate-pulse' />
                            <span className='w-8 h-4 bg-gray-100 rounded animate-pulse' />
                            <span className='w-8 h-4 bg-gray-100 rounded animate-pulse ml-auto' />
                        </div>
                    ))
                ) : keys.length === 0 ? (
                    <div className='px-4 py-8 text-center'>
                        <p className='text-[#58556A] font-poppins text-sm'>No API keys yet. Generate your first pair above.</p>
                    </div>
                ) : (
                    keys.map((key) => (
                        <div key={key.id} className='grid grid-cols-5 gap-4 px-4 py-3 border-b border-[#E5E7EB] last:border-b-0'>
                            <code className='text-sm font-mono text-[#050020] truncate'>{key.prefix}...</code>
                            <span className={`font-poppins text-xs px-2 py-0.5 rounded-md w-fit ${key.keyType === 'secret' ? 'text-[#723B13] bg-[#FDFDEA]' : 'text-[#01753E] bg-[#E7FEF3]'}`}>
                                {key.keyType}
                            </span>
                            <span className='text-[#58556A] font-poppins text-sm'>{key.environment}</span>
                            <span className='text-[#58556A] font-poppins text-sm'>{key.requestCount}</span>
                            <div className='flex justify-end'>
                                <button
                                    onClick={() => {
                                        if (confirm('Revoke this API key? This cannot be undone.')) {
                                            revokeMutation.mutate(key.id)
                                        }
                                    }}
                                    className='text-red-400 hover:text-red-600 transition-colors'
                                    title='Revoke key'
                                >
                                    <FiTrash2 className='w-4 h-4' />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default APIKeysTab