'use client'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { FiCheck } from 'react-icons/fi'

interface SuccessStateProps {
    onComplete: () => void
}

const SuccessState = ({ onComplete }: SuccessStateProps) => {
    const [windowDimensions, setWindowDimensions] = useState({
        width: 0,
        height: 0
    })
    const [showConfetti, setShowConfetti] = useState(true)

    useEffect(() => {
        // Set window dimensions
        setWindowDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        })

        // Stop confetti and call onComplete after 5 seconds
        const timer = setTimeout(() => {
            setShowConfetti(false)
            onComplete()
        }, 5000)

        return () => clearTimeout(timer)
    }, [onComplete])

    return (
        <div className="w-full flex items-center justify-center py-20">
            {showConfetti && (
                <Confetti
                    width={windowDimensions.width}
                    height={windowDimensions.height}
                    recycle={false}
                    numberOfPieces={500}
                    colors={['#02C76A', '#00A859', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']}
                />
            )}

            <div className="flex flex-col items-center gap-6">
                {/* Success Icon with Confetti Dots */}
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center">
                        <FiCheck className="w-12 h-12 text-white stroke-[3]" />
                    </div>

                    {/* Decorative confetti dots around the icon */}
                    <div className="absolute -top-2 -left-2 w-3 h-3 rounded-full bg-accent" />
                    <div className="absolute -top-4 right-4 w-2 h-2 rounded-full bg-[#F59E0B]" />
                    <div className="absolute top-2 -right-4 w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                    <div className="absolute -bottom-2 left-8 w-2 h-2 rounded-full bg-[#8B5CF6]" />
                    <div className="absolute bottom-4 -right-2 w-3 h-3 rounded-full bg-[#EF4444]" />
                    <div className="absolute -bottom-4 -left-4 w-2 h-2 rounded-full bg-[#F59E0B]" />
                </div>

                {/* Success Message */}
                <div className="flex flex-col items-center gap-2">
                    <h2 className="font-poppins font-[600] text-2xl md:text-3xl text-primary text-center">
                        Payment Successful!
                    </h2>
                    <p className="font-poppins text-[16px] text-[#58556A] text-center max-w-md">
                        Your utility bill payment has been successfully processed.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SuccessState
