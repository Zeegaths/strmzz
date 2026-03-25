'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { formatUnits } from 'viem'
import { useCheckoutSession } from '@/hooks/useCheckoutSession'
import { CONTRACTS, ERC20_ABI, STRIMZ_PAYMENTS_ABI, INTERVAL_TO_ENUM, getTokenAddress, toTokenUnits, TOKEN_DECIMALS } from '@/config/contracts'
import { ACTIVE_CHAIN_ID } from '@/config/wagmi'
import type { CheckoutStep } from '@/types/payment'
import Image from 'next/image'
import Link from 'next/link'
import logo from '@/public/logo/blueLogo.png'
import usdcIcon from '@/public/brands/USDC.svg'
import usdtIcon from '@/public/brands/USDT.svg'
import ConfirmedStep from './ConfirmedStep'
import { FiAlertTriangle, FiCheck, FiLoader } from 'react-icons/fi'
import { Wallet } from 'lucide-react'

const CheckoutPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session')

  // Fetch session from backend
  const { session, loading: sessionLoading, error: sessionError, reportSubmitted } = useCheckoutSession(sessionId)

  // Wallet state
  const { address, isConnected, chain } = useAccount()
  const { connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()

  // UI state
  const [step, setStep] = useState<CheckoutStep>('loading')
  const [txError, setTxError] = useState<string | null>(null)

  // Token address for this session
  const tokenAddress = session ? getTokenAddress(session.currency) : CONTRACTS.USDC
  const amountRaw = session ? toTokenUnits(session.amount) : BigInt(0)

  // For subscriptions, approve 12x the amount to avoid monthly re-approvals
  const approveAmount = session?.type === 'subscription' ? amountRaw * BigInt(12) : amountRaw

  // Read USDC balance
  const { data: balance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  // Read USDC allowance to StrimzPayments
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.STRIMZ_PAYMENTS] : undefined,
    query: { enabled: !!address },
  })

  // Write: approve
  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: isApproving,
    error: approveError,
  } = useWriteContract()

  // Wait for approve tx
  const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({
    hash: approveHash,
  })

  // Write: pay or createSubscription
  const {
    writeContract: writePay,
    data: payHash,
    isPending: isPaying,
    error: payError,
  } = useWriteContract()

  // Wait for pay tx
  const { isSuccess: payConfirmed } = useWaitForTransactionReceipt({
    hash: payHash,
  })

  // ========================================================================
  // Step management
  // ========================================================================

  useEffect(() => {
    console.log('[Step]', { sessionLoading, sessionError, hasSession: !!session, isConnected, chainId: chain?.id, allowance })
    if (sessionLoading) {
      setStep('loading')
      return
    }
    if (sessionError || !session) {
      setStep('error')
      return
    }
    if (!isConnected) {
      setStep('connect')
      return
    }
    // Wrong chain check
    if (chain && chain.id !== ACTIVE_CHAIN_ID) {
      setStep('connect')
      return
    }

    // Check if allowance is sufficient
    const currentAllowance = allowance as bigint | undefined
    if (currentAllowance === undefined) {
      setStep('approve')
      return
    }

    if (currentAllowance < amountRaw) {
      setStep('approve')
    } else {
      setStep('pay')
    }
  }, [sessionLoading, sessionError, session, isConnected, chain, allowance, amountRaw])

  // After approve confirmed, refetch allowance and move to pay
  useEffect(() => {
    if (approveConfirmed) {
      refetchAllowance()
      setStep('pay')
    }
  }, [approveConfirmed, refetchAllowance])

  // After pay confirmed, report to backend and show confirmed
  useEffect(() => {
    if (payConfirmed && payHash) {
      reportSubmitted(payHash)
      setStep('confirmed')

      // Redirect to success URL after 3 seconds if provided
      if (session?.successUrl) {
        const url = new URL(session.successUrl)
        url.searchParams.set('session_id', session.sessionId)
        url.searchParams.set('status', 'completed')
        if (payHash) url.searchParams.set('tx', payHash)

        setTimeout(() => {
          window.location.href = url.toString()
        }, 3000)
      }
    }
  }, [payConfirmed, payHash, session, reportSubmitted])

  // Surface contract errors
  useEffect(() => {
    if (approveError) setTxError(approveError.message.split('\n')[0])
    if (payError) setTxError(payError.message.split('\n')[0])
  }, [approveError, payError])

  // ========================================================================
  // Actions
  // ========================================================================

  const handleConnect = useCallback(() => {
    setTxError(null)
    connect({ connector: injected(), chainId: ACTIVE_CHAIN_ID })
  }, [connect])

  const handleApprove = useCallback(() => {
    if (!address) return
    setTxError(null)

    writeApprove({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACTS.STRIMZ_PAYMENTS, approveAmount],
      chainId: ACTIVE_CHAIN_ID,
    })
  }, [address, writeApprove, tokenAddress, approveAmount])

  const handlePay = useCallback(() => {
    if (!session || !address) return
    setTxError(null)

    if (!session.merchantOnChainId) {
      setTxError('Merchant on-chain setup incomplete. Contact merchant support.')
      return
    }

    if (session.type === 'one_time') {
      writePay({
        address: CONTRACTS.STRIMZ_PAYMENTS,
        abi: STRIMZ_PAYMENTS_ABI,
        functionName: 'pay',
        args: [
          session.merchantOnChainId as `0x${string}`,
          tokenAddress,
          amountRaw,
          session.sessionId, // Use sessionId as on-chain reference
        ],
        chainId: ACTIVE_CHAIN_ID,
      })
    } else {
      const intervalEnum = INTERVAL_TO_ENUM[session.subscriptionInterval || 'monthly'] ?? 1
      writePay({
        address: CONTRACTS.STRIMZ_PAYMENTS,
        abi: STRIMZ_PAYMENTS_ABI,
        functionName: 'createSubscription',
        args: [
          session.merchantOnChainId as `0x${string}`,
          tokenAddress,
          amountRaw,
          intervalEnum,
        ],
        chainId: ACTIVE_CHAIN_ID,
      })
    }
  }, [session, address, writePay, tokenAddress, amountRaw])

  const handleCancel = useCallback(() => {
    if (session?.cancelUrl) {
      const url = new URL(session.cancelUrl)
      url.searchParams.set('session_id', session.sessionId)
      url.searchParams.set('status', 'cancelled')
      window.location.href = url.toString()
    } else {
      router.push('/')
    }
  }, [session, router])

  // ========================================================================
  // Derived state
  // ========================================================================

  const tokenIcon = session?.currency === 'USDT' ? usdtIcon : usdcIcon
  const formattedBalance = balance !== undefined
    ? parseFloat(formatUnits(balance as bigint, TOKEN_DECIMALS)).toFixed(2)
    : '—'
  const hasInsufficientBalance = balance !== undefined && (balance as bigint) < amountRaw

  // ========================================================================
  // Render: Confirmed
  // ========================================================================

  if (step === 'confirmed') {
    return (
      <section className="w-full min-h-screen flex items-center justify-center p-4">
        <ConfirmedStep
          successUrl={session?.successUrl}
          sessionId={session?.sessionId}
          txHash={payHash}
        />
      </section>
    )
  }

  // ========================================================================
  // Render: Main checkout
  // ========================================================================

  return (
    <section className="w-full h-full flex flex-col gap-4 p-4 md:p-8">
      {/* Back / Cancel */}
      <div className="w-full">
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-1 text-[#050020] font-poppins text-[14px] font-[400] hover:text-accent transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Cancel
        </button>
      </div>

      <div className="w-full flex-1 grid lg:grid-cols-5 md:grid-cols-2 gap-4">
        {/* Left: Payment Summary */}
        <main className="w-full lg:col-span-2 flex flex-col">
          <div className="w-full flex flex-col bg-[#F9FAFB] p-8 rounded-lg gap-10 flex-1">
            {/* Merchant name */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-sora font-[600] text-sm">
                {session?.merchantName?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <h4 className="text-[#050020] font-poppins font-[500] text-base md:text-lg">
                {session?.merchantName || 'Loading...'}
              </h4>
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1.5">
              <h6 className="text-[#6B7280] text-xs font-[400] font-poppins uppercase">Total Amount</h6>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 overflow-hidden rounded-full">
                  <Image src={tokenIcon} alt="token" className="w-full h-full" width={112} height={112} quality={100} priority />
                </div>
                <h4 className="text-[#050020] font-sora font-[600] text-base md:text-2xl">
                  {session?.amount?.toFixed(2) || '—'} {session?.currency || 'USDC'}
                </h4>
              </div>
            </div>

            {/* Details */}
            <div className="w-full flex flex-col gap-6">
              {session?.description && (
                <div className="w-full flex items-center justify-between">
                  <h5 className="text-[#58556A] text-base font-poppins font-[400]">{session.description}</h5>
                </div>
              )}

              {session?.type === 'subscription' && session.subscriptionInterval && (
                <div className="w-full flex items-center justify-between">
                  <span className="text-[#6B7280] font-poppins text-xs font-[400] uppercase">
                    Billed {session.subscriptionInterval}
                  </span>
                  <span className="text-[#050020] font-[500] font-poppins text-sm">
                    {session.amount.toFixed(2)} {session.currency}/{session.subscriptionInterval.replace('ly', '')}
                  </span>
                </div>
              )}

              <hr className="text-[#E5E7EB]" />

              <div className="w-full flex items-center justify-between">
                <h5 className="text-[#050020] text-sm font-poppins font-[500]">Total due</h5>
                <span className="text-[#050020] font-[600] font-poppins text-sm">
                  {session?.amount?.toFixed(2) || '—'} {session?.currency || 'USDC'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full h-[60px] hidden md:flex justify-start items-center">
            <div className="w-full flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <span className="text-[#58556A] font-[400] font-poppins text-sm">Powered by</span>
                <Image src={logo} alt="logo" className="w-[64px] h-[20px]" width={407} height={128} quality={100} priority />
              </div>
              <div className="flex items-center gap-3">
                <Link href="/" className="text-[#58556A] text-xs font-[400] font-poppins">Privacy</Link>
                <Link href="/" className="text-[#58556A] text-xs font-[400] font-poppins">Terms</Link>
              </div>
            </div>
          </div>
        </main>

        {/* Right: Action area */}
        <aside className="w-full lg:col-span-3 flex flex-col items-center justify-center p-4 md:p-8">
          <div className="w-full lg:w-[480px] flex flex-col gap-6">

            {/* Loading */}
            {step === 'loading' && (
              <div className="flex flex-col items-center gap-4 py-12">
                <FiLoader className="w-8 h-8 text-accent animate-spin" />
                <p className="font-poppins text-sm text-[#58556A]">Loading payment session...</p>
              </div>
            )}

            {/* Error */}
            {step === 'error' && (
              <div className="flex flex-col items-center gap-4 py-12">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                  <FiAlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="font-sora font-[600] text-lg text-primary">Session Error</h3>
                <p className="font-poppins text-sm text-[#58556A] text-center">
                  {sessionError || 'This payment session is invalid or has expired.'}
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2 rounded-[8px] border border-[#E5E7EB] font-poppins text-sm hover:bg-[#F9FAFB]"
                >
                  Go Home
                </button>
              </div>
            )}

            {/* Connect Wallet */}
            {step === 'connect' && (
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <h3 className="font-sora font-[600] text-lg text-primary">Connect your wallet</h3>
                  <p className="font-poppins text-sm text-[#58556A] mt-1">
                    Connect a wallet with {session?.currency || 'USDC'} on Base to pay
                  </p>
                </div>

                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full h-[56px] rounded-[12px] bg-accent hover:bg-accent/90 disabled:bg-accent/50 transition-colors flex items-center justify-center gap-3 text-white font-sora font-[600] text-base"
                >
                  <Wallet className="w-5 h-5" />
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>

                {chain && chain.id !== ACTIVE_CHAIN_ID && isConnected && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm font-poppins text-yellow-800">
                      Please switch to the Base network in your wallet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Approve + Pay steps */}
            {(step === 'approve' || step === 'pay') && (
              <div className="flex flex-col gap-6">
                {/* Connected wallet info */}
                <div className="w-full flex items-center justify-between px-4 py-3 bg-[#F9FAFB] rounded-[8px] border border-[#E5E7EB]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-[#050020] font-poppins text-sm font-[500] truncate">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="text-[#58556A] font-poppins text-xs hover:text-accent"
                  >
                    Disconnect
                  </button>
                </div>

                {/* Balance */}
                <div className="w-full flex flex-col gap-2">
                  <h6 className="font-poppins text-[14px] text-[#58556A]">Your balance</h6>
                  <div className="flex items-center gap-2">
                    <Image src={tokenIcon} alt="token" className="w-6 h-6" width={96} height={96} quality={100} priority />
                    <span className="text-primary font-sora font-[600] text-[20px]">
                      {formattedBalance} {session?.currency}
                    </span>
                  </div>
                </div>

                {/* Insufficient balance warning */}
                {hasInsufficientBalance && (
                  <div className="w-full bg-red-50 border border-red-200 rounded-[8px] p-4 flex items-start gap-3">
                    <FiAlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-poppins text-red-800">
                      Insufficient {session?.currency} balance. You need {session?.amount?.toFixed(2)} {session?.currency}.
                    </p>
                  </div>
                )}

                {/* Step indicator */}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-[600] ${step === 'approve' ? 'bg-accent text-white' : 'bg-accent/10 text-accent'
                    }`}>
                    {step === 'pay' ? <FiCheck className="w-4 h-4" /> : '1'}
                  </div>
                  <span className="font-poppins text-sm text-[#58556A]">Approve {session?.currency}</span>
                  <div className="flex-1 h-[1px] bg-[#E5E7EB]" />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-[600] ${step === 'pay' ? 'bg-accent text-white' : 'bg-[#E5E7EB] text-[#9CA3AF]'
                    }`}>
                    2
                  </div>
                  <span className="font-poppins text-sm text-[#58556A]">Pay</span>
                </div>

                {/* Approve button */}
                {step === 'approve' && (
                  <button
                    onClick={handleApprove}
                    disabled={isApproving || hasInsufficientBalance}
                    className={`w-full h-[44px] flex justify-center items-center rounded-[8px] font-poppins font-[500] text-[14px] transition-opacity ${isApproving || hasInsufficientBalance
                        ? 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                        : 'bg-accent text-white hover:opacity-90'
                      }`}
                  >
                    {isApproving ? (
                      <span className="flex items-center gap-2">
                        <FiLoader className="w-4 h-4 animate-spin" /> Approving...
                      </span>
                    ) : (
                      `Approve ${session?.amount?.toFixed(2)} ${session?.currency}`
                    )}
                  </button>
                )}

                {/* Pay button */}
                {step === 'pay' && (
                  <button
                    onClick={handlePay}
                    disabled={isPaying || hasInsufficientBalance}
                    className={`w-full h-[44px] flex justify-center items-center rounded-[8px] font-poppins font-[500] text-[14px] transition-opacity ${isPaying || hasInsufficientBalance
                        ? 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                        : 'bg-accent text-white hover:opacity-90'
                      }`}
                  >
                    {isPaying ? (
                      <span className="flex items-center gap-2">
                        <FiLoader className="w-4 h-4 animate-spin" /> Processing...
                      </span>
                    ) : session?.type === 'subscription' ? (
                      `Subscribe — ${session.amount.toFixed(2)} ${session.currency}/${session.subscriptionInterval?.replace('ly', '')}`
                    ) : (
                      `Pay ${session?.amount?.toFixed(2)} ${session?.currency}`
                    )}
                  </button>
                )}

                {/* Error display */}
                {txError && (
                  <div className="w-full bg-red-50 border border-red-200 rounded-[8px] p-4">
                    <p className="text-sm font-poppins text-red-800">{txError}</p>
                    <button
                      onClick={() => setTxError(null)}
                      className="text-xs font-poppins text-red-600 underline mt-1"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* How it works */}
                <div className="w-full flex flex-col gap-3 mt-4">
                  <h6 className="font-sora font-[600] text-[14px] text-primary">How it works</h6>
                  <ol className="list-decimal list-inside space-y-1.5 text-sm font-poppins text-[#58556A]">
                    <li>Approve the contract to use your {session?.currency} (one-time per amount)</li>
                    <li>Confirm the payment — {session?.currency} is sent directly to the merchant</li>
                    {session?.type === 'subscription' && (
                      <li>Future charges happen automatically — you can cancel anytime from your dashboard</li>
                    )}
                  </ol>
                </div>
              </div>
            )}

          </div>
        </aside>
      </div>

      {/* Mobile footer */}
      <div className="w-full h-[60px] flex md:hidden justify-center items-center mt-8">
        <div className="w-full flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#58556A] font-[400] font-poppins text-sm">Powered by</span>
            <Image src={logo} alt="logo" className="w-[64px] h-[20px]" width={407} height={128} quality={100} priority />
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[#58556A] text-xs font-[400] font-poppins">Privacy</Link>
            <Link href="/" className="text-[#58556A] text-xs font-[400] font-poppins">Terms</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CheckoutPage