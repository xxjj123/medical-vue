import { createWebStorage } from '@yh/ta-utils';
import { tryOnBeforeUnmount, useEventBus } from '@vueuse/core';
import { loadLocaleMessages, makeNewEntries, cachedPageLocales, uiLocales } from '.';
import { defineComponent, onBeforeMount, ref, getCurrentInstance } from 'vue';
import type { LocaleMessageObject } from 'vue-i18n';

export function getThis() {
  return getCurrentInstance()?.proxy;
}

export function get$i18n() {
  return getCurrentInstance()?.proxy.$i18n;
}

/**
 * i18n的混入
 * @param isIndex 是否是index页面,即是否和userMenu.vue(自己写的国际化切换组件同理)是同一个页面
 */
export function i18nMixins(isIndex = false) {
  return defineComponent({
    setup() {
      const uiLocale = ref<LocaleMessageObject>({});
      const $i18n = get$i18n();
      // 获取当前的this对象,并缓存到pageVmObj上
      window.pageVmObj = {
        $t: getThis()?.$t,
        _i18n: getThis()?.$i18n,
        _route: getThis()?.$route,
      };
      // 设置ui的默认locale
      // 避免ui组件渲染的时候报错
      const setupDefaultUILocale = (locale: string) => {
        uiLocale.value = uiLocales?.[locale].default ?? {};
      };

      const localeChangeBus = useEventBus('locale-change');
      const indexLocaleChangeBus = useEventBus('custom-locale-change');

      if (isIndex) {
        indexLocaleChangeBus.on((event, payload) => {
          const { locale } = payload;
          switchLocale(locale);
        });
      }

      // 切换locale的方法
      const switchLocale = (locale: string) => {
        if (Object.keys(uiLocale.value).length === 0) {
          setupDefaultUILocale(locale);
        }
        if (!$i18n) {
          setupDefaultUILocale(locale);
          return;
        }
        // 动态加载需要切换的locale文件
        const newLocales = makeNewEntries(cachedPageLocales);
        loadLocaleMessages(newLocales, locale).then((messages) => {
          $i18n.mergeLocaleMessage(locale, messages[locale]);
          $i18n.locale = locale;
          // 通知routes-container进行locale变更
          localeChangeBus.emit('locale-change', messages[locale]);
          uiLocale.value = messages[locale];
        });
      };

      let storageCallback: (_e: StorageEvent) => void;

      onBeforeMount(() => {
        const localeStorage = createWebStorage(import.meta.env.VITE_LOCALE_STORAGE_KEY, {
          isLocal: true,
        });
        if (!localeStorage) {
          return;
        }

        const _switchLocale = () => {
          const lc = localeStorage.get('locale');
          if (lc !== false && lc !== null) {
            switchLocale(lc);
          } else {
            switchLocale(import.meta.env.VITE_DEFAULT_LOCALE);
          }
        };
        // 监听local-storage的storage事件
        storageCallback = (e: StorageEvent) => {
          if (e.key === import.meta.env.VITE_LOCALE_STORAGE_KEY) {
            _switchLocale();
          }
        };
        window.addEventListener('storage', storageCallback);
        // 设置初始化时默认的locale
        _switchLocale();
      });

      tryOnBeforeUnmount(() => {
        indexLocaleChangeBus.reset();
        localeChangeBus.reset();
        window.removeEventListener('storage', storageCallback);
      });

      return {
        uiLocale,
      };
    },
  });
}
