import React from 'react'
import { Element } from 'react-scroll'
import PayForSubs from './payForSubs'
import BuyDataAndAirtime from './buyDataAndAirtime'
import PayForUtils from './buyForUtils'

/**
 * Benefits is a functional component that renders the benefits section on the page.
 * 
 * The section includes:
 * - A main heading that introduces the concept of using crypto for everyday expenses.
 * - A descriptive paragraph explaining the range of expenses covered, including streaming services,
 *   utility bills, and mobile airtime.
 * - A main content area that consists of three subsections:
 *   - PayForSubs: Component to handle subscription payments with crypto.
 *   - BuyDataAndAirtime: Component for purchasing mobile data and airtime using crypto.
 *   - PayForUtils: Component for paying utility bills without hassle.
 * 
 * The component is designed to be responsive and is wrapped in a scrollable Element for smooth navigation.
 */

const Benefits = () => {
    return (
        <Element name="benefits" >
            <section className="w-full lg:py-28 py-20 flex flex-col px-4">
                <h1 className='text-primary md:text-[40px] text-[32px] font-[700] font-sora text-center'>Pay for what matters</h1>
                <p className="w-full max-w-[488px] text-center text-[#58556A] font-[400] font-poppins text-base leading-[28px] mx-auto mb-12">Use your crypto to cover everyday expenses, from streaming services to utility bills and mobile airtime, all in one place.</p>

                <main className='w-full max-w-[1200px] mx-auto space-y-10'>
                    {/* pay for sub with crypto */}
                    <PayForSubs />
                    {/* buy data & airtime instantly */}
                    <BuyDataAndAirtime />
                    {/* pay for utilities */}
                    <PayForUtils />
                </main>
            </section>
        </Element>
    )
}

export default Benefits