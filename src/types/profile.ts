export interface Profile {
  name: string
  address: string
  phone: string
  email: string
  pan: string
  bankName: string
  branch: string
  accountNumber: string
  ifsc: string
  authorisedSignatory: string
  signatureDataUrl: string
}

export const emptyProfile: Profile = {
  name: '',
  address: '',
  phone: '',
  email: '',
  pan: '',
  bankName: '',
  branch: '',
  accountNumber: '',
  ifsc: '',
  authorisedSignatory: '',
  signatureDataUrl: '',
}

export const sampleProfile: Profile = {
  name: 'YUVRAJ S. GANDHI',
  address: 'D-32, Bhavani Bhavan Chs,ltd.,\nBhavani Shankar Road\nDadar West Mumbai-400028',
  phone: '+91 9819483233',
  email: 'yuvrajgandhi5@gmail.com',
  pan: 'EJTPG1255H',
  bankName: 'Central Bank of India',
  branch: 'Dadar West',
  accountNumber: '5303976630',
  ifsc: 'CBIN0280600',
  authorisedSignatory: 'Yuvraj S. Gandhi',
  signatureDataUrl: '',
}

export interface Settings {
  currency: string
  invoiceTitle: string
  billPrefix: string
  nextBillNumber: number
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'DD-MM-YYYY' | 'YYYY-MM-DD'
}

export const defaultSettings: Settings = {
  currency: 'INR',
  invoiceTitle: 'BILL FOR BROKERAGE',
  billPrefix: 'BR-',
  nextBillNumber: 1,
  dateFormat: 'DD/MM/YYYY',
}
