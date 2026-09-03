import { useEffect, useRef, useState } from 'react'

interface Props {
  value: string
  onChange: (dataUrl: string) => void
}

type Mode = 'draw' | 'upload'

const MAX_W = 500
const MAX_H = 200

function fileToResizedDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('File is not a readable image.'))
      img.onload = () => {
        const scale = Math.min(1, MAX_W / img.width, MAX_H / img.height)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/png'))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

export default function SignaturePad({ value, onChange }: Props) {
  const [mode, setMode] = useState<Mode>('draw')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const hasStrokes = useRef(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#111827'
    ctx.lineWidth = 2.2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [mode])

  function pointerPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  function startDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true
    hasStrokes.current = true
    const ctx = canvasRef.current!.getContext('2d')!
    const { x, y } = pointerPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function moveDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return
    const ctx = canvasRef.current!.getContext('2d')!
    const { x, y } = pointerPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  function endDraw() {
    drawing.current = false
  }

  function clearCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    hasStrokes.current = false
  }

  function useDrawing() {
    const canvas = canvasRef.current
    if (!canvas || !hasStrokes.current) return
    onChange(canvas.toDataURL('image/png'))
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image file (PNG, JPG, etc).')
      return
    }
    try {
      const dataUrl = await fileToResizedDataUrl(file)
      onChange(dataUrl)
      setUploadError(null)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Could not load image.')
    }
  }

  return (
    <div>
      <label className="field-label">Signature</label>

      {value && (
        <div className="mb-3 flex items-center gap-3">
          <img
            src={value}
            alt="Saved signature"
            className="h-16 border border-slate-300 rounded bg-white px-2"
          />
          <button type="button" className="btn-danger" onClick={() => onChange('')}>
            Remove Signature
          </button>
        </div>
      )}

      <div className="flex gap-1 mb-2" role="tablist" aria-label="Signature input mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'draw'}
          className={
            'px-3 py-1.5 text-sm rounded-md border ' +
            (mode === 'draw' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300')
          }
          onClick={() => setMode('draw')}
        >
          Draw
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'upload'}
          className={
            'px-3 py-1.5 text-sm rounded-md border ' +
            (mode === 'upload' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300')
          }
          onClick={() => setMode('upload')}
        >
          Upload
        </button>
      </div>

      {mode === 'draw' ? (
        <div>
          <canvas
            ref={canvasRef}
            width={MAX_W}
            height={MAX_H}
            className="border border-slate-300 rounded-md bg-white touch-none w-full max-w-[500px]"
            style={{ height: '160px' }}
            onPointerDown={startDraw}
            onPointerMove={moveDraw}
            onPointerUp={endDraw}
            onPointerLeave={endDraw}
            aria-label="Draw your signature here"
            role="img"
          />
          <div className="flex gap-2 mt-2">
            <button type="button" className="btn-secondary" onClick={clearCanvas}>
              Clear
            </button>
            <button type="button" className="btn-primary" onClick={useDrawing}>
              Use This Signature
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">Draw with your mouse, stylus, or finger, then click "Use This Signature".</p>
        </div>
      ) : (
        <div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="field-input"
          />
          <p className="text-xs text-slate-500 mt-1">
            PNG or JPG works best. A transparent-background PNG looks cleanest on the invoice.
          </p>
          {uploadError && <p className="field-error">{uploadError}</p>}
        </div>
      )}
    </div>
  )
}
