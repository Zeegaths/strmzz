/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IoSearchOutline } from 'react-icons/io5';
import { countries } from '@/lib/countries';
import * as flags from 'country-flag-icons/react/3x2';

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

/**
 * Country selector with search functionality and flag icons
 */
const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  error,
  label = 'Business location',
  placeholder = 'Select country',
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;

    const query = searchQuery.toLowerCase();
    return countries.filter((country) =>
      country.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Get the selected country's name for display
  const selectedCountry = countries.find((c) => c.code === value);

  return (
    <div className="w-full flex flex-col">
      {label && (
        <label className="font-poppins text-[14px] text-[#58556A] leading-[24px] mb-1">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={`w-full h-[44px] rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow font-poppins text-[14px] text-[#8E8C9C] px-4 outline-none focus:ring-0 transition duration-300 focus:border-accent ${error ? 'border-red-500' : 'border-[#E5E7EB]'
            } ${className}`}
        >
          <SelectValue placeholder={placeholder}>
            {selectedCountry && (
              <div className="flex items-center gap-2">
                {(() => {
                  const FlagComponent = (flags as any)[selectedCountry.code];
                  return FlagComponent ? (
                    <FlagComponent className="w-5 h-4" />
                  ) : null;
                })()}
                <span>{selectedCountry.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {/* Search input - Sticky */}
          <div className="sticky -top-1 w-full p-2 pb-3 bg-white z-10 border-b border-[#E5E7EB]">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search country by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[8px] border bg-[#F9FAFB] shadow-navbarShadow h-[44px] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-[#8E8C9C] pl-10 pr-4 outline-none transition duration-300 focus:border-accent border-[#E5E7EB]"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#58556A] pointer-events-none">
                <IoSearchOutline className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Countries list */}
          <SelectGroup className="pt-2">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const FlagComponent = (flags as any)[country.code];
                return (
                  <SelectItem
                    key={country.code}
                    value={country.code}
                    className="cursor-pointer hover:bg-[#F9FAFB]"
                  >
                    <div className="flex items-center gap-2">
                      {FlagComponent && <FlagComponent className="w-5 h-4" />}
                      <span>{country.name}</span>
                    </div>
                  </SelectItem>
                );
              })
            ) : (
              <div className="px-4 py-2 text-sm text-[#8E8C9C]">
                No countries found
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && (
        <p className="text-red-500 text-[12px] font-poppins mt-1">{error}</p>
      )}
    </div>
  );
};

export default CountrySelector;
