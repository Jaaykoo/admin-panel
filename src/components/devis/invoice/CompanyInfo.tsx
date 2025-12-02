'use client';

import Image from 'next/image';

type CompanyInfoProps = {
  logo?: string;
  companyName?: string;
  ownerName?: string;
  address?: string;
  phone: string;
  email: string;
  ninea?: string;
  tva?: string;
};

export function CompanyInfo({
  ownerName,
  address,
  phone,
  email,
  ninea,
  tva,
}: CompanyInfoProps) {
  return (
    <div className="flex flex-col">
      {/* Logo */}
      <div className="relative h-32 w-58">
        <Image
          src="/Logo.svg"
          alt="Company Logo"
          fill
          className="object-contain"
          style={{
            filter: 'brightness(0) saturate(100%) invert(45%) sepia(97%) saturate(2439%) hue-rotate(178deg) brightness(98%) contrast(101%)',
          }}
          priority
        />
      </div>
      <div className="flex flex-col gap-2 px-5">

        {/* Company Name */}
        {/* <h2 className="text-2xl font-bold text-gray-900">{companyName}</h2> */}

        {/* Owner Name */}
        <p className="text-md font-bold text-gray-900">{ownerName}</p>

        {/* Owner Email */}
        <p className="text-sm font-medium text-gray-700">{email}</p>

        {/* Owner Phone number */}
        <p className="text-sm font-medium text-gray-700">{phone}</p>

        {/* Address */}
        {address && (<p className="text-sm text-gray-600">{address}</p>)}

        {/* NINEA */}
        {ninea && (
          <p className="text-sm text-gray-600">
            NINEA:
            {ninea}
          </p>
        )}

        {/* TVA */}
        {tva && (
          <p className="text-sm text-gray-600">
            TVA:
            {tva}
          </p>
        )}
      </div>
    </div>
  );
}
