import type { Bill } from '../types/invoice'
import { formatINR } from '../utils/currency'
import { formatDate } from '../utils/numbering'
import type { Settings } from '../types/profile'

interface Props {
  bills: Bill[]
  settings: Settings
  onOpen: (bill: Bill) => void
  onDuplicate: (bill: Bill) => void
  onDelete: (bill: Bill) => void
  onDownload: (bill: Bill) => void
}

export default function SavedBills({ bills, settings, onOpen, onDuplicate, onDelete, onDownload }: Props) {
  if (bills.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        <p>No saved bills yet.</p>
        <p className="text-sm mt-1">Create a bill and click "Save Bill" to see it here.</p>
      </div>
    )
  }

  const sorted = [...bills].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Saved Bills ({bills.length})</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-4">Bill Number</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Recipient</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((bill) => (
              <tr key={bill.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2 pr-4 font-medium">{bill.billNumber}</td>
                <td className="py-2 pr-4">{formatDate(bill.date, settings.dateFormat)}</td>
                <td className="py-2 pr-4">{bill.recipientName}</td>
                <td className="py-2 pr-4">₹{formatINR(bill.total)}</td>
                <td className="py-2 pr-4">
                  <div className="flex gap-2 flex-wrap">
                    <button className="btn-secondary" onClick={() => onOpen(bill)}>
                      Open
                    </button>
                    <button className="btn-secondary" onClick={() => onDuplicate(bill)}>
                      Duplicate
                    </button>
                    <button className="btn-secondary" onClick={() => onDownload(bill)}>
                      Download PDF
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => {
                        if (confirm('Delete bill ' + bill.billNumber + '? This cannot be undone.')) {
                          onDelete(bill)
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
