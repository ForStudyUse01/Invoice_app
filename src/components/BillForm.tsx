import type { Bill } from '../types/invoice'
import { validateBill } from '../utils/validation'
import BillItems from './BillItems'

interface Props {
  bill: Bill
  onChange: (b: Bill) => void
  onDownload: () => void
  onPrint: () => void
  onSave: () => void
  onNew: () => void
}

export default function BillForm({ bill, onChange, onDownload, onPrint, onSave, onNew }: Props) {
  const { errors } = validateBill(bill)

  function set<K extends keyof Bill>(key: K, value: Bill[K]) {
    onChange({ ...bill, [key]: value })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Create Bill</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="field-label" htmlFor="b-number">
            Bill Number
          </label>
          <input
            id="b-number"
            className="field-input"
            value={bill.billNumber}
            onChange={(e) => set('billNumber', e.target.value)}
          />
          {errors.billNumber && <p className="field-error">{errors.billNumber}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="b-date">
            Date
          </label>
          <input
            id="b-date"
            type="date"
            className="field-input"
            value={bill.date}
            onChange={(e) => set('date', e.target.value)}
          />
          {errors.date && <p className="field-error">{errors.date}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="b-recipient">
            To / Company Name
          </label>
          <input
            id="b-recipient"
            className="field-input"
            value={bill.recipientName}
            onChange={(e) => set('recipientName', e.target.value)}
          />
          {errors.recipientName && <p className="field-error">{errors.recipientName}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="b-address">
            Recipient Address
          </label>
          <textarea
            id="b-address"
            className="field-input"
            rows={2}
            value={bill.recipientAddress}
            onChange={(e) => set('recipientAddress', e.target.value)}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="b-tel">
            Telephone
          </label>
          <input
            id="b-tel"
            className="field-input"
            value={bill.telephone}
            onChange={(e) => set('telephone', e.target.value)}
          />
        </div>
      </div>

      <BillItems items={bill.items} onChange={(items) => set('items', items)} />
      {errors.items && <p className="field-error">{errors.items}</p>}

      <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200 mt-4">
        <button className="btn-primary" onClick={onDownload}>
          Download PDF
        </button>
        <button className="btn-secondary" onClick={onPrint}>
          Print
        </button>
        <button className="btn-secondary" onClick={onSave}>
          Save Bill
        </button>
        <button className="btn-secondary" onClick={onNew}>
          New Bill
        </button>
      </div>
    </div>
  )
}
