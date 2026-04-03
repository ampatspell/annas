import { proxyRefs, type Component, type Ref } from 'vue'
import type { ComponentProps } from 'vue-component-type-helpers'

export type MaybeRefs<T> = {
  [K in keyof T]: T[K] | Ref<T[K]>
}

export const defineComponentWithProps = <
  C extends Component = Component,
  P extends MaybeRefs<ComponentProps<C>> = MaybeRefs<ComponentProps<C>>,
>(
  component: C,
  props: P,
) => {
  return {
    component,
    props: proxyRefs(props),
  }
}

export type ComponentWithProps<
  C extends Component = Component,
  P extends MaybeRefs<ComponentProps<C>> = MaybeRefs<ComponentProps<C>>,
> = ReturnType<typeof defineComponentWithProps<C, P>>
