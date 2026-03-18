"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * The ReactQueryProvider is a React context provider that wraps a QueryClient and its children.
 * The QueryClient is a state container for react-query that stores the results of all queries.
 * The ReactQueryProvider is used to provide a QueryClient to all react-query hooks and components
 * within its children.
 */
export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}