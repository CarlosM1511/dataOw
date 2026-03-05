"use client"

/**
 * Chart Card Component
 * Renders a single chart within the dashboard grid.
 * Supports line, bar, pie, and horizontal-bar chart types.
 */

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { ChartConfig } from "@/lib/dashboard-generator"

const PIE_COLORS = [
  "hsl(172, 100%, 50%)",
  "hsl(217, 91%, 60%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(340, 82%, 52%)",
  "hsl(262, 83%, 58%)",
  "hsl(199, 89%, 48%)",
  "hsl(15, 90%, 55%)",
]

interface ChartCardProps {
  chart: ChartConfig
}

export function ChartCard({ chart }: ChartCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/20">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        {chart.title}
      </h3>

      <div className="flex-1" style={{ minHeight: 240 }}>
        <ResponsiveContainer width="100%" height={240}>
          {renderChart(chart)}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function renderChart(chart: ChartConfig) {
  const tooltipStyle = {
    contentStyle: {
      background: "hsl(0, 0%, 4%)",
      border: "1px solid hsl(0, 0%, 15%)",
      borderRadius: "8px",
      fontSize: "12px",
      color: "hsl(0, 0%, 95%)",
    },
    itemStyle: { color: "hsl(0, 0%, 95%)" },
    labelStyle: { color: "hsl(0, 0%, 64%)" },
  }

  switch (chart.type) {
    case "line":
      return (
        <LineChart data={chart.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" />
          <XAxis
            dataKey={chart.xKey}
            tick={{ fill: "hsl(0, 0%, 64%)", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "hsl(0, 0%, 15%)" }}
          />
          <YAxis
            tick={{ fill: "hsl(0, 0%, 64%)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatAxisValue(v)}
          />
          <Tooltip {...tooltipStyle} />
          <Line
            type="monotone"
            dataKey={chart.yKey}
            stroke={chart.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: chart.color }}
          />
        </LineChart>
      )

    case "bar":
      return (
        <BarChart data={chart.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" />
          <XAxis
            dataKey={chart.xKey}
            tick={{ fill: "hsl(0, 0%, 64%)", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "hsl(0, 0%, 15%)" }}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fill: "hsl(0, 0%, 64%)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatAxisValue(v)}
          />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey={chart.yKey} fill={chart.color} radius={[4, 4, 0, 0]} />
        </BarChart>
      )

    case "horizontal-bar":
      return (
        <BarChart data={chart.data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 15%)" />
          <XAxis
            type="number"
            tick={{ fill: "hsl(0, 0%, 64%)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatAxisValue(v)}
          />
          <YAxis
            type="category"
            dataKey={chart.xKey}
            tick={{ fill: "hsl(0, 0%, 64%)", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey={chart.yKey} fill={chart.color} radius={[0, 4, 4, 0]} />
        </BarChart>
      )

    case "pie":
      return (
        <PieChart>
          <Pie
            data={chart.data}
            dataKey={chart.yKey}
            nameKey={chart.xKey}
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={50}
            paddingAngle={2}
            label={({ name, percent }: { name: string; percent: number }) =>
              `${String(name).slice(0, 12)} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {chart.data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PIE_COLORS[index % PIE_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} />
        </PieChart>
      )

    default:
      return <div />
  }
}

function formatAxisValue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return String(value)
}
