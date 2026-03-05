/**
 * Dashboard Generator
 * Automatically generates chart configurations from parsed CSV data.
 * Adapts to any simple dataset by analyzing column types.
 */

import { type ColumnAnalysis, analyzeColumns } from "./csv-parser"

export type ChartType = "line" | "bar" | "pie" | "horizontal-bar"

export interface ChartConfig {
  id: string
  title: string
  type: ChartType
  data: Record<string, string | number>[]
  xKey: string
  yKey: string
  color: string
}

const CHART_COLORS = [
  "hsl(172, 100%, 50%)", // Primary cyan
  "hsl(217, 91%, 60%)",  // Blue
  "hsl(142, 71%, 45%)",  // Green
  "hsl(38, 92%, 50%)",   // Amber
  "hsl(340, 82%, 52%)",  // Rose
]

/**
 * Generate up to 4 chart configurations from the CSV data
 */
export function generateDashboard(
  headers: string[],
  rows: Record<string, string>[]
): ChartConfig[] {
  const columns = analyzeColumns(headers, rows)
  const charts: ChartConfig[] = []

  const dateColumns = columns.filter((c) => c.type === "date")
  const numericColumns = columns.filter((c) => c.type === "numeric")
  const categoricalColumns = columns.filter(
    (c) => c.type === "categorical" && c.uniqueValues > 1 && c.uniqueValues <= 50
  )

  // Chart 1: Numeric over time (line chart)
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    const dateCol = dateColumns[0]
    const numCol = numericColumns[0]
    const aggregated = aggregateByKey(rows, dateCol.name, numCol.name)

    charts.push({
      id: "chart-1",
      title: `${numCol.name} por ${dateCol.name}`,
      type: "line",
      data: aggregated.slice(0, 30), // Cap at 30 data points for readability
      xKey: dateCol.name,
      yKey: numCol.name,
      color: CHART_COLORS[0],
    })
  }

  // Chart 2: Top categories (bar chart)
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    const catCol = categoricalColumns[0]
    const numCol = numericColumns[0]
    const aggregated = aggregateByKey(rows, catCol.name, numCol.name)
      .sort((a, b) => (Number(b[numCol.name]) || 0) - (Number(a[numCol.name]) || 0))
      .slice(0, 10)

    charts.push({
      id: "chart-2",
      title: `Top ${catCol.name} por ${numCol.name}`,
      type: "bar",
      data: aggregated,
      xKey: catCol.name,
      yKey: numCol.name,
      color: CHART_COLORS[1],
    })
  }

  // Chart 3: Distribution (pie chart)
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    const catCol =
      categoricalColumns.length > 1 ? categoricalColumns[1] : categoricalColumns[0]
    const numCol = numericColumns.length > 1 ? numericColumns[1] : numericColumns[0]
    const aggregated = aggregateByKey(rows, catCol.name, numCol.name)
      .sort((a, b) => (Number(b[numCol.name]) || 0) - (Number(a[numCol.name]) || 0))
      .slice(0, 8)

    charts.push({
      id: "chart-3",
      title: `Distribucion de ${numCol.name} por ${catCol.name}`,
      type: "pie",
      data: aggregated,
      xKey: catCol.name,
      yKey: numCol.name,
      color: CHART_COLORS[2],
    })
  }

  // Chart 4: Secondary numeric by category (horizontal bar)
  if (categoricalColumns.length > 0 && numericColumns.length > 1) {
    const catCol = categoricalColumns[0]
    const numCol = numericColumns[1]
    const aggregated = aggregateByKey(rows, catCol.name, numCol.name)
      .sort((a, b) => (Number(b[numCol.name]) || 0) - (Number(a[numCol.name]) || 0))
      .slice(0, 10)

    charts.push({
      id: "chart-4",
      title: `${numCol.name} por ${catCol.name}`,
      type: "horizontal-bar",
      data: aggregated,
      xKey: catCol.name,
      yKey: numCol.name,
      color: CHART_COLORS[3],
    })
  }

  // Fallback: if we have fewer than 4 charts, try generating more
  if (charts.length < 4 && numericColumns.length >= 2 && dateColumns.length > 0) {
    const dateCol = dateColumns[0]
    const numCol = numericColumns[1]
    const aggregated = aggregateByKey(rows, dateCol.name, numCol.name)

    charts.push({
      id: `chart-fallback-${charts.length}`,
      title: `${numCol.name} por ${dateCol.name}`,
      type: "line",
      data: aggregated.slice(0, 30),
      xKey: dateCol.name,
      yKey: numCol.name,
      color: CHART_COLORS[charts.length % CHART_COLORS.length],
    })
  }

  // If still too few, add count-based charts
  if (charts.length < 2 && categoricalColumns.length > 0) {
    const catCol = categoricalColumns[0]
    const countData = countByKey(rows, catCol.name).slice(0, 10)

    charts.push({
      id: `chart-count-${charts.length}`,
      title: `Conteo por ${catCol.name}`,
      type: "bar",
      data: countData,
      xKey: catCol.name,
      yKey: "count",
      color: CHART_COLORS[charts.length % CHART_COLORS.length],
    })
  }

  return charts.slice(0, 4)
}

