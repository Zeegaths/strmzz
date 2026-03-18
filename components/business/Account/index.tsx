import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import ProfileTab from './ProfileTab'
import TeamTab from './TeamTab'
import WhitelistedIPTab from './WhitelistedIPTab'
import APIKeysTab from './APIKeysTab'
import WebhooksTab from './WebhooksTab'

const BusinessAccountSettings = () => {
    return (
        <section className="w-full flex flex-col gap-4">
            {/* Header */}
            <div className='w-full flex flex-col gap-1'>
                <h4 className="text-primary capitalize font-sora font-[600] text-xl">Account Settings</h4>
                <p className="text-sm text-[#58556A] font-poppins font-[400]">
                    Manage your account and preferences
                </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="w-full bg-[#F9FAFB] justify-start before:bg-border relative h-auto gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
                    <TabsTrigger className="px-3 bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none" value="profile">Profile</TabsTrigger>
                    <TabsTrigger className="px-3 py-2 bg-muted overflow-hidden rounded-b-none border-x border-t data-[state=active]:z-10 data-[state=active]:shadow-none" value="team">Team</TabsTrigger>
                    <TabsTrigger className="px-3 bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none" value="whitelisted">Whitelisted IP</TabsTrigger>
                    <TabsTrigger className="px-3 bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none" value="api_keys">API Keys</TabsTrigger>
                    <TabsTrigger className="px-3 bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none" value="webhooks">Webhooks</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <ProfileTab />
                </TabsContent>

                <TabsContent value="team">
                    <TeamTab />
                </TabsContent>

                <TabsContent value="whitelisted">
                    <WhitelistedIPTab />
                </TabsContent>

                <TabsContent value="api_keys">
                    <APIKeysTab />
                </TabsContent>

                <TabsContent value="webhooks">
                    <WebhooksTab />
                </TabsContent>
            </Tabs>
        </section>
    )
}

export default BusinessAccountSettings