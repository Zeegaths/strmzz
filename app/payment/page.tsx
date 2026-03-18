'use client'
import { Suspense } from 'react'
import CheckoutPage from '@/components/payment'

function CheckoutLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="font-poppins text-sm text-[#58556A]">Loading checkout...</p>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <main className="w-full h-full">
      <Suspense fallback={<CheckoutLoading />}>
        <CheckoutPage />
      </Suspense>
    </main>
  )
}