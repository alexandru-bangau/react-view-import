import { useCallback, useRef, type ReactElement, type RefCallback } from 'react'

interface InViewRenderProps {
  ref: RefCallback<HTMLDivElement>
}

interface InViewProps {
  children: (props: InViewRenderProps) => ReactElement
  rootMargin: string
  threshold: number
  triggerOnce?: boolean
  onChange: (inView: boolean) => void
}

export const InView = ({
  children,
  rootMargin,
  threshold,
  triggerOnce,
  onChange,
}: InViewProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const ref = useCallback<RefCallback<HTMLDivElement>>(
    (element) => {
      observerRef.current?.disconnect()
      observerRef.current = null

      if (!element) return

      if (typeof IntersectionObserver === 'undefined') {
        throw new Error('IntersectionObserver is not available in this environment')
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          const inView = entry.isIntersecting && entry.intersectionRatio >= threshold

          if (inView && triggerOnce) {
            observer.disconnect()
            observerRef.current = null
          }

          onChangeRef.current(inView)
        },
        { rootMargin, threshold },
      )

      observer.observe(element)
      observerRef.current = observer
    },
    [rootMargin, threshold, triggerOnce],
  )

  return children({ ref })
}
