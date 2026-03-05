"use client"

/**
 * KPI Card Component
 * Displays a single key performance indicator.
 */

import type { KPIData } from "@/lib/dashboard-generator"

interface KPICardProps {
  kpi: KPIData
  index: number
}

const ACCENT_COLORS = [
  "text-primary",
  "text-chart-2",
  "text-chart-3",
  "text-chart-4",
]

export function KPICard({ kpi, index }: KPICardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/20">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {kpi.label}
      </p>
      <p
        className={`mt-2 font-display text-3xl font-bold tracking-tight ${ACCENT_COLORS[index % ACCENT_COLORS.length]}`}
      >
        {kpi.value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{kpi.subtitle}</p>
    </div>
  )
}
