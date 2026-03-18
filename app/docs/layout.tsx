'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, Key, Zap, Webhook, Code, AlertCircle, BookOpen, Menu, X } from 'lucide-react'
import Image from 'next/image'
import logo from '@/public/logo/whiteLogo.png'

interface NavItem {
    title: string
    href: string
    icon: React.ReactNode
}

const navItems: NavItem[] = [
    {
        title: 'Introduction',
        href: '/docs',
        icon: <BookOpen className="w-4 h-4" />
    },
    {
        title: 'Getting Started',
        href: '/docs/getting-started',
        icon: <FileText className="w-4 h-4" />
    },
    {
        title: 'Authentication',
        href: '/docs/authentication',
        icon: <Key className="w-4 h-4" />
    },
    {
        title: 'Payment Integration',
        href: '/docs/payment-integration',
        icon: <Zap className="w-4 h-4" />
    },
    {
        title: 'Webhooks',
        href: '/docs/webhooks',
        icon: <Webhook className="w-4 h-4" />
    },
    {
        title: 'API Reference',
        href: '/docs/api-reference',
        icon: <Code className="w-4 h-4" />
    },
    {
        title: 'Error Handling',
        href: '/docs/error-handling',
        icon: <AlertCircle className="w-4 h-4" />
    }
]

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0a]/60">
                <div className="container flex h-16 items-center px-4 md:px-8">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src={logo} alt="Strimz Logo" width={120} height={40} quality={100} priority />
                    </Link>
                    <div className="flex flex-1 items-center justify-end gap-4">
                        <Link
                            href="/auth/business/signup"
                            target='_blank'
                            className="hidden md:inline-flex h-10 px-4 py-2 items-center justify-center rounded-[8px] bg-accent text-white font-poppins font-[500] text-sm hover:bg-accent/90 transition-colors"
                        >
                            Get API Access
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden p-2 text-white"
                        >
                            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </header>

            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 px-4 md:px-8 py-8">
                {/* Sidebar */}
                <aside className={`fixed top-16 z-30 h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block ${sidebarOpen ? 'block' : 'hidden'} bg-[#0a0a0a] md:bg-transparent`}>
                    <div className="h-full overflow-y-auto py-6 pr-6 lg:py-8">
                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 rounded-[8px] px-3 py-2 text-sm font-poppins transition-colors ${isActive
                                                ? 'bg-accent/10 text-accent font-[500]'
                                                : 'text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-white'
                                            }`}
                                    >
                                        {item.icon}
                                        {item.title}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="relative py-6 lg:gap-10 lg:py-8">
                    <div className="mx-auto w-full min-w-0">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
