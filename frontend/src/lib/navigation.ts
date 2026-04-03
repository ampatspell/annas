import { computed, inject, shallowRef, type InjectionKey, type Plugin } from "vue";
import type { ComponentWithProps } from "./component";

export type NavigationOptions = { initial: ComponentWithProps };

const createNavigation = (opts: NavigationOptions) => {
  const page = shallowRef<ComponentWithProps | undefined>(opts.initial);

  const transitionTo = (target: ComponentWithProps | undefined) => {
    page.value = target;
  };

  return {
    page: computed(() => page.value),
    transitionTo,
  };
};

export type UsedNavigation = ReturnType<typeof createNavigation>;

const key: InjectionKey<UsedNavigation> = Symbol("navigation");

export const createNavigationPlugin = (opts: NavigationOptions) => {
  const plugin: Plugin = (app) => {
    app.provide(key, createNavigation(opts));
  };
  return plugin;
};

export const useNavigation = () => {
  return inject(key)!;
};
