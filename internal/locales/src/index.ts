import Vue from 'vue';
import VueI18n, { type LocaleMessages } from 'vue-i18n';
import { createWebStorage, merge } from '@yh/ta-utils';

Vue.use(VueI18n);

export interface PageLocale {
  default: Record<string, unknown>;
  uiLocale: Record<string, unknown>;
  overrideUiLocales: Record<string, unknown>;
}

export type DynamicImportPageLocale = Record<string, () => Promise<PageLocale> | PageLocale>;

/**
 * 将glob出来的对象的key变更为仅包含语言类型的key,例如
 * ./zh_CN.js => zh_CN
 * @param old
 */
// eslint-disable-next-line no-unused-vars
export function makeNewEntries<T>(old: T | undefined): T | Record<string, never> {
  if (!old || Object.keys(old).length === 0) {
    return {};
  }
  const entries = Object.entries(old).map((entry) => {
    const [key, value] = entry;
    let newKey;
    if (key.endsWith('.js')) {
      newKey = key.substring(key.lastIndexOf('/') + 1, key.indexOf('.js'));
    } else if (key.endsWith('.mjs')) {
      newKey = key.substring(key.lastIndexOf('/') + 1, key.indexOf('.mjs'));
    } else if (key.endsWith('.ts')) {
      newKey = key.substring(key.lastIndexOf('/') + 1, key.indexOf('.ts'));
    } else if (key.endsWith('.json')) {
      newKey = key.substring(key.lastIndexOf('/') + 1, key.indexOf('.json'));
    } else {
      throw new Error(
        `当前语言文件类型不受支持,文件为:${key}.\n语言文件的类型仅支持js/ts/json格式`,
      );
    }
    return [newKey, value];
  });
  return Object.fromEntries(entries);
}

// 加载来自@yh/ta404-ui的locale
// # START
// 在入口文件中没有指定引入哪些组件的locale的时候
// 引入ui的全部的locale,避免异常
// 这个glob应该是eager的
// 如果要引入多个语言文件,那么需要将语言文件用()包起来
// 例如: (zh_CN|en_US).js
const uiLocalesGlob = import.meta.glob<{ default: Record<string, string> }>('../dist/*.mjs', {
  eager: true,
});
export const uiLocales = makeNewEntries<typeof uiLocalesGlob>(uiLocalesGlob);

// # END

// 页面之间通用的语言文件
const commonLocalesGlob = import.meta.glob<{ default: Record<string, string> }>('./common/*.json');
const commonLocales = makeNewEntries<typeof commonLocalesGlob>(commonLocalesGlob);

// 由于是懒加载语言文件,所以,需要在这里将当前页面的locale语言定义文件进行缓存
export let cachedPageLocales: DynamicImportPageLocale | undefined;

/**
 * 加载locale文件
 * @param pageLocale
 * @param localeName
 */
export async function loadLocaleMessages(
  pageLocale: DynamicImportPageLocale | undefined,
  localeName: string,
): Promise<LocaleMessages> {
  let localeFromPage;
  let localeFromUI;
  let overrideUILocales;
  if (pageLocale !== undefined && Object.keys(pageLocale).length > 0) {
    const pageLocaleModule = await pageLocale[localeName]();
    localeFromPage = pageLocaleModule.default;
    localeFromUI = pageLocaleModule.uiLocale;
    overrideUILocales = pageLocaleModule.overrideUiLocales;
  }
  const messages = {};
  // 加载自定义的来自@yh/ta404-ui的locale
  if (Object.keys(localeFromUI ?? {}).length > 0) {
    merge(messages, {
      [localeName]: localeFromUI,
    });
  } else {
    const localeFromUI = uiLocales?.[localeName]?.default ?? {};
    merge(messages, {
      [localeName]: localeFromUI,
    });
  }
  // 需要覆盖ui本身的locale,这会覆盖(部分)上一步已存在的locale
  if (overrideUILocales) {
    merge(messages, {
      [localeName]: {
        ...overrideUILocales,
      },
    });
  }
  // 加载模块间公用的locale,这会覆盖上一步已存在的locale
  const localePageCommon = (await commonLocales?.[localeName]())?.default ?? {};
  merge(messages, {
    [localeName]: localePageCommon,
  });
  // 加载来自模块的locale,这会覆盖上一步已存在的locale
  if (localeFromPage) {
    merge(messages, {
      [localeName]: localeFromPage,
    });
  }
  return messages;
}

/**
 * 生成i18n变量,用于在Vue构造器中传入
 * 初始化页面后,仅加载当前配置/默认的locale对应的locale文件
 * @param locales
 */
export const makeI18n = async (locales: DynamicImportPageLocale = {}) => {
  cachedPageLocales = locales;
  const localeStorage = createWebStorage(import.meta.env.VITE_LOCALE_STORAGE_KEY, {
    isLocal: true,
  });
  let localeName;
  if (localeStorage) {
    localeName = localeStorage.get('locale') || import.meta.env.VITE_I18N_LOCALE;
  } else {
    localeName = import.meta.env.VITE_I18N_FALLBACK_LOCALE;
  }
  const newLocales = makeNewEntries(cachedPageLocales);
  const messages = await loadLocaleMessages(newLocales, localeName);
  return new VueI18n({
    locale: localeName,
    fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE,
    messages,
    silentTranslationWarn: true,
  });
};
