export interface BillItem {
  id: string
  description: string
  amount: number
}

export interface Bill {
  id: string
  billNumber: string
  date: string // ISO yyyy-mm-dd
  recipientName: string
  recipientAddress: string
  telephone: string
  items: BillItem[]
  subtotal: number
  total: number
  createdAt: string
  updatedAt: string
}

export function emptyBillItem(): BillItem {
  return { id: crypto.randomUUID(), description: '', amount: 0 }
}

export function calcTotals(items: BillItem[]): { subtotal: number; total: number } {
  const subtotal = items.reduce((sum, i) => sum + (Number.isFinite(i.amount) ? i.amount : 0), 0)
  return { subtotal, total: subtotal }
}
