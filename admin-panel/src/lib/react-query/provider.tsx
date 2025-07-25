"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

interface ReactQueryProviderProps {
  children: React.ReactNode
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Time before data is considered stale (5 minutes)
            staleTime: 5 * 60 * 1000,
            // Time before inactive queries are garbage collected (10 minutes)
            gcTime: 10 * 60 * 1000,
            // Retry failed requests
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors (except 408 Request Timeout)
              if (error?.response?.status >= 400 && error?.response?.status < 500 && error?.response?.status !== 408) {
                return false
              }
              // Retry up to 3 times for other errors
              return failureCount < 3
            },
            // Retry delay with exponential backoff
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus
            refetchOnWindowFocus: false,
            // Refetch on reconnect
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry failed mutations
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors
              if (error?.response?.status >= 400 && error?.response?.status < 500) {
                return false
              }
              // Retry up to 2 times for other errors
              return failureCount < 2
            },
            // Retry delay
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  )
}
