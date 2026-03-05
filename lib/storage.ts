/**
 * Local Storage Utility for DataO Panel MVP
 * Stores dashboards linked to client keys.
 * 
 * Structure:
 * datao_dashboards: {
 *   [clientKey]: Dashboard[]
 * }
 * 
 * Future: Replace with cloud database (Supabase, etc.)
 */

export interface StoredDashboard {
  id: string
  name: string
  uploadDate: string
  headers: string[]
  rows: Record<string, string>[]
  rowCount: number
}

interface DashboardStore {
  [clientKey: string]: StoredDashboard[]
}

const STORAGE_KEY = "datao_dashboards"

/**
 * Get all dashboards for a client key
 */
export function getDashboards(clientKey: string): StoredDashboard[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    const store: DashboardStore = JSON.parse(data)
    return store[clientKey.toUpperCase()] || []
  } catch {
    return []
  }
}

/**
 * Save a new dashboard for a client key
 */
export function saveDashboard(
  clientKey: string,
  dashboard: Omit<StoredDashboard, "id" | "uploadDate">
): StoredDashboard {
  const key = clientKey.toUpperCase()
  const store = getAllDashboards()

  const newDashboard: StoredDashboard = {
    ...dashboard,
    id: `dash_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    uploadDate: new Date().toISOString(),
  }

  if (!store[key]) {
    store[key] = []
  }
  store[key].push(newDashboard)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  return newDashboard
}

/**
 * Delete a dashboard by ID
 */
export function deleteDashboard(clientKey: string, dashboardId: string): void {
  const key = clientKey.toUpperCase()
  const store = getAllDashboards()

  if (store[key]) {
    store[key] = store[key].filter((d) => d.id !== dashboardId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  }
}

/**
 * Get a specific dashboard by ID
 */
export function getDashboardById(
  clientKey: string,
  dashboardId: string
): StoredDashboard | null {
  const dashboards = getDashboards(clientKey)
  return dashboards.find((d) => d.id === dashboardId) || null
}

/**
 * Get all dashboards across all clients (internal use)
 */
function getAllDashboards(): DashboardStore {
  if (typeof window === "undefined") return {}
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

/**
 * Valid client keys for the MVP
 */
const VALID_KEYS: Record<string, { name: string; businessName: string }> = {
  DEMO2026: { name: "Demo User", businessName: "Demo Business" },
  PADEL2026: { name: "Padel Pro", businessName: "Padel Pro" },
  DATAO2026: { name: "DataO Admin", businessName: "DataO" },
}

/**
 * Validate a client key
 */
export function validateClientKey(
  key: string
): { valid: boolean; client?: { name: string; businessName: string } } {
  const upperKey = key.toUpperCase().trim()
  const client = VALID_KEYS[upperKey]
  if (client) {
    return { valid: true, client }
  }
  return { valid: false }
}
