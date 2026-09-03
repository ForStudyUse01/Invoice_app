import { useRef, useState } from 'react'
import { storage } from '../services/storage'

interface Props {
  onImported: () => void
}

export default function DataManager({ onImported }: Props) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)

  function handleExport() {
    const json = storage.exportAll()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const stamp = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = 'brokerage-bill-data-' + stamp + '.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportClick() {
    fileInput.current?.click()
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const result = storage.importAll(text)
    if (result.ok) {
      setMessage('Data imported successfully.')
      onImported()
    } else {
      setMessage('Import failed: ' + result.error)
    }
    e.target.value = ''
    setTimeout(() => setMessage(null), 4000)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">Backup &amp; Restore</h3>
      <p className="text-xs text-slate-500">
        Export your profile, bills, and settings as a JSON file, or import a previous backup. Nothing is uploaded
        anywhere.
      </p>
      <div className="flex gap-3">
        <button className="btn-secondary" onClick={handleExport}>
          Export Data
        </button>
        <button className="btn-secondary" onClick={handleImportClick}>
          Import Data
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleFileSelected}
        />
      </div>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </div>
  )
}
