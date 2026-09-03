import { jsPDF } from 'jspdf'
import type { Bill } from '../types/invoice'
import type { Profile, Settings } from '../types/profile'
import { formatINR } from '../utils/currency'
import { formatDate } from '../utils/numbering'

const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 15
const CONTENT_W = PAGE_W - MARGIN * 2

const COL_SR_W = 14
const COL_AMT_W = 38
const COL_DESC_W = CONTENT_W - COL_SR_W - COL_AMT_W

const ROW_H = 8
const MIN_ITEM_ROWS = 6
const HEADER_ROW_H = 9

function drawHeader(doc: jsPDF, profile: Profile, settings: Settings): number {
  let y = MARGIN + 5

  doc.setFont('times', 'bold')
  doc.setFontSize(16)
  doc.text(profile.name || 'Your Name', PAGE_W / 2, y, { align: 'center' })
  y += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  const addressLines = (profile.address || '').split('\n').filter(Boolean)
  for (const line of addressLines) {
    doc.text(line, PAGE_W / 2, y, { align: 'center' })
    y += 4.2
  }

  y += 1.5
  doc.setFontSize(9.5)
  doc.setFont('helvetica', 'bold')
  doc.text('Email: ', MARGIN, y)
  doc.setFont('helvetica', 'normal')
  doc.text(profile.email || '', MARGIN + doc.getTextWidth('Email: '), y)

  doc.setFont('helvetica', 'bold')
  const phoneLabel = 'Phone: '
  const phoneValue = profile.phone || ''
  const phoneW = doc.getTextWidth(phoneLabel + phoneValue)
  doc.text(phoneLabel, PAGE_W - MARGIN - phoneW, y)
  doc.setFont('helvetica', 'normal')
  doc.text(phoneValue, PAGE_W - MARGIN - phoneW + doc.getTextWidth(phoneLabel), y)

  y += 3
  doc.setLineWidth(0.4)
  doc.line(MARGIN, y, PAGE_W - MARGIN, y)
  y += 9

  doc.setFont('times', 'bold')
  doc.setFontSize(15)
  doc.text((settings.invoiceTitle || 'BILL FOR BROKERAGE').toUpperCase(), PAGE_W / 2, y, {
    align: 'center',
    charSpace: 0.6,
  })
  y += 8

  return y
}

function drawRecipientBox(doc: jsPDF, bill: Bill, y: number): number {
  const boxH = 28
  const boxW = CONTENT_W * 0.62
  doc.setLineWidth(0.3)
  doc.rect(MARGIN, y, boxW, boxH)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('To', MARGIN + 3, y + 6)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(bill.recipientName || '', MARGIN + 3, y + 12)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  const addrLines = doc.splitTextToSize(bill.recipientAddress || '', boxW - 6)
  doc.text(addrLines, MARGIN + 3, y + 17)

  doc.setFontSize(9.5)
  doc.text('Tel. ' + (bill.telephone || ''), MARGIN + 3, y + boxH - 3)

  const rightX = MARGIN + boxW + 8
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10.5)
  doc.text('No.:', rightX, y + 8)
  doc.setFont('helvetica', 'bold')
  doc.text(bill.billNumber || '', rightX + 12, y + 8)

  doc.setFont('helvetica', 'normal')
  doc.text('Date:', rightX, y + 18)
  doc.setFont('helvetica', 'bold')
  doc.text(formatDate(bill.date, 'DD/MM/YYYY'), rightX + 14, y + 18)

  return y + boxH + 8
}

