import { useState } from 'react'
import { InView } from 'react-intersection-observer'
import { createLoadMap } from './createLoadMap'
import { mergeRefs } from './mergeRefs'
import { LazyLoadState } from './types'

interface UILazyInViewProps<T extends Record<string, any>> {
  importer: () => Promise<{ [key: string]: React.ComponentType<T> }>
  exportName: string
  componentProps: T
  threshold?: number
  placeholder?: React.ReactNode
  loadOnMount?: boolean
  loadOnCondition?: boolean
  forwardRef?: React.Ref<HTMLDivElement>
  onInView?: () => void
  rootMargin?: string
  loadState?: LazyLoadState
}

export const UILazyInView = <T extends Record<string, any>>({
  importer,
  exportName,
  componentProps,
  threshold = 0.5,
  placeholder = null,
  loadOnMount,
  loadOnCondition,
  forwardRef,
  onInView,
  rootMargin = '1000px 0px',
  loadState = LazyLoadState.DEFAULT,
}: UILazyInViewProps<T>) => {
  const [Comp, setComp] = useState<React.ComponentType<T> | null>(null)

  return (
    <InView
      as="div"
      rootMargin={rootMargin}
      triggerOnce
      threshold={threshold}
      onChange={(inView) => {
        const loadMap = createLoadMap({
          loadByDefault: inView && !Comp,
          loadOnMount,
          loadOnCondition,
        })

        const shouldLoad = loadMap[loadState]
        if (shouldLoad) {
          importer().then((mod) => setComp(() => mod[exportName]))
        }

        if (inView && onInView) {
          onInView()
        }
      }}
    >
      {({ ref }) => (
        <div ref={mergeRefs([ref, forwardRef])}>
          {!Comp && placeholder}
          {Comp && <Comp {...componentProps} />}
        </div>
      )}
    </InView>
  )
}
