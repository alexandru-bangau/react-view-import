import type { ComponentType, ReactNode, Ref } from 'react'

export type LazyComponentProps = Record<string, any>
export type LazyComponent<T extends LazyComponentProps> = ComponentType<T>

export enum LazyLoadState {
  DEFAULT = 'DEFAULT',
  LOADED_ON_MOUNT = 'LOADED_ON_MOUNT',
  LAZY_ON_CONDITION = 'LAZY_ON_CONDITION',
}

interface UILazyInViewBaseProps<T extends LazyComponentProps, TModule> {
  importer: () => Promise<TModule>
  componentProps: T
  threshold?: number
  placeholder?: ReactNode
  loadOnMount?: boolean
  loadOnCondition?: boolean
  forwardRef?: Ref<HTMLDivElement>
  onInView?: () => void
  rootMargin?: string
  loadState?: LazyLoadState
}

type ComponentSelector<T extends LazyComponentProps, TModule> = {
  select: (module: TModule) => LazyComponent<T>
  exportName?: never
}

type ComponentExportName = {
  select?: never
  exportName: string
}

export type ComponentSelection<T extends LazyComponentProps, TModule> =
  | ComponentSelector<T, TModule>
  | ComponentExportName

export type UILazyInViewProps<T extends LazyComponentProps, TModule> =
  UILazyInViewBaseProps<T, TModule> & ComponentSelection<T, TModule>
