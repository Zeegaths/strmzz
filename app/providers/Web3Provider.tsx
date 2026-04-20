import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'

// ============================================================================
// Merchant Profile
// ============================================================================

export function useMerchantProfile() {
  return useQuery({
    queryKey: ['merchant', 'me'],
    queryFn: async () => {
      const res = await apiGet('/merchants/me')
      if (!res.success) throw new Error(res.error)
      return res.data
    },
  })
}

// ============================================================================
// Dashboard Stats
// ============================================================================

export function useDashboardStats() {
  return useQuery({
    queryKey: ['merchant', 'stats'],
    queryFn: async () => {
      const res = await apiGet<{
        totalTransactions: number
        totalVolume: number
        totalFees: number
        activeSubscriptions: number
      }>('/merchants/me/stats')
      if (!res.success) throw new Error(res.error)
      return res.data
    },
  })
}

// ============================================================================
// Transactions
// ============================================================================

export function useMerchantTransactions(page = 0, size = 10) {
  return useQuery({
    queryKey: ['merchant', 'transactions', page, size],
    queryFn: async () => {
      const res = await apiGet(`/merchants/me/transactions?page=${page}&size=${size}`)
      if (!res.success) throw new Error(res.error)
      return res.data
    },
  })
}

// ============================================================================
// Subscriptions
// ============================================================================

export function useMerchantSubscriptions(page = 0, size = 10) {
  return useQuery({
    queryKey: ['merchant', 'subscriptions', page, size],
    queryFn: async () => {
      const res = await apiGet(`/merchants/me/subscriptions?page=${page}&size=${size}`)
      if (!res.success) throw new Error(res.error)
      return res.data
    },
  })
}

// ============================================================================
// Customers
// ============================================================================

export function useMerchantCustomers(page = 0, size = 20) {
  return useQuery({
    queryKey: ['merchant', 'customers', page, size],
    queryFn: async () => {
      const res = await apiGet(`/merchants/me/customers?page=${page}&size=${size}`)
      if (!res.success) throw new Error(res.error)
      return res.data
    },
  })
}

// ============================================================================
// API Keys
// ============================================================================

export function useApiKeys() {
  return useQuery({
    queryKey: ['merchant', 'api-keys'],
    queryFn: async () => {
      const res = await apiGet<any[]>('/merchants/me/api-keys')
      if (!res.success) throw new Error(res.error)
      return res.data
    },
  })
}

export function useGenerateApiKeys() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (environment: 'live' | 'test') => {
      const res = await apiPost<{
        publicKey: string
        secretKey: string
        environment: string
      }>('/merchants/me/api-keys', { environment })
      if (!res.success) throw new Error(res.error)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant', 'api-keys'] })
    },
  })
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (keyId: string) => {
      const res = await apiDelete(`/merchants/me/api-keys/${keyId}`)
      if (!res.success) throw new Error(res.error)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant', 'api-keys'] })
    },
  })
}

// ============================================================================
// Webhooks
// ============================================================================

export function useUpdateWebhook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (webhookUrl: string) => {
      const res = await apiPut('/merchants/me/webhooks', { webhookUrl })
      if (!res.success) throw new Error(res.error)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant', 'me'] })
    },
  })
}

// ============================================================================
// Wallet
// ============================================================================

export function useUpdateWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (walletAddress: string) => {
      const res = await apiPut('/merchants/me/wallet', { walletAddress })
      if (!res.success) throw new Error(res.error)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant', 'me'] })
    },
  })
}

// ============================================================================
// User Subscriptions (JWT auth)
// ============================================================================

export function useUserSubscriptions(page = 0, size = 10) {
  return useQuery({
    queryKey: ['user', 'subscriptions', page, size],
    queryFn: async () => {
      const res = await apiGet(`/subscriptions/me?page=${page}&size=${size}`)
      if (!res.success) throw new Error(res.error)
      return res.data
    },
  })
}

export function useUserSubscription(subscriptionId: string) {
  return useQuery({
    queryKey: ['user', 'subscription', subscriptionId],
    queryFn: async () => {
      const res = await apiGet(`/subscriptions/me/${subscriptionId}`)
      if (!res.success) throw new Error(res.error)
      return res.data
    },
  })
}

export function usePauseSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      const res = await apiPost(`/subscriptions/me/${subscriptionId}/pause`, {})
      if (!res.success) throw new Error(res.error)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'subscriptions'] })
    },
  })
}

export function useResumeSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      const res = await apiPost(`/subscriptions/me/${subscriptionId}/resume`, {})
      if (!res.success) throw new Error(res.error)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'subscriptions'] })
    },
  })
}

export function useCancelSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      const res = await apiPost(`/subscriptions/me/${subscriptionId}/cancel`, {})
      if (!res.success) throw new Error(res.error)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'subscriptions'] })
    },
  })
}