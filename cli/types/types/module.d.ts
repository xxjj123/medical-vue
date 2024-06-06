declare module '@vue/runtime-dom' {
  export interface GlobalComponents {
    RouterLink: (typeof import('vue-router'))['RouterLink'];
    RouterView: (typeof import('vue-router'))['RouterView'];
  }
}
