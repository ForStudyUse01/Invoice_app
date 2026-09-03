import { useState } from 'react'
import type { Profile } from '../types/profile'
import { sampleProfile } from '../types/profile'
import { validateProfile } from '../utils/validation'
import SignaturePad from './SignaturePad'

interface Props {
  profile: Profile
  onChange: (p: Profile) => void
  onSave: () => void
  onClear: () => void
}

export default function ProfileForm({ profile, onChange, onSave, onClear }: Props) {
  const [saved, setSaved] = useState(false)
  const { errors } = validateProfile(profile)

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    onChange({ ...profile, [key]: value })
    setSaved(false)
  }

  function handleSave() {
    onSave()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleClear() {
    if (confirm('Clear your saved personal details? This cannot be undone.')) {
      onClear()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Details</h2>
        <button className="btn-secondary" onClick={() => onChange(sampleProfile)}>
          Load Sample Data
        </button>
      </div>
      <p className="text-xs text-slate-500">Your data is stored locally on this device. Nothing is sent to a server.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="p-name">
            Full Name
          </label>
          <input
            id="p-name"
            className="field-input"
            value={profile.name}
            onChange={(e) => set('name', e.target.value)}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="p-address">
            Address
          </label>
          <textarea
            id="p-address"
            className="field-input"
            rows={3}
            value={profile.address}
            onChange={(e) => set('address', e.target.value)}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="p-phone">
            Phone Number
          </label>
          <input
            id="p-phone"
            className="field-input"
            value={profile.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="p-email">
            Email
          </label>
          <input
            id="p-email"
            type="email"
            className="field-input"
            value={profile.email}
            onChange={(e) => set('email', e.target.value)}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="p-pan">
            PAN Number
          </label>
          <input
            id="p-pan"
            className="field-input uppercase"
            value={profile.pan}
            onChange={(e) => set('pan', e.target.value.toUpperCase())}
            maxLength={10}
          />
          {errors.pan && <p className="field-error">{errors.pan}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="p-signatory">
            Authorised Signatory Name
          </label>
          <input
            id="p-signatory"
            className="field-input"
            value={profile.authorisedSignatory}
            onChange={(e) => set('authorisedSignatory', e.target.value)}
          />
        </div>
      </div>

      <div className="border-t border-slate-200 pt-5">
        <SignaturePad value={profile.signatureDataUrl} onChange={(dataUrl) => set('signatureDataUrl', dataUrl)} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3 mt-2">Bank Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label" htmlFor="p-bank">
              Bank Name
            </label>
            <input
              id="p-bank"
              className="field-input"
              value={profile.bankName}
              onChange={(e) => set('bankName', e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="p-branch">
              Branch
            </label>
            <input
              id="p-branch"
              className="field-input"
              value={profile.branch}
              onChange={(e) => set('branch', e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="p-account">
              Account Number
            </label>
            <input
              id="p-account"
              className="field-input"
              value={profile.accountNumber}
              onChange={(e) => set('accountNumber', e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="p-ifsc">
              IFSC Code
            </label>
            <input
              id="p-ifsc"
              className="field-input uppercase"
              value={profile.ifsc}
              onChange={(e) => set('ifsc', e.target.value.toUpperCase())}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button className="btn-primary" onClick={handleSave} disabled={!!errors.name}>
          {saved ? 'Saved ✓' : 'Save My Details'}
        </button>
        <button className="btn-danger" onClick={handleClear}>
          Clear My Details
        </button>
      </div>
    </div>
  )
}
