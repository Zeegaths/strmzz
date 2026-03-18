'use client'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { FiCheck, FiExternalLink } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

interface ConfirmedStepProps {
  successUrl?: string
  sessionId?: string
  txHash?: string
}

const ConfirmedStep = ({ successUrl, sessionId, txHash }: ConfirmedStepProps) => {
  const router = useRouter()
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 })
  const [showConfetti, setShowConfetti] = useState(true)
  const [countdown, setCountdown] = useState(successUrl ? 3 : 0)

  useEffect(() => {
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight })
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  // Countdown for redirect
  useEffect(() => {
    if (!successUrl || countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          const url = new URL(successUrl)
          if (sessionId) url.searchParams.set('session_id', sessionId)
          url.searchParams.set('status', 'completed')
          if (txHash) url.searchParams.set('tx', txHash)
          window.location.href = url.toString()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [successUrl, sessionId, txHash, countdown])

  const explorerUrl = txHash
    ? `https://basescan.org/tx/${txHash}`
    : null

  return (
    <div className="w-full flex items-center justify-center">
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
        {/* Success icon */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center">
            <FiCheck className="w-12 h-12 text-white stroke-[3]" />
          </div>
          <div className="absolute -top-2 -left-2 w-3 h-3 rounded-full bg-accent" />
          <div className="absolute -top-4 right-4 w-2 h-2 rounded-full bg-[#F59E0B]" />
          <div className="absolute top-2 -right-4 w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
          <div className="absolute -bottom-2 left-8 w-2 h-2 rounded-full bg-[#8B5CF6]" />
          <div className="absolute bottom-4 -right-2 w-3 h-3 rounded-full bg-[#EF4444]" />
          <div className="absolute -bottom-4 -left-4 w-2 h-2 rounded-full bg-[#F59E0B]" />
        </div>

        {/* Message */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-sora font-[600] text-2xl md:text-3xl text-primary text-center">
            Payment Confirmed!
          </h2>
          <p className="font-poppins text-[16px] text-[#58556A] text-center max-w-md">
            Your payment has been successfully processed on-chain.
          </p>
        </div>

        {/* Explorer link */}
        {explorerUrl && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent font-poppins text-sm hover:underline"
          >
            View on BaseScan <FiExternalLink className="w-4 h-4" />
          </a>
        )}

        {/* Redirect countdown */}
        {successUrl && countdown > 0 && (
          <p className="font-poppins text-sm text-[#58556A]">
            Redirecting in {countdown}...
          </p>
        )}

        {/* Manual button */}
        {!successUrl && (
          <button
            type="button"
            onClick={() => router.push('/')}
            className="mt-4 px-8 py-3 rounded-[8px] border border-[#E5E7EB] bg-white text-primary font-poppins font-[500] text-[14px] hover:bg-[#F9FAFB] transition-colors"
          >
            Go Home
          </button>
        )}
      </div>
    </div>
  )
}

export default ConfirmedStep