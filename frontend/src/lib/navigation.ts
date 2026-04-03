import { computed, inject, shallowRef, type InjectionKey, type Plugin } from 'vue';
import type { ComponentWithProps } from './component';

const createNavigation = () => {
  const page = shallowRef<ComponentWithProps>();

  const transitionTo = (target: ComponentWithProps | undefined) => {
    page.value = target;
  };

  return {
    page: computed(() => page.value),
    transitionTo,
  };
};

export type UsedNavigation = ReturnType<typeof createNavigation>;

const key: InjectionKey<UsedNavigation> = Symbol('navigation');

export const createNavigationPlugin = () => {
  const plugin: Plugin = (app) => {
    app.provide(key, createNavigation());
  };
  return plugin;
};

export const useNavigation = () => {
  return inject(key)!;
};
