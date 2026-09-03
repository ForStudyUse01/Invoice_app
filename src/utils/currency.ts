export function formatINR(amount: number): string {
  if (!Number.isFinite(amount)) return '0.00'
  const formatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return formatter.format(amount)
}

export function formatCurrency(amount: number, currency: string): string {
  if (currency === 'INR') {
    return '₹' + formatINR(amount)
  }
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return formatter.format(Number.isFinite(amount) ? amount : 0)
}
