import type { Settings } from '../types/profile'
import DataManager from './DataManager'

interface Props {
  settings: Settings
  onChange: (s: Settings) => void
  onImported: () => void
  onClearAll: () => void
}

export default function SettingsPanel({ settings, onChange, onImported, onClearAll }: Props) {
  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    onChange({ ...settings, [key]: value })
  }

  function handleClearAll() {
    if (confirm('This will permanently erase your profile, all saved bills, and settings from this device. Continue?')) {
      onClearAll()
    }
  }

  return (
    <div className="space-y-8 max-w-xl">
      <h2 className="text-lg font-semibold">Settings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="field-label" htmlFor="s-currency">
            Default Currency
          </label>
          <select
            id="s-currency"
            className="field-input"
            value={settings.currency}
            onChange={(e) => set('currency', e.target.value)}
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="s-dateformat">
            Date Format
          </label>
          <select
            id="s-dateformat"
            className="field-input"
            value={settings.dateFormat}
            onChange={(e) => set('dateFormat', e.target.value as Settings['dateFormat'])}
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="s-title">
            Default Invoice Title
          </label>
          <input
            id="s-title"
            className="field-input"
            value={settings.invoiceTitle}
            onChange={(e) => set('invoiceTitle', e.target.value)}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="s-prefix">
            Bill Number Prefix
          </label>
          <input
            id="s-prefix"
            className="field-input"
            value={settings.billPrefix}
            onChange={(e) => set('billPrefix', e.target.value)}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="s-next">
            Next Bill Number
          </label>
          <input
            id="s-next"
            type="number"
            min={1}
            className="field-input"
            value={settings.nextBillNumber}
            onChange={(e) => set('nextBillNumber', parseInt(e.target.value, 10) || 1)}
          />
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <DataManager onImported={onImported} />
      </div>

      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-sm font-semibold text-red-700">Danger Zone</h3>
        <p className="text-xs text-slate-500 mt-1 mb-3">
          Permanently erase everything stored on this device: profile, saved bills, and settings.
        </p>
        <button className="btn-danger" onClick={handleClearAll}>
          Clear All Local Data
        </button>
      </div>
    </div>
  )
}
