import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const salesData = [
  { date: '2024-01-15', order: '#ORD-1234', customer: 'John Doe', amount: 234.5, status: 'Completed' },
  { date: '2024-01-15', order: '#ORD-1235', customer: 'Jane Smith', amount: 189.0, status: 'Completed' },
  { date: '2024-01-14', order: '#ORD-1236', customer: 'Bob Johnson', amount: 456.75, status: 'Processing' },
  { date: '2024-01-14', order: '#ORD-1237', customer: 'Alice Brown', amount: 123.25, status: 'Completed' },
  { date: '2024-01-13', order: '#ORD-1238', customer: 'Charlie Wilson', amount: 678.9, status: 'Shipped' },
];

export function SalesReportTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">Date</th>
                <th className="pb-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">Order</th>
                <th className="pb-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Customer
                </th>
                <th className="pb-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">Amount</th>
                <th className="pb-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {salesData.map((sale, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-4 text-sm text-gray-600">{sale.date}</td>
                  <td className="py-4 text-sm font-medium text-gray-900">{sale.order}</td>
                  <td className="py-4 text-sm text-gray-900">{sale.customer}</td>
                  <td className="py-4 text-sm font-medium text-gray-900">
                    $
                    {sale.amount.toFixed(2)}
                  </td>
                  <td className="py-4">
                    <Badge
                      variant="secondary"
                      className={
                        sale.status === 'Completed'
                          ? 'bg-[#e8fff3] text-[#50cd89]'
                          : sale.status === 'Processing'
                            ? 'bg-[#fff8dd] text-[#ffc700]'
                            : 'bg-[#e1f0ff] text-[#009ef7]'
                      }
                    >
                      {sale.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
