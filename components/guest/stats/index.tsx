import React from 'react'

/**
 * Stats component displays key metrics and statistics about Strimz platform.
 * It showcases the number of transactions processed, supported services, and average payment time.
 * The component is designed to build trust and credibility with potential users.
 */
const Stats = () => {
    return (
        <section className="w-full bg-white py-16 px-4 md:py-20">
            <main className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-8 md:gap-12">

                {/* Transactions Processed */}
                <div className="flex flex-col items-center text-center">
                    <h3 className="text-accent font-sora font-[700] text-[38px] lg:text-[56px] md:text-[48px] leading-[38px] lg:leading-[56px] md:leading-[48px]">
                        10,000+
                    </h3>
                    <p className="text-[#58556A] font-poppins font-[500] text-base md:text-lg mt-2">
                        Transactions Processed
                    </p>
                </div>

                {/* Supported Services */}
                <div className="flex flex-col items-center text-center">
                    <h3 className="text-accent font-sora font-[700] text-[38px] lg:text-[56px] md:text-[48px] leading-[38px] lg:leading-[56px] md:leading-[48px]">
                        50+
                    </h3>
                    <p className="text-[#58556A] font-poppins font-[500] text-base md:text-lg mt-2">
                        Supported Services
                    </p>
                </div>

                {/* Average Payment Time */}
                <div className="flex flex-col items-center text-center">
                    <h3 className="text-accent font-sora font-[700] text-[38px] lg:text-[56px] md:text-[48px] leading-[38px] lg:leading-[56px] md:leading-[48px]">
                        &lt;5s
                    </h3>
                    <p className="text-[#58556A] font-poppins font-[500] text-base md:text-lg mt-2">
                        Average Payment Time
                    </p>
                </div>

            </main>
        </section>
    )
}

export default Stats
