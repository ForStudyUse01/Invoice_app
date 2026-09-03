import type { BillItem } from '../types/invoice'
import { emptyBillItem } from '../types/invoice'
import { formatINR } from '../utils/currency'

interface Props {
  items: BillItem[]
  onChange: (items: BillItem[]) => void
}

export default function BillItems({ items, onChange }: Props) {
  function update(id: string, patch: Partial<BillItem>) {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  }

  function addItem() {
    onChange([...items, emptyBillItem()])
  }

  function removeItem(id: string) {
    onChange(items.filter((i) => i.id !== id))
  }

  const subtotal = items.reduce((sum, i) => sum + (Number.isFinite(i.amount) ? i.amount : 0), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="field-label mb-0">Bill Items</label>
        <button type="button" className="btn-secondary" onClick={addItem}>
          + Add Item
        </button>
      </div>

      <div className="space-y-3 sm:space-y-2">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row gap-2 sm:items-start pb-3 sm:pb-0 border-b border-slate-100 sm:border-0 last:border-0"
          >
            <div className="flex gap-2 items-start flex-1 min-w-0">
              <div className="w-6 pt-2 text-sm text-slate-500 text-center shrink-0">{idx + 1}</div>
              <input
                className="field-input flex-1 min-w-0"
                placeholder="Description"
                value={item.description}
                onChange={(e) => update(item.id, { description: e.target.value })}
              />
            </div>
            <div className="flex gap-2 items-start pl-8 sm:pl-0 shrink-0">
              <input
                className="field-input w-full sm:w-32"
                type="number"
                inputMode="decimal"
                step="0.01"
                min={0}
                placeholder="Amount"
                value={item.amount || ''}
                onChange={(e) => update(item.id, { amount: parseFloat(e.target.value) || 0 })}
              />
              <button
                type="button"
                className="btn-danger px-2 shrink-0"
                aria-label="Delete item"
                onClick={() => removeItem(item.id)}
                disabled={items.length === 1}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-3 text-sm font-semibold text-slate-700">
        Subtotal: ₹{formatINR(subtotal)}
      </div>
    </div>
  )
}
