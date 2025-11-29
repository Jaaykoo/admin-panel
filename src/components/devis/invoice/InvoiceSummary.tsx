'use client';

type InvoiceSummaryProps = {
  quoteNumber: string;
};

export function InvoiceSummary({ quoteNumber }: InvoiceSummaryProps) {
  return (
    <div className="mt-10 text-center">
      {/* Quote Number */}
      <p className="text-sm font-semibold text-gray-700">{quoteNumber}</p>
    </div>
  );
}
