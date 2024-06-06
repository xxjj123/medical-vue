import { getCurrentInstance } from 'vue';

export function getThis() {
  return getCurrentInstance()?.proxy;
}

export function get$i18n() {
  return getCurrentInstance()?.proxy.$i18n;
}
