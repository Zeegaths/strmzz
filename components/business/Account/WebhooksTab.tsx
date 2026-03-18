'use client'
import React, { useState } from 'react'
import { FiGlobe } from 'react-icons/fi'

const WebhooksTab = () => {
    const [liveWebhookUrl, setLiveWebhookUrl] = useState('')
    const [liveCallbackUrl, setLiveCallbackUrl] = useState('')
    const [testWebhookUrl, setTestWebhookUrl] = useState('')
    const [testCallbackUrl, setTestCallbackUrl] = useState('')

    const isLiveSaveDisabled = !liveWebhookUrl || !liveCallbackUrl
    const isTestSaveDisabled = !testWebhookUrl || !testCallbackUrl

    return (
        <div className="w-full max-w-[516px] mx-auto flex flex-col gap-8 py-6">
            {/* Live Webhook */}
            <div className="w-full flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-[40px] h-[40px] rounded-full bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center">
                        <FiGlobe className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-sora font-[600] text-lg text-primary">Live webhook</h3>
                </div>

                {/* Webhook URL */}
                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="live-webhook-url" className="font-poppins text-[14px] text-[#58556A] leading-[24px]">Webhook URL</label>
                    <input
                        type="text"
                        name="live-webhook-url"
                        id="live-webhook-url"
                        value={liveWebhookUrl}
                        onChange={(e) => setLiveWebhookUrl(e.target.value)}
                        placeholder='Enter webhook URL'
                        className="w-full rounded-[8px] border bg-[#F9FAFB] border-[#E5E7EB] shadow-navbarShadow h-[44px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent"
                    />
                </div>

                {/* Callback URL */}
                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="live-callback-url" className="font-poppins text-[14px] text-[#58556A] leading-[24px]">Callback URL</label>
                    <input
                        type="text"
                        name="live-callback-url"
                        id="live-callback-url"
                        value={liveCallbackUrl}
                        onChange={(e) => setLiveCallbackUrl(e.target.value)}
                        placeholder='Enter callback URL'
                        className="w-full rounded-[8px] border bg-[#F9FAFB] border-[#E5E7EB] shadow-navbarShadow h-[44px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent"
                    />
                </div>

                {/* Save Button */}
                <div>
                    <button
                        type="button"
                        disabled={isLiveSaveDisabled}
                        className={`h-[40px] px-6 flex items-center rounded-[8px] font-poppins font-[500] text-sm transition-colors ${
                            isLiveSaveDisabled
                                ? 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                                : 'bg-accent text-white shadow-joinWaitlistBtnShadow text-shadow hover:opacity-90'
                        }`}
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* Test Webhook */}
            <div className="w-full flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-[40px] h-[40px] rounded-full bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center">
                        <FiGlobe className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-sora font-[600] text-lg text-primary">Test webhook</h3>
                </div>

                {/* Webhook URL */}
                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="test-webhook-url" className="font-poppins text-[14px] text-[#58556A] leading-[24px]">Webhook URL</label>
                    <input
                        type="text"
                        name="test-webhook-url"
                        id="test-webhook-url"
                        value={testWebhookUrl}
                        onChange={(e) => setTestWebhookUrl(e.target.value)}
                        placeholder='Enter webhook URL'
                        className="w-full rounded-[8px] border bg-[#F9FAFB] border-[#E5E7EB] shadow-navbarShadow h-[44px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent"
                    />
                </div>

                {/* Callback URL */}
                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="test-callback-url" className="font-poppins text-[14px] text-[#58556A] leading-[24px]">Callback URL</label>
                    <input
                        type="text"
                        name="test-callback-url"
                        id="test-callback-url"
                        value={testCallbackUrl}
                        onChange={(e) => setTestCallbackUrl(e.target.value)}
                        placeholder='Enter callback URL'
                        className="w-full rounded-[8px] border bg-[#F9FAFB] border-[#E5E7EB] shadow-navbarShadow h-[44px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-primary px-4 outline-none transition duration-300 focus:border-accent"
                    />
                </div>

                {/* Save Button */}
                <div>
                    <button
                        type="button"
                        disabled={isTestSaveDisabled}
                        className={`h-[40px] px-6 flex items-center rounded-[8px] font-poppins font-[500] text-sm transition-colors ${
                            isTestSaveDisabled
                                ? 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                                : 'bg-accent text-white shadow-joinWaitlistBtnShadow text-shadow hover:opacity-90'
                        }`}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default WebhooksTab
