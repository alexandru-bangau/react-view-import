import { LazyLoadState } from "./types"

interface ILazyInviewLoadMap {
  loadByDefault?: boolean
  loadOnMount?: boolean
  loadOnCondition?: boolean
}

export const createLoadMap = ({
  loadOnMount,
  loadByDefault,
  loadOnCondition,
}: ILazyInviewLoadMap) => ({
  [LazyLoadState.LOADED_ON_MOUNT]: !!loadOnMount,
  [LazyLoadState.DEFAULT]: !!loadByDefault,
  [LazyLoadState.LAZY_ON_CONDITION]: !!loadOnCondition,
})