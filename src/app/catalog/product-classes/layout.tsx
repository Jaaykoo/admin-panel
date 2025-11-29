import { QueryRequestProvider } from '@/hooks/_QueryRequestProvider';
import { ProductClassQueryResponseProvider } from '@/hooks/catalogues/ProductClassQueryResponseProvider';

export default function ProductClassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryRequestProvider>
      <ProductClassQueryResponseProvider>
        {children}
      </ProductClassQueryResponseProvider>
    </QueryRequestProvider>
  );
}
