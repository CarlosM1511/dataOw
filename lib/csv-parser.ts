/**
 * CSV Parser Utility
 * Parses CSV files using PapaParse and returns structured data.
 * Designed to work with any simple dataset.
 */

import Papa from "papaparse"

export interface ParsedCSV {
  headers: string[]
  rows: Record<string, string>[]
  rowCount: number
}

/**
 * Parse a CSV file and return structured data
 */
export function parseCSVFile(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const headers = results.meta.fields || []
        const rows = results.data as Record<string, string>[]
        resolve({
          headers,
          rows,
          rowCount: rows.length,
        })
      },
      error: (error: Error) => {
        reject(error)
      },
    })
  })
}

/**
 * Detect column types for intelligent chart generation
 */
export type ColumnType = "numeric" | "date" | "categorical"

export interface ColumnAnalysis {
  name: string
  type: ColumnType
  uniqueValues: number
  sampleValues: (string | number)[]
}

export function analyzeColumns(
  headers: string[],
  rows: Record<string, string>[]
): ColumnAnalysis[] {
  return headers.map((header) => {
    const values = rows
      .map((row) => row[header])
      .filter((v) => v !== null && v !== undefined && v !== "")

    const uniqueValues = new Set(values).size
    const sampleValues = values.slice(0, 5)

    // Detect numeric columns
    const numericCount = values.filter(
      (v) => !isNaN(Number(v)) && v !== ""
    ).length
    const isNumeric = numericCount / values.length > 0.8

    // Detect date columns
    const dateKeywords = ["date", "fecha", "time", "dia", "day", "month", "mes", "year", "año", "periodo"]
    const isDateByName = dateKeywords.some((kw) =>
      header.toLowerCase().includes(kw)
    )

    let type: ColumnType = "categorical"
    if (isDateByName) {
      type = "date"
    } else if (isNumeric) {
      type = "numeric"
    }

    return {
      name: header,
      type,
      uniqueValues,
      sampleValues,
    }
  })
}