/**
 * Aggregate numeric values by a key column
 */
function aggregateByKey(
  rows: Record<string, string>[],
  keyCol: string,
  valueCol: string
): Record<string, string | number>[] {
  const map = new Map<string, number>()

  rows.forEach((row) => {
    const key = String(row[keyCol] ?? "")
    const value = Number(row[valueCol]) || 0
    map.set(key, (map.get(key) || 0) + value)
  })

  return Array.from(map.entries()).map(([key, value]) => ({
    [keyCol]: key,
    [valueCol]: Math.round(value * 100) / 100,
  }))
}

/**
 * Count occurrences by a key column
 */
function countByKey(
  rows: Record<string, string>[],
  keyCol: string
): Record<string, string | number>[] {
  const map = new Map<string, number>()

  rows.forEach((row) => {
    const key = String(row[keyCol] ?? "")
    map.set(key, (map.get(key) || 0) + 1)
  })

  return Array.from(map.entries())
    .map(([key, count]) => ({ [keyCol]: key, count }))
    .sort((a, b) => (b.count as number) - (a.count as number))
}

/**
 * Calculate KPI stats from the dataset
 */
export interface KPIData {
  label: string
  value: string
  subtitle: string
}

export function generateKPIs(
  headers: string[],
  rows: Record<string, string>[]
): KPIData[] {
  const columns = analyzeColumns(headers, rows)
  const numericColumns = columns.filter((c) => c.type === "numeric")
  const kpis: KPIData[] = []

  // Total rows
  kpis.push({
    label: "Total registros",
    value: rows.length.toLocaleString(),
    subtitle: "filas en el dataset",
  })

  // Sum of first numeric column
  if (numericColumns.length > 0) {
    const col = numericColumns[0]
    const total = rows.reduce((sum, row) => sum + (Number(row[col.name]) || 0), 0)
    kpis.push({
      label: `Total ${col.name}`,
      value: formatNumber(total),
      subtitle: `suma de ${col.name}`,
    })
  }

  // Average of first numeric column
  if (numericColumns.length > 0) {
    const col = numericColumns[0]
    const total = rows.reduce((sum, row) => sum + (Number(row[col.name]) || 0), 0)
    const avg = total / rows.length
    kpis.push({
      label: `Promedio ${col.name}`,
      value: formatNumber(avg),
      subtitle: `promedio por registro`,
    })
  }

  // Unique values of categorical
  const categoricalColumns = columns.filter(
    (c) => c.type === "categorical" && c.uniqueValues > 1
  )
  if (categoricalColumns.length > 0) {
    const col = categoricalColumns[0]
    kpis.push({
      label: `${col.name} unicos`,
      value: col.uniqueValues.toLocaleString(),
      subtitle: `valores distintos`,
    })
  }

  return kpis.slice(0, 4)
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toFixed(num % 1 === 0 ? 0 : 2)
}
