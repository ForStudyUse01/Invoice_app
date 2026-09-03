export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/

export function validatePAN(pan: string): boolean {
  if (!pan) return true // optional field
  return PAN_REGEX.test(pan.trim().toUpperCase())
}

export function validateEmail(email: string): boolean {
  if (!email) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function validateProfile(p: {
  name: string
  pan: string
  email: string
}): ValidationResult {
  const errors: Record<string, string> = {}
  if (!p.name.trim()) errors.name = 'Name is required.'
  if (p.pan && !validatePAN(p.pan)) errors.pan = 'PAN must look like ABCDE1234F.'
  if (p.email && !validateEmail(p.email)) errors.email = 'Enter a valid email address.'
  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateBill(b: {
  billNumber: string
  date: string
  recipientName: string
  items: { description: string; amount: number }[]
}): ValidationResult {
  const errors: Record<string, string> = {}
  if (!b.billNumber.trim()) errors.billNumber = 'Bill number is required.'
  if (!b.date) errors.date = 'Date is required.'
  if (!b.recipientName.trim()) errors.recipientName = 'Recipient name is required.'
  const validItems = b.items.filter((i) => i.description.trim() || i.amount)
  if (validItems.length === 0) {
    errors.items = 'Add at least one item with a description and amount.'
  } else {
    const bad = validItems.find((i) => !i.description.trim() || !(i.amount > 0))
    if (bad) errors.items = 'Every item needs a description and an amount greater than 0.'
  }
  return { valid: Object.keys(errors).length === 0, errors }
}
