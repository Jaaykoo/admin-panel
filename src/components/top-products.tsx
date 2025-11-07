import { Card } from "@/components/ui/card"

const products = [
  { name: "Premium Widget Set", sales: 245, revenue: 73255.0, trend: "+12%" },
  { name: "Enterprise Bundle", sales: 189, revenue: 113211.0, trend: "+8%" },
  { name: "Pro Package", sales: 156, revenue: 62244.0, trend: "+15%" },
  { name: "Starter Package", sales: 134, revenue: 19966.0, trend: "+5%" },
  { name: "Deluxe Widget", sales: 98, revenue: 19502.0, trend: "-3%" },
]

export function TopProducts() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Top Products</h3>
        <p className="text-sm text-gray-500">Best performing products this month</p>
      </div>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product.name}
            className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e1f0ff] text-sm font-bold text-[#009ef7]">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">{product.sales} sales</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">${product.revenue.toLocaleString()}</p>
              <p className={`text-sm ${product.trend.startsWith("+") ? "text-[#50cd89]" : "text-[#f1416c]"}`}>
                {product.trend}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
