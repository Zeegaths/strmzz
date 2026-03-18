/**
 * Strimz Provider Component
 * React Context Provider for Strimz SDK
 */

import React, { createContext, useContext, useMemo } from 'react'
import { StrimzSDK } from '../core/StrimzSDK'
import type { SDKConfig, Environment } from '../types'

// ============================================================================
// Context Types
// ============================================================================

interface StrimzContextValue {
  sdk: StrimzSDK
  publicKey: string
  environment: Environment
}

// ============================================================================
// Context Creation
// ============================================================================

const StrimzContext = createContext<StrimzContextValue | null>(null)

// ============================================================================
// Provider Props
// ============================================================================

export interface StrimzProviderProps {
  publicKey: string
  environment?: Environment
  debug?: boolean
  apiUrl?: string
  children: React.ReactNode
}

// ============================================================================
// Strimz Provider Component
// ============================================================================

export const StrimzProvider: React.FC<StrimzProviderProps> = ({
  publicKey,
  environment = 'live',
  debug = false,
  apiUrl,
  children
}) => {
  // Memoize SDK instance to prevent unnecessary re-creation
  const sdk = useMemo(() => {
    const config: SDKConfig = {
      publicKey,
      environment,
      debug,
      apiUrl
    }

    return new StrimzSDK(config)
  }, [publicKey, environment, debug, apiUrl])

  const value: StrimzContextValue = useMemo(
    () => ({
      sdk,
      publicKey,
      environment
    }),
    [sdk, publicKey, environment]
  )

  return (
    <StrimzContext.Provider value={value}>
      {children}
    </StrimzContext.Provider>
  )
}

// ============================================================================
// Custom Hook
// ============================================================================

/**
 * Hook to access Strimz SDK from context
 * @throws Error if used outside StrimzProvider
 */
export const useStrimz = (): StrimzContextValue => {
  const context = useContext(StrimzContext)

  if (!context) {
    throw new Error(
      'useStrimz must be used within a StrimzProvider. ' +
      'Wrap your app with <StrimzProvider> to use Strimz hooks and components.'
    )
  }

  return context
}

/**
 * Hook to access Strimz SDK instance
 */
export const useStrimzSDK = (): StrimzSDK => {
  const { sdk } = useStrimz()
  return sdk
}
