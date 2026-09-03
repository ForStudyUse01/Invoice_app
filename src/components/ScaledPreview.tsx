import { useEffect, useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
}

// The invoice preview inside has a fixed A4 width (210mm). On narrow
// screens we scale it down to fit the container instead of forcing
// horizontal scroll, so the whole bill stays readable at a glance.
export default function ScaledPreview({ children }: Props) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [naturalHeight, setNaturalHeight] = useState(0)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    function recalc() {
      if (!outer || !inner) return
      const containerWidth = outer.clientWidth
      const contentWidth = inner.scrollWidth
      const contentHeight = inner.scrollHeight
      if (contentWidth === 0) return
      const nextScale = Math.min(1, containerWidth / contentWidth)
      setScale(nextScale)
      setNaturalHeight(contentHeight)
    }

    recalc()
    const ro = new ResizeObserver(recalc)
    ro.observe(outer)
    ro.observe(inner)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={outerRef} className="w-full overflow-hidden">
      <div style={{ height: naturalHeight * scale || undefined }}>
        <div
          ref={innerRef}
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 'fit-content' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
