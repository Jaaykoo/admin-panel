'use client';

type InvoiceDetailsProps = {
  creationDate?: string | null;
  expirationDate?: string | null;
};

export function InvoiceDetails({
  creationDate,
  expirationDate,
}: InvoiceDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h3 className="mb-3 font-semibold text-gray-900">Informations devis</h3>

      <div className="space-y-3">
        {/* Quotation Date */}
        <div>
          <p className="text-xs font-medium text-gray-500">Date de proposition</p>
          <p className={`text-sm text-gray-900 ${!creationDate ? 'w-20 text-center' : ''}`}>{creationDate ? formatDate(creationDate) : '-'}</p>
        </div>

        {/* Expiration Date */}
        <div>
          <p className="text-xs font-medium text-gray-500">Date de fin de validité</p>
          <p className={`text-sm text-gray-900 ${!expirationDate ? 'w-20 text-center' : ''}`}>{expirationDate ? formatDate(expirationDate) : '-'}</p>
        </div>
      </div>
    </div>
  );
}
