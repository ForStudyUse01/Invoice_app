import type { Settings } from '../types/profile'

export function nextBillNumberString(settings: Settings): string {
  const padded = String(settings.nextBillNumber).padStart(3, '0')
  return settings.billPrefix + padded
}

export function formatDate(iso: string, format: Settings['dateFormat']): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  switch (format) {
    case 'DD/MM/YYYY':
      return d + '/' + m + '/' + y
    case 'MM/DD/YYYY':
      return m + '/' + d + '/' + y
    case 'DD-MM-YYYY':
      return d + '-' + m + '-' + y
    case 'YYYY-MM-DD':
    default:
      return y + '-' + m + '-' + d
  }
}

export function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return y + '-' + m + '-' + day
}
