import { useState } from 'react'
import { createLoadMap } from './createLoadMap'
import { InView } from './InView'
import { mergeRefs } from './mergeRefs'
import { selectComponent } from './selectComponent'
import {
  LazyLoadState,
  type LazyComponent,
  type LazyComponentProps,
  type UILazyInViewProps,
} from './types'

export const UILazyInView = <T extends LazyComponentProps, TModule>({
  importer,
  componentProps,
  threshold = 0.5,
  placeholder = null,
  loadOnMount,
  loadOnCondition,
  forwardRef,
  onInView,
  rootMargin = '1000px 0px',
  loadState = LazyLoadState.DEFAULT,
  ...componentSelection
}: UILazyInViewProps<T, TModule>) => {
  const [Comp, setComp] = useState<LazyComponent<T> | null>(null)

  return (
    <InView
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
          importer().then((module) => {
            setComp(() => selectComponent(module, componentSelection))
          })
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
