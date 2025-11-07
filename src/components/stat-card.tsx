import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  icon: LucideIcon
  iconColor: string
  iconBg: string
}

export function StatCard({ title, value, change, changeType, icon: Icon, iconColor, iconBg }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          <div className="mt-2 flex items-center gap-1">
            <span
              className={cn("text-sm font-medium", changeType === "positive" ? "text-[#50cd89]" : "text-[#f1416c]")}
            >
              {change}
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
        <div className={cn("rounded-lg p-3", iconBg)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>
    </Card>
  )
}
