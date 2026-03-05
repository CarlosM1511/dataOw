"use client"

/**
 * CSV Uploader Component
 * Drag-and-drop or click to upload CSV files.
 * Parses the file and triggers dashboard generation.
 */

import { useState, useCallback, useRef } from "react"
import { parseCSVFile, type ParsedCSV } from "@/lib/csv-parser"
import { Upload, FileSpreadsheet, X, AlertCircle } from "lucide-react"

interface CSVUploaderProps {
  onUpload: (data: ParsedCSV, fileName: string) => void
}

export function CSVUploader({ onUpload }: CSVUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState("")
  const [fileName, setFileName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".csv")) {
        setError("Solo se aceptan archivos CSV")
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("El archivo es muy grande (max 10MB)")
        return
      }

      setError("")
      setParsing(true)
      setFileName(file.name)

      try {
        const parsed = await parseCSVFile(file)

        if (parsed.rowCount === 0) {
          setError("El archivo CSV esta vacio")
          setParsing(false)
          return
        }

        if (parsed.headers.length === 0) {
          setError("No se encontraron columnas en el CSV")
          setParsing(false)
          return
        }

        onUpload(parsed, file.name)
      } catch {
        setError("Error al leer el archivo. Verifica el formato CSV.")
      } finally {
        setParsing(false)
      }
    },
    [onUpload]
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [handleFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0])
      }
    },
    [handleFile]
  )

  const reset = () => {
    setFileName("")
    setError("")
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="w-full">
      <div
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/40 hover:bg-card"
        } ${parsing ? "pointer-events-none opacity-60" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Subir archivo CSV"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="hidden"
          aria-hidden="true"
        />

        {parsing ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Analizando {fileName}...
            </p>
          </div>
        ) : fileName && !error ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{fileName}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Archivo cargado correctamente
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                reset()
              }}
              className="mt-1 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-3 w-3" />
              Cambiar archivo
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                Sube tu archivo CSV
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Arrastra y suelta o haz clic para seleccionar
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Maximo 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
          <button
            type="button"
            onClick={reset}
            className="ml-auto text-destructive/60 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
