'use client'
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPut } from '@/lib/api'
import { toast } from 'sonner'
import { FiCopy, FiSave } from 'react-icons/fi'

const WebhooksTab = () => {
    const queryClient = useQueryClient()
    const [webhookUrl, setWebhookUrl] = useState('')

    const { data: merchantRes, isLoading } = useQuery({
        queryKey: ['merchant-profile'],
        queryFn: () => apiGet('/merchants/me'),
    })

    const merchant = merchantRes?.data || merchantRes?.message || null

    useEffect(() => {
        if (merchant?.webhookUrl) {
            setWebhookUrl(merchant.webhookUrl)
        }
    }, [merchant])

    const updateWebhook = useMutation({
        mutationFn: (url: string) => apiPut('/merchants/me/webhooks', { webhookUrl: url }),
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ['merchant-profile'] })
                toast.success('Webhook URL updated!', { position: 'top-right' })
            } else {
                toast.error(res.error || 'Failed to update webhook', { position: 'top-right' })
            }
        },
    })

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied!`, { position: 'top-right' })
    }

    return (
        <div className='w-full flex flex-col gap-6'>
            <div>
                <h3 className='text-[#050020] font-sora font-[600] text-lg'>Webhooks</h3>
                <p className='text-[#58556A] font-poppins text-sm mt-1'>
                    Get notified when payments are processed
                </p>
            </div>

            {/* Webhook URL */}
            <div className='w-full bg-white rounded-[12px] border border-[#E5E7EB] p-6 flex flex-col gap-4'>
                <h4 className='text-[#050020] font-poppins font-[500] text-sm'>Webhook Endpoint</h4>
                <p className='text-[#58556A] font-poppins text-xs'>
                    Strimz will send POST requests to this URL when payment events occur.
                </p>

                <div className='flex gap-2'>
                    <input
                        type='url'
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder='https://your-app.com/api/webhooks/strimz'
                        className='flex-1 h-[44px] px-4 rounded-[8px] border border-[#E5E7EB] bg-white font-poppins text-sm focus:outline-none focus:border-accent transition-colors'
                    />
                    <button
                        onClick={() => updateWebhook.mutate(webhookUrl)}
                        disabled={updateWebhook.isPending || !webhookUrl}
                        className='flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-[8px] font-poppins text-sm hover:bg-accent/90 disabled:opacity-50 transition-colors'
                    >
                        <FiSave className='w-4 h-4' />
                        {updateWebhook.isPending ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Webhook Secret */}
            {merchant?.webhookSecret && (
                <div className='w-full bg-white rounded-[12px] border border-[#E5E7EB] p-6 flex flex-col gap-4'>
                    <h4 className='text-[#050020] font-poppins font-[500] text-sm'>Signing Secret</h4>
                    <p className='text-[#58556A] font-poppins text-xs'>
                        Use this secret to verify webhook signatures in your server.
                    </p>

                    <div className='flex items-center gap-2'>
                        <code className='flex-1 text-sm font-mono bg-[#F9FAFB] px-3 py-2 rounded border border-[#E5E7EB] truncate'>
                            {merchant.webhookSecret}
                        </code>
                        <button
                            onClick={() => copyToClipboard(merchant.webhookSecret, 'Webhook secret')}
                            className='text-[#6B7280] hover:text-[#050020] transition-colors'
                        >
                            <FiCopy className='w-4 h-4' />
                        </button>
                    </div>
                </div>
            )}

            {/* Event Types */}
            <div className='w-full bg-white rounded-[12px] border border-[#E5E7EB] p-6 flex flex-col gap-4'>
                <h4 className='text-[#050020] font-poppins font-[500] text-sm'>Event Types</h4>

                <div className='flex flex-col gap-2'>
                    {[
                        { event: 'payment.completed', desc: 'A payment was successfully processed' },
                        { event: 'payment.failed', desc: 'A payment attempt failed' },
                        { event: 'subscription.created', desc: 'A new subscription was created' },
                        { event: 'subscription.charged', desc: 'A subscription was successfully charged' },
                        { event: 'subscription.cancelled', desc: 'A subscription was cancelled' },
                    ].map((item) => (
                        <div key={item.event} className='flex justify-between items-center py-2 border-b border-[#E5E7EB] last:border-b-0'>
                            <div className='flex flex-col'>
                                <code className='text-sm font-mono text-[#050020]'>{item.event}</code>
                                <span className='text-[#9CA3AF] font-poppins text-xs'>{item.desc}</span>
                            </div>
                            <span className='text-[#02C76A] font-poppins text-xs font-[500] bg-[#E7FEF3] px-2 py-0.5 rounded'>
                                Active
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default WebhooksTab