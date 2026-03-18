'use client';
import { useEffect, useState } from 'react';

/**
 * Shared Footer component for both user and business dashboards.
 *
 * Displays copyright notice with current year.
 */
const Footer = () => {
  const [year, setYear] = useState('');

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYear(currentYear.toString());
  }, []);

  return (
    <section className="w-full flex justify-center items-center py-4 bg-[#F5FFFA]">
      <p className="font-[400] font-poppins text-center md:text-base text-sm text-[#58556A]">
        © {year} Strimz. All rights reserved.
      </p>
    </section>
  );
};

export default Footer;
