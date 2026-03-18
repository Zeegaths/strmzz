'use client'
import React, { useState } from 'react'
import AirtimeForm from './AirtimeForm'
import DataForm from './DataForm'
import CableTvForm from './CableTvForm'
import ElectricityForm from './ElectricityForm'
import SuccessState from './SuccessState'

type UtilityType = 'airtime' | 'data' | 'cable' | 'electricity'

const UtilityBills = () => {
    const [activeTab, setActiveTab] = useState<UtilityType>('airtime')
    const [showSuccess, setShowSuccess] = useState(false)

    const handleSuccess = () => {
        setShowSuccess(true)
    }

    const handleSuccessComplete = () => {
        setShowSuccess(false)
    }

    if (showSuccess) {
        return <SuccessState onComplete={handleSuccessComplete} />
    }

    const tabs = [
        { id: 'airtime' as UtilityType, label: 'Airtime' },
        { id: 'data' as UtilityType, label: 'Data' },
        { id: 'cable' as UtilityType, label: 'Cable TV' },
        { id: 'electricity' as UtilityType, label: 'Electricity' },
    ]

    return (
        <section className="w-full flex flex-col gap-4">
            {/* Header */}
            <div className='w-full flex flex-col gap-1'>
                <h4 className="text-primary capitalize font-poppins font-[600] md:text-xl text-lg">Utility bills</h4>
                <p className="text-sm text-[#58556A] font-poppins font-[400]">
                    Seamlessly pay for your utilities
                </p>
            </div>

            {/* Content */}
            <div className='w-full max-w-[516px] mx-auto flex flex-col gap-6'>
                {/* Tab Navigation */}
                <div className='w-full flex items-center gap-2 bg-[#F3F4F6] rounded-[12px] p-1'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-2.5 px-4 rounded-[8px] font-poppins font-[500] text-sm transition-all ${
                                activeTab === tab.id
                                    ? 'bg-white text-black shadow-sm'
                                    : 'bg-transparent text-[#58556A] hover:text-black'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Forms */}
                <div className='w-full'>
                    {activeTab === 'airtime' && <AirtimeForm onSuccess={handleSuccess} />}
                    {activeTab === 'data' && <DataForm onSuccess={handleSuccess} />}
                    {activeTab === 'cable' && <CableTvForm onSuccess={handleSuccess} />}
                    {activeTab === 'electricity' && <ElectricityForm onSuccess={handleSuccess} />}
                </div>
            </div>
        </section>
    )
}

export default UtilityBills