import React from 'react'
import { Shield, Lock, CheckCircle2, FileCheck } from 'lucide-react'

/**
 * TrustBadges component displays security and trust indicators.
 * Shows key security features to build confidence in the platform.
 * Designed to be subtle yet reassuring for potential users.
 */
const TrustBadges = () => {
    const badges = [
        {
            icon: <Shield className="w-6 h-6 text-accent" />,
            title: 'Blockchain Verified',
            description: 'All transactions verified on-chain'
        },
        {
            icon: <Lock className="w-6 h-6 text-accent" />,
            title: 'Encrypted Transactions',
            description: 'End-to-end encryption for security'
        },
        {
            icon: <FileCheck className="w-6 h-6 text-accent" />,
            title: 'Audited Smart Contracts',
            description: 'Professionally audited code'
        },
        {
            icon: <CheckCircle2 className="w-6 h-6 text-accent" />,
            title: 'Instant Verification',
            description: 'Real-time payment confirmation'
        }
    ]

    return (
        <section className="w-full bg-white border-y border-[#E5E7EB] py-12 md:py-16 px-4">
            <main className="w-full max-w-[1200px] mx-auto">
                {/* Optional Header */}
                <div className="text-center mb-10">
                    <p className="text-[#58556A] font-poppins font-[500] text-sm uppercase tracking-wider mb-2">
                        Trusted & Secure
                    </p>
                </div>

                {/* Badges Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {badges.map((badge, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center"
                        >
                            {/* Icon Circle */}
                            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                                {badge.icon}
                            </div>

                            {/* Title */}
                            <h4 className="text-primary font-poppins font-[600] text-base mb-1">
                                {badge.title}
                            </h4>

                            {/* Description */}
                            <p className="text-[#58556A] font-poppins font-[400] text-sm">
                                {badge.description}
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </section>
    )
}

export default TrustBadges
