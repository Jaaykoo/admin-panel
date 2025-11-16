import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const topProducts = [
  { name: 'Widget Pro', views: 8432, conversion: 4.2 },
  { name: 'Basic Widget', views: 6234, conversion: 3.8 },
  { name: 'Deluxe Package', views: 5123, conversion: 5.1 },
  { name: 'Starter Kit', views: 4567, conversion: 2.9 },
  { name: 'Premium Bundle', views: 3890, conversion: 6.3 },
];

export function ProductViewsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">
                  {product.views.toLocaleString()}
                  {' '}
                  views
                </p>
              </div>
              <Badge
                variant="secondary"
                className={product.conversion > 4 ? 'bg-[#e8fff3] text-[#50cd89]' : 'bg-[#fff8dd] text-[#ffc700]'}
              >
                {product.conversion}
                %
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