function drawTable(doc: jsPDF, bill: Bill, settings: Settings, startY: number): number {
  const x0 = MARGIN
  const xSrEnd = x0 + COL_SR_W
  const xDescEnd = xSrEnd + COL_DESC_W
  const xAmtEnd = xDescEnd + COL_AMT_W

  let y = startY
  doc.setLineWidth(0.3)

  // header row
  doc.rect(x0, y, CONTENT_W, HEADER_ROW_H)
  doc.line(xSrEnd, y, xSrEnd, y + HEADER_ROW_H)
  doc.line(xDescEnd, y, xDescEnd, y + HEADER_ROW_H)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.text('Sr no.', x0 + COL_SR_W / 2, y + HEADER_ROW_H / 2 + 1.5, { align: 'center' })
  doc.text('Description', x0 + COL_SR_W + COL_DESC_W / 2, y + HEADER_ROW_H / 2 + 1.5, {
    align: 'center',
  })
  doc.text('Amount', xDescEnd + COL_AMT_W / 2, y + HEADER_ROW_H / 2 + 1.5, { align: 'center' })
  y += HEADER_ROW_H

  const items = bill.items.filter((i) => i.description.trim() || i.amount)
  const rowCount = Math.max(items.length, MIN_ITEM_ROWS)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  const FOOTER_RESERVE = 75 // space needed below the table for PAN/bank/signature block
  for (let i = 0; i < rowCount; i++) {
    if (y + ROW_H > PAGE_H - FOOTER_RESERVE && i < rowCount - 1) {
      doc.addPage()
      y = MARGIN
      doc.rect(x0, y, CONTENT_W, HEADER_ROW_H)
      doc.line(xSrEnd, y, xSrEnd, y + HEADER_ROW_H)
      doc.line(xDescEnd, y, xDescEnd, y + HEADER_ROW_H)
      doc.setFont('helvetica', 'bold')
      doc.text('Sr no.', x0 + COL_SR_W / 2, y + HEADER_ROW_H / 2 + 1.5, { align: 'center' })
      doc.text('Description', x0 + COL_SR_W + COL_DESC_W / 2, y + HEADER_ROW_H / 2 + 1.5, {
        align: 'center',
      })
      doc.text('Amount', xDescEnd + COL_AMT_W / 2, y + HEADER_ROW_H / 2 + 1.5, { align: 'center' })
      y += HEADER_ROW_H
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
    }
    doc.rect(x0, y, CONTENT_W, ROW_H)
    doc.line(xSrEnd, y, xSrEnd, y + ROW_H)
    doc.line(xDescEnd, y, xDescEnd, y + ROW_H)
    const item = items[i]
    if (item) {
      doc.text(String(i + 1), x0 + COL_SR_W / 2, y + ROW_H / 2 + 1.5, { align: 'center' })
      const descLines = doc.splitTextToSize(item.description, COL_DESC_W - 4)
      doc.text(descLines[0] || '', xSrEnd + 2, y + ROW_H / 2 + 1.5)
      doc.text(formatINR(item.amount), xAmtEnd - 3, y + ROW_H / 2 + 1.5, { align: 'right' })
    }
    y += ROW_H
  }

  // sub total row
  doc.rect(x0, y, CONTENT_W, ROW_H)
  doc.line(xDescEnd, y, xDescEnd, y + ROW_H)
  doc.setFont('helvetica', 'bold')
  doc.text('Sub Total', xDescEnd - 3, y + ROW_H / 2 + 1.5, { align: 'right' })
  doc.text(formatINR(bill.subtotal), xAmtEnd - 3, y + ROW_H / 2 + 1.5, { align: 'right' })
  y += ROW_H

  // total row
  doc.rect(x0, y, CONTENT_W, ROW_H)
  doc.line(xDescEnd, y, xDescEnd, y + ROW_H)
  doc.setFontSize(10.5)
  doc.text('Total ' + (settings.currency === 'INR' ? 'Rs.' : settings.currency), xDescEnd - 3, y + ROW_H / 2 + 1.5, {
    align: 'right',
  })
  doc.text(formatINR(bill.total), xAmtEnd - 3, y + ROW_H / 2 + 1.5, { align: 'right' })
  y += ROW_H

  return y + 6
}

function drawFooter(doc: jsPDF, profile: Profile, y: number): void {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.text('PAN NO: ' + (profile.pan || ''), PAGE_W - MARGIN, y, { align: 'right' })
  y += 3
  doc.setLineWidth(0.2)
  doc.line(PAGE_W - MARGIN - doc.getTextWidth('PAN NO: ' + (profile.pan || '')), y, PAGE_W - MARGIN, y)
  y += 10

  const bankColX = MARGIN
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.text('NEFT BANK DETAILS', bankColX, y)

  doc.setFont('helvetica', 'bold')
  doc.text('For ' + (profile.name || ''), PAGE_W - MARGIN, y, { align: 'right' })
  y += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  const bankLines = [
    'BANK: ' + (profile.bankName || ''),
    'BRANCH: ' + (profile.branch || ''),
    'A/c: ' + (profile.accountNumber || ''),
    'IFSC CODE: ' + (profile.ifsc || ''),
  ]
  for (const line of bankLines) {
    doc.text(line, bankColX, y)
    y += 4.5
  }

  const sigY = y + 20

  if (profile.signatureDataUrl) {
    const format = profile.signatureDataUrl.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG'
    const maxW = 50
    const maxH = 16
    let props: { width: number; height: number } | null = null
    try {
      props = doc.getImageProperties(profile.signatureDataUrl)
    } catch {
      props = null
    }
    if (props && props.width && props.height) {
      const scale = Math.min(maxW / props.width, maxH / props.height)
      const w = props.width * scale
      const h = props.height * scale
      doc.addImage(profile.signatureDataUrl, format, PAGE_W - MARGIN - w, sigY - h - 1, w, h)
    }
  }

  doc.setLineWidth(0.3)
  doc.line(PAGE_W - MARGIN - 55, sigY, PAGE_W - MARGIN, sigY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('AUTHORISED SIGNATORY', PAGE_W - MARGIN, sigY + 5, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text('RECEIVERS SIGNATURE OR SEAL OF COMPANY', MARGIN, sigY + 5)
}

export function generateBillPDF(bill: Bill, profile: Profile, settings: Settings): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  let y = drawHeader(doc, profile, settings)
  y = drawRecipientBox(doc, bill, y)
  y = drawTable(doc, bill, settings, y)
  drawFooter(doc, profile, y)
  return doc
}

export function downloadBillPDF(bill: Bill, profile: Profile, settings: Settings): void {
  const doc = generateBillPDF(bill, profile, settings)
  const filename = (bill.billNumber || 'bill').replace(/[^a-z0-9-_]+/gi, '_') + '.pdf'
  doc.save(filename)
}

export function printBillPDF(bill: Bill, profile: Profile, settings: Settings): void {
  const doc = generateBillPDF(bill, profile, settings)
  doc.autoPrint()
  const blobUrl = doc.output('bloburl')
  window.open(blobUrl as unknown as string, '_blank')
}
