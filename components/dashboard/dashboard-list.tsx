"use client"

/**
 * Dashboard List Component
 * Shows all saved dashboards for the current client.
 * Allows opening or deleting dashboards.
 */

import type { StoredDashboard } from "@/lib/storage"
import { FileSpreadsheet, Trash2, ChevronRight, LayoutDashboard } from "lucide-react"

interface DashboardListProps {
  dashboards: StoredDashboard[]
  onSelect: (dashboard: StoredDashboard) => void
  onDelete: (dashboardId: string) => void
}

export function DashboardList({
  dashboards,
  onSelect,
  onDelete,
}: DashboardListProps) {
  if (dashboards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
          <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          No tienes dashboards guardados
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Sube un archivo CSV para generar tu primer dashboard
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Tus dashboards
      </h3>
      {dashboards.map((dashboard) => {
        const date = new Date(dashboard.uploadDate)
        const formattedDate = date.toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
        const formattedTime = date.toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        })

        return (
          <div
            key={dashboard.id}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:bg-accent/50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
            </div>

            <button
              type="button"
              onClick={() => onSelect(dashboard)}
              className="flex flex-1 flex-col text-left"
            >
              <span className="text-sm font-semibold text-foreground">
                {dashboard.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formattedDate} a las {formattedTime}
                {" \u00B7 "}
                {dashboard.rowCount.toLocaleString()} registros
              </span>
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onDelete(dashboard.id)}
                className="rounded-md p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                aria-label={`Eliminar dashboard ${dashboard.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onSelect(dashboard)}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:text-primary"
                aria-label={`Abrir dashboard ${dashboard.name}`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
