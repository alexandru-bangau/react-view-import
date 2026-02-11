import { MutableRefObject, Ref } from 'react'

type OptionalRef = Ref<any> | undefined
type RefUpdater = (instance: any | null) => void
type MergeRefsFunction = (refs: OptionalRef[]) => RefUpdater

export const mergeRefs: MergeRefsFunction = (refs) => {
  return (instance) => {
    refs.forEach((ref) => {
      if (!ref) return

      if (typeof ref === 'function') {
        ref(instance)
      } else {
        ;(ref as MutableRefObject<any | null>).current = instance
      }
    })
  }
}
