"use client"

/**
 * Client Portal Component
 * Entry point for clients to access their DataO Panel.
 * Validates client key and grants access to dashboards.
 */

import { useState } from "react"
import { validateClientKey } from "@/lib/storage"
import { KeyRound, ArrowRight, AlertCircle } from "lucide-react"

interface ClientPortalProps {
  onLogin: (clientKey: string, businessName: string) => void
}

export function ClientPortal({ onLogin }: ClientPortalProps) {
  const [key, setKey] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!key.trim()) {
      setError("Ingresa tu clave de acceso")
      return
    }

    setLoading(true)
    setError("")

    // Simulate network delay for UX
    await new Promise((resolve) => setTimeout(resolve, 600))

    const result = validateClientKey(key)
    if (result.valid && result.client) {
      onLogin(key.toUpperCase().trim(), result.client.businessName)
    } else {
      setError("Clave invalida. Verifica e intenta de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo area */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            DataO Panel
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tu negocio, visualizado.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <label
              htmlFor="client-key"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Clave de acceso
            </label>
            <div className="flex gap-3">
              <input
                id="client-key"
                type="text"
                value={key}
                onChange={(e) => {
                  setKey(e.target.value)
                  setError("")
                }}
                placeholder="Ej: DEMO2026"
                className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                autoComplete="off"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </div>

            {error && (
              <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </form>

        {/* Demo hint */}
        <p className="mt-6 text-center text-xs text-muted-foreground/60">
          Prueba con la clave{" "}
          <button
            type="button"
            onClick={() => setKey("DEMO2026")}
            className="font-mono font-semibold text-primary/70 transition-colors hover:text-primary"
          >
            DEMO2026
          </button>{" "}
          para ver una demo
        </p>
      </div>
    </div>
  )
}
