"use client"

/**
 * DataO Panel - Main Application Page
 * 
 * Flow:
 * 1. Client enters their access key
 * 2. Portal shows saved dashboards + upload option
 * 3. Upload CSV → auto-generate dashboard
 * 4. View dashboard with charts and KPIs
 */

import { useState, useCallback, useEffect } from "react"
import { ClientPortal } from "@/components/portal/client-portal"
import { PanelHeader } from "@/components/panel/panel-header"
import { CSVUploader } from "@/components/upload/csv-uploader"
import { DashboardGrid } from "@/components/dashboard/dashboard-grid"
import { DashboardList } from "@/components/dashboard/dashboard-list"
import { generateDashboard, generateKPIs } from "@/lib/dashboard-generator"
import type { ChartConfig, KPIData } from "@/lib/dashboard-generator"
import type { ParsedCSV } from "@/lib/csv-parser"
import {
  getDashboards,
  saveDashboard,
  deleteDashboard,
  type StoredDashboard,
} from "@/lib/storage"
import { ArrowLeft, Plus } from "lucide-react"

type View = "portal" | "list" | "dashboard"

export default function DataOPanelPage() {
  // Auth state
  const [clientKey, setClientKey] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Dashboard state
  const [dashboards, setDashboards] = useState<StoredDashboard[]>([])
  const [currentView, setCurrentView] = useState<View>("portal")
  const [activeDashboard, setActiveDashboard] = useState<StoredDashboard | null>(null)
  const [charts, setCharts] = useState<ChartConfig[]>([])
  const [kpis, setKPIs] = useState<KPIData[]>([])

  // Load dashboards when authenticated
  useEffect(() => {
    if (isAuthenticated && clientKey) {
      setDashboards(getDashboards(clientKey))
    }
  }, [isAuthenticated, clientKey])

  // Handle login
  const handleLogin = useCallback((key: string, name: string) => {
    setClientKey(key)
    setBusinessName(name)
    setIsAuthenticated(true)
    setCurrentView("list")
  }, [])

  // Handle logout
  const handleLogout = useCallback(() => {
    setClientKey("")
    setBusinessName("")
    setIsAuthenticated(false)
    setCurrentView("portal")
    setActiveDashboard(null)
    setCharts([])
    setKPIs([])
  }, [])

  // Handle CSV upload
  const handleCSVUpload = useCallback(
    (data: ParsedCSV, fileName: string) => {
      // Generate charts and KPIs
      const generatedCharts = generateDashboard(data.headers, data.rows)
      const generatedKPIs = generateKPIs(data.headers, data.rows)

      // Save to localStorage
      const saved = saveDashboard(clientKey, {
        name: fileName.replace(".csv", ""),
        headers: data.headers,
        rows: data.rows,
        rowCount: data.rowCount,
      })

      // Update state
      setDashboards(getDashboards(clientKey))
      setActiveDashboard(saved)
      setCharts(generatedCharts)
      setKPIs(generatedKPIs)
      setCurrentView("dashboard")
    },
    [clientKey]
  )

  // Open a saved dashboard
  const handleSelectDashboard = useCallback((dashboard: StoredDashboard) => {
    const generatedCharts = generateDashboard(dashboard.headers, dashboard.rows)
    const generatedKPIs = generateKPIs(dashboard.headers, dashboard.rows)

    setActiveDashboard(dashboard)
    setCharts(generatedCharts)
    setKPIs(generatedKPIs)
    setCurrentView("dashboard")
  }, [])

  // Delete a dashboard
  const handleDeleteDashboard = useCallback(
    (dashboardId: string) => {
      deleteDashboard(clientKey, dashboardId)
      setDashboards(getDashboards(clientKey))

      // If viewing the deleted dashboard, go back to list
      if (activeDashboard?.id === dashboardId) {
        setActiveDashboard(null)
        setCharts([])
        setKPIs([])
        setCurrentView("list")
      }
    },
    [clientKey, activeDashboard]
  )

  // Portal / login screen
  if (!isAuthenticated) {
    return <ClientPortal onLogin={handleLogin} />
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PanelHeader businessName={businessName} onLogout={handleLogout} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        {/* List View */}
        {currentView === "list" && (
          <div className="space-y-6">
            {/* Upload section */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">
                    Nuevo dashboard
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Sube un CSV para generar un dashboard automatico
                  </p>
                </div>
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <CSVUploader onUpload={handleCSVUpload} />
            </div>

            {/* Dashboard list */}
            <DashboardList
              dashboards={dashboards}
              onSelect={handleSelectDashboard}
              onDelete={handleDeleteDashboard}
            />
          </div>
        )}

        {/* Dashboard View */}
        {currentView === "dashboard" && activeDashboard && (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setCurrentView("list")}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a dashboards
            </button>

            <DashboardGrid
              charts={charts}
              kpis={kpis}
              dashboardName={activeDashboard.name}
              rowCount={activeDashboard.rowCount}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4">
        <p className="text-center text-xs text-muted-foreground/50">
          DataO Panel v1.0 MVP &middot; Business Intelligence Lite
        </p>
      </footer>
    </div>
  )
}
