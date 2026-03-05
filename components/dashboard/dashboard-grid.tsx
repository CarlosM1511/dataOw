"use client"

/**
 * Dashboard Grid Component
 * Renders KPIs and charts in a clean grid layout.
 */

import type { ChartConfig, KPIData } from "@/lib/dashboard-generator"
import { ChartCard } from "./chart-card"
import { KPICard } from "./kpi-card"

interface DashboardGridProps {
  charts: ChartConfig[]
  kpis: KPIData[]
  dashboardName: string
  rowCount: number
}

export function DashboardGrid({
  charts,
  kpis,
  dashboardName,
  rowCount,
}: DashboardGridProps) {
  return (
    <div className="space-y-6">
      {/* Dashboard header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
            {dashboardName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {rowCount.toLocaleString()} registros analizados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
            Auto-generado
          </span>
        </div>
      </div>

      {/* KPI Row */}
      {kpis.length > 0 && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((kpi, i) => (
            <KPICard key={`kpi-${i}`} kpi={kpi} index={i} />
          ))}
        </div>
      )}

      {/* Charts Grid */}
      {charts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {charts.map((chart) => (
            <ChartCard key={chart.id} chart={chart} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {charts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <p className="text-sm font-medium text-muted-foreground">
            No se pudieron generar graficas para este dataset.
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Asegurate de que tu CSV tenga columnas numericas y categoricas.
          </p>
        </div>
      )}
    </div>
  )
}
