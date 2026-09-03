import type { Bill } from '../types/invoice'
import type { Profile, Settings } from '../types/profile'
import { formatINR } from '../utils/currency'
import { formatDate } from '../utils/numbering'

interface Props {
  bill: Bill
  profile: Profile
  settings: Settings
}

const MIN_ROWS = 6

export default function InvoicePreview({ bill, profile, settings }: Props) {
  const items = bill.items.filter((i) => i.description.trim() || i.amount)
  const filler = Math.max(0, MIN_ROWS - items.length)

  return (
    <div
      id="print-area"
      className="mx-auto bg-white text-black shadow-sm border border-slate-200"
      style={{ width: '210mm', minHeight: '297mm', padding: '15mm', fontFamily: 'Georgia, Times, serif' }}
    >
      <div className="text-center">
        <div className="text-xl font-bold tracking-wide">{profile.name || 'Your Name'}</div>
        {(profile.address || '').split('\n').filter(Boolean).map((line, i) => (
          <div key={i} className="text-[11px] leading-tight" style={{ fontFamily: 'Arial, sans-serif' }}>
            {line}
          </div>
        ))}
      </div>

      <div
        className="flex justify-between text-[11px] mt-2"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        <div>
          <span className="font-bold">Email: </span>
          {profile.email}
        </div>
        <div>
          <span className="font-bold">Phone: </span>
          {profile.phone}
        </div>
      </div>

      <hr className="border-t border-black mt-2" />

      <h1
        className="text-center font-bold mt-4 mb-4"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '20px', letterSpacing: '2px' }}
      >
        {(settings.invoiceTitle || 'BILL FOR BROKERAGE').toUpperCase()}
      </h1>

      <div className="flex gap-4 text-[12px]" style={{ fontFamily: 'Arial, sans-serif' }}>
        <div className="border border-black flex-[0_0_62%] p-2 min-h-[26mm] flex flex-col justify-between">
          <div>
            <div>To</div>
            <div className="font-bold mt-1">{bill.recipientName}</div>
            <div className="whitespace-pre-line text-[11px]">{bill.recipientAddress}</div>
          </div>
          <div>Tel. {bill.telephone}</div>
        </div>
        <div className="flex-1 pt-2 space-y-3">
          <div>
            No.: <span className="font-bold">{bill.billNumber}</span>
          </div>
          <div>
            Date: <span className="font-bold">{formatDate(bill.date, settings.dateFormat)}</span>
          </div>
        </div>
      </div>

      <table
        className="w-full border-collapse border border-black mt-4 text-[12px]"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        <thead>
          <tr>
            <th className="border border-black py-1 w-[10%] font-bold">Sr no.</th>
            <th className="border border-black py-1 font-bold">Description</th>
            <th className="border border-black py-1 w-[22%] font-bold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.id}>
              <td className="border border-black text-center py-1.5">{i + 1}</td>
              <td className="border border-black px-2 py-1.5">{item.description}</td>
              <td className="border border-black text-right px-2 py-1.5">{formatINR(item.amount)}</td>
            </tr>
          ))}
          {Array.from({ length: filler }).map((_, i) => (
            <tr key={'filler-' + i}>
              <td className="border border-black py-2.5">&nbsp;</td>
              <td className="border border-black">&nbsp;</td>
              <td className="border border-black">&nbsp;</td>
            </tr>
          ))}
          <tr>
            <td className="border border-black" colSpan={2}>
              <div className="text-right font-bold pr-2">Sub Total</div>
            </td>
            <td className="border border-black text-right px-2 font-bold">{formatINR(bill.subtotal)}</td>
          </tr>
          <tr>
            <td className="border border-black" colSpan={2}>
              <div className="text-right font-bold pr-2">
                Total {settings.currency === 'INR' ? 'Rs.' : settings.currency}
              </div>
            </td>
            <td className="border border-black text-right px-2 font-bold">{formatINR(bill.total)}</td>
          </tr>
        </tbody>
      </table>

      <div
        className="text-right font-bold text-[11px] mt-1 border-b border-black inline-block ml-auto"
        style={{ fontFamily: 'Arial, sans-serif', display: 'block' }}
      >
        PAN NO: {profile.pan}
      </div>

      <div className="flex justify-between mt-8 text-[11px]" style={{ fontFamily: 'Arial, sans-serif' }}>
        <div>
          <div className="font-bold mb-1">NEFT BANK DETAILS</div>
          <div>BANK: {profile.bankName}</div>
          <div>BRANCH: {profile.branch}</div>
          <div>A/c: {profile.accountNumber}</div>
          <div>IFSC CODE: {profile.ifsc}</div>
        </div>
        <div className="text-right font-bold">For {profile.name}</div>
      </div>

      <div className="flex justify-between items-end mt-12 text-[10px]" style={{ fontFamily: 'Arial, sans-serif' }}>
        <div>RECEIVERS SIGNATURE OR SEAL OF COMPANY</div>
        <div className="text-right w-44">
          {profile.signatureDataUrl && (
            <img src={profile.signatureDataUrl} alt="Signature" className="h-12 ml-auto object-contain" />
          )}
          <div className="border-t border-black pt-1 font-bold">AUTHORISED SIGNATORY</div>
        </div>
      </div>
    </div>
  )
}
