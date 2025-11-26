'use client';

import type { AddressType } from '@/types/AddressType';

type BillingDetailsProps = {
  title?: string;
  companyName?: string;
  address?: AddressType;
  phone?: string;
  email?: string;
  ninea?: string;
  message?: string;
};

// Fonction utilitaire pour formater l'adresse
const formatAddress = (address?: {
  line1?: string;
  line2?: string;
  line3?: string;
  line4?: string;
  state?: string;
  postcode?: string;
}) => {
  if (!address) {
    return '';
  }
  return [
    address.line1,
    address.line2,
    address.line3,
    address.line4,
    address.state,
    address.postcode,
  ]
    .filter(Boolean) // enlève les undefined ou champs vides
    .join(', '); // concatène avec une virgule
};
export function BillingDetails({
  title = 'Coordonnées du client',
  companyName,
  address,
  phone,
  email,
  message,
}: BillingDetailsProps) {
  return (
    <div className="space-y-4 p-4">
      {/* Title */}
      <h3 className="font-semibold text-gray-900">{title}</h3>

      {/* Client Info */}
      <div className="space-y-1">
        {companyName && (
          <p className="text-sm text-gray-900">
            <span className="font-semibold">Raison sociale:&nbsp;</span>
            {companyName}
          </p>
        )}
        {email && (
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Email:&nbsp;</span>
            {email}
          </p>
        )}
        {phone && (
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Téléphone:&nbsp;</span>
            {phone}
          </p>
        )}
        {address && (
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Addresse:&nbsp;</span>
            {formatAddress(address)}
          </p>
        )}
        {/* {ninea && (
          <p className="text-sm text-gray-600">
            <span className="font-semibold">NINEA:&nbsp;</span>
            {ninea}
          </p>
        )} */}
      </div>

      {/* Message */}
      {message && (
        <div className="mt-4 rounded-lg bg-blue-50 p-3">
          <p className="text-xs font-semibold text-blue-900">Facture</p>
          <p className="mt-1 text-xs text-blue-800">{message}</p>
        </div>
      )}
    </div>
  );
}
