import { useEffect, useState } from 'react'
import type { Bill } from './types/invoice'
import { calcTotals, emptyBillItem } from './types/invoice'
import type { Profile, Settings } from './types/profile'
import { emptyProfile, defaultSettings } from './types/profile'
import { storage } from './services/storage'
import { downloadBillPDF, printBillPDF } from './services/pdfGenerator'
import { nextBillNumberString, todayISO } from './utils/numbering'
import { validateBill } from './utils/validation'
import ProfileForm from './components/ProfileForm'
import BillForm from './components/BillForm'
import InvoicePreview from './components/InvoicePreview'
import SavedBills from './components/SavedBills'
import SettingsPanel from './components/SettingsPanel'
import ScaledPreview from './components/ScaledPreview'

type Tab = 'bill' | 'profile' | 'saved' | 'settings'

function newDraftBill(settings: Settings): Bill {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    billNumber: nextBillNumberString(settings),
    date: todayISO(),
    recipientName: '',
    recipientAddress: '',
    telephone: '',
    items: [emptyBillItem()],
    subtotal: 0,
    total: 0,
    createdAt: now,
    updatedAt: now,
  }
}

export default function App() {
  const [tab, setTab] = useState<Tab>('bill')
  const [profile, setProfile] = useState<Profile>(() => storage.loadProfile())
  const [settings, setSettings] = useState<Settings>(() => storage.loadSettings())
  const [bills, setBills] = useState<Bill[]>(() => storage.loadBills())
  const [draft, setDraft] = useState<Bill>(() => newDraftBill(storage.loadSettings()))

  useEffect(() => {
    storage.saveSettings(settings)
  }, [settings])

  useEffect(() => {
    storage.saveBills(bills)
  }, [bills])

  function updateDraft(patch: Partial<Bill> | Bill) {
    setDraft((prev) => {
      const merged = { ...prev, ...patch }
      const totals = calcTotals(merged.items)
      return { ...merged, subtotal: totals.subtotal, total: totals.total }
    })
  }

  function handleSaveProfile() {
    storage.saveProfile(profile)
  }

  function handleClearProfile() {
    setProfile(emptyProfile)
    storage.clearProfile()
  }

  function handleSaveBill() {
    const { valid, errors } = validateBill(draft)
    if (!valid) {
      alert('Please fix the following before saving:\n' + Object.values(errors).join('\n'))
      return
    }
    const now = new Date().toISOString()
    setBills((prev) => {
      const exists = prev.some((b) => b.id === draft.id)
      const saved = { ...draft, updatedAt: now }
      return exists ? prev.map((b) => (b.id === draft.id ? saved : b)) : [...prev, saved]
    })
    if (draft.billNumber === nextBillNumberString(settings)) {
      setSettings((s) => ({ ...s, nextBillNumber: s.nextBillNumber + 1 }))
    }
    alert('Bill ' + draft.billNumber + ' saved.')
  }

  function handleNewBill() {
    setDraft(newDraftBill(settings))
    setTab('bill')
  }

  function handleOpenBill(bill: Bill) {
    setDraft(bill)
    setTab('bill')
  }

  function handleDuplicateBill(bill: Bill) {
    const now = new Date().toISOString()
    const copy: Bill = {
      ...bill,
      id: crypto.randomUUID(),
      billNumber: nextBillNumberString(settings),
      date: todayISO(),
      createdAt: now,
      updatedAt: now,
    }
    setBills((prev) => [...prev, copy])
    setSettings((s) => ({ ...s, nextBillNumber: s.nextBillNumber + 1 }))
  }

  function handleDeleteBill(bill: Bill) {
    setBills((prev) => prev.filter((b) => b.id !== bill.id))
  }

  function handleDownload(bill: Bill) {
    const { valid, errors } = validateBill(bill)
    if (!valid) {
      alert('This bill has issues:\n' + Object.values(errors).join('\n'))
      return
    }
    downloadBillPDF(bill, profile, settings)
  }

  function handlePrint(bill: Bill) {
    const { valid, errors } = validateBill(bill)
    if (!valid) {
      alert('This bill has issues:\n' + Object.values(errors).join('\n'))
      return
    }
    printBillPDF(bill, profile, settings)
  }

  function handleClearAll() {
    storage.clearAll()
    setProfile(emptyProfile)
    setBills([])
    setSettings(defaultSettings)
    setDraft(newDraftBill(defaultSettings))
  }

  function handleImported() {
    setProfile(storage.loadProfile())
    setBills(storage.loadBills())
    setSettings(storage.loadSettings())
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'bill', label: 'Brokerage Bill' },
    { id: 'profile', label: 'My Details' },
    { id: 'saved', label: 'Saved Bills' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h1 className="text-xl font-bold">Brokerage Bill Generator</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Runs entirely in your browser. Your data is stored locally on this device.
          </p>
          <nav
            className="flex gap-1 mt-4 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0"
            role="tablist"
            aria-label="Main"
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={
                  'shrink-0 whitespace-nowrap px-3 sm:px-4 py-2 text-sm font-medium rounded-t-md border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ' +
                  (tab === t.id
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800')
                }
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {tab === 'bill' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 no-print">
              <BillForm
                bill={draft}
                onChange={updateDraft}
                onDownload={() => handleDownload(draft)}
                onPrint={() => handlePrint(draft)}
                onSave={handleSaveBill}
                onNew={handleNewBill}
              />
            </div>
            <div>
              <ScaledPreview>
                <InvoicePreview bill={draft} profile={profile} settings={settings} />
              </ScaledPreview>
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div className="bg-white rounded-lg border border-slate-200 p-5 max-w-3xl no-print">
            <ProfileForm
              profile={profile}
              onChange={setProfile}
              onSave={handleSaveProfile}
              onClear={handleClearProfile}
            />
          </div>
        )}

        {tab === 'saved' && (
          <div className="bg-white rounded-lg border border-slate-200 p-5 no-print">
            <SavedBills
              bills={bills}
              settings={settings}
              onOpen={handleOpenBill}
              onDuplicate={handleDuplicateBill}
              onDelete={handleDeleteBill}
              onDownload={handleDownload}
            />
          </div>
        )}

        {tab === 'settings' && (
          <div className="bg-white rounded-lg border border-slate-200 p-5 no-print">
            <SettingsPanel
              settings={settings}
              onChange={setSettings}
              onImported={handleImported}
              onClearAll={handleClearAll}
            />
          </div>
        )}
      </main>
    </div>
  )
}
