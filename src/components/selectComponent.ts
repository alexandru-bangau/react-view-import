import type { ComponentSelection, LazyComponent, LazyComponentProps } from './types'

export const selectComponent = <T extends LazyComponentProps, TModule>(
  module: TModule,
  selection: ComponentSelection<T, TModule>,
): LazyComponent<T> => {
  if (selection.select) return selection.select(module)

  return (module as Record<string, LazyComponent<T>>)[selection.exportName]
}