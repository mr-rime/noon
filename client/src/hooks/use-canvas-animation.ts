import { useEffect, useRef } from 'react'
import { animateElement } from '../utils/animateElement'

export function useCanvasAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>(null)
  const positionRef = useRef(0)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (overlayRef.current) {
      animateElement(overlayRef.current, [{ opacity: 0 }, { opacity: 0.5 }], {
        duration: 150,
      })
    }

    if (dialogRef.current) {
      animateElement(
        dialogRef.current,
        [
          { opacity: 0, transform: 'scale(0.95)' },
          { opacity: 1, transform: 'scale(1)' },
        ],
        { duration: 200 },
      )
    }

    const container = containerRef.current
    const canvas = canvasRef.current
    const image = imageRef.current

    if (!container || !canvas || !image) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = container.offsetWidth
    canvas.height = container.offsetHeight

    const animate = () => {
      if (!image.complete) {
        requestRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const imgRatio = image.naturalHeight / image.naturalWidth
      const renderWidth = canvas.height / imgRatio

      const firstImgPos = positionRef.current % renderWidth
      ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, firstImgPos, 0, renderWidth, canvas.height)

      const secondImgPos = firstImgPos - renderWidth
      ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, secondImgPos, 0, renderWidth, canvas.height)

      positionRef.current += 0.5 // speed
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  return {
    containerRef,
    imageRef,
    canvasRef,
    dialogRef,
    overlayRef,
  }
}
