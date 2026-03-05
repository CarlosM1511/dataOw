"use client"

/**
 * Panel Header Component
 * Top navigation bar for the DataO Panel.
 */

import { LogOut, BarChart3 } from "lucide-react"

interface PanelHeaderProps {
  businessName: string
  onLogout: () => void
}

export function PanelHeader({ businessName, onLogout }: PanelHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/95 px-6 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <BarChart3 className="h-4 w-4 text-primary" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-sm font-bold text-foreground">
            DataO Panel
          </span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            / {businessName}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <LogOut className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Salir</span>
      </button>
    </header>
  )
}
