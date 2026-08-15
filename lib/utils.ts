import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | number): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  return format(d, "MMM d, yyyy")
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500"
  if (score >= 60) return "text-yellow-500"
  if (score >= 40) return "text-orange-500"
  return "text-red-500"
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-green-500/10"
  if (score >= 60) return "bg-yellow-500/10"
  if (score >= 40) return "bg-orange-500/10"
  return "bg-red-500/10"
}

export function getLifecycleColor(stage: string): string {
  switch (stage) {
    case "new": return "text-blue-500"
    case "active": return "text-green-500"
    case "dormant": return "text-yellow-500"
    case "archived": return "text-gray-500"
    default: return "text-gray-400"
  }
}

export function getLifecycleBgColor(stage: string): string {
  switch (stage) {
    case "new": return "bg-blue-500/10"
    case "active": return "bg-green-500/10"
    case "dormant": return "bg-yellow-500/10"
    case "archived": return "bg-gray-500/10"
    default: return "bg-gray-400/10"
  }
}
