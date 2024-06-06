import { toggleTheme } from '@zougt/vite-plugin-theme-preprocessor/dist/browser-utils';
import { createWebStorage } from '@yh/ta-utils';
import { elderlyEventBus } from 'virtual:elderly';

let themeStorage: ReturnType<typeof createWebStorage>;

let globTheme: Record<string, unknown>;

let msv: Array<{ scopeName: string; varsContent: unknown }>;

async function initThemeData() {
  globTheme = import.meta.glob('/node_modules/@yh/cli-internal-dynamic-theme/preset-theme/*.less', {
    query: 'raw',
  });
  // @ts-expect-error v的类型为: ()=>import('')
  const allThemePromiseResult = await Promise.allSettled(Object.values(globTheme).map((v) => v()));
  // @ts-expect-error v.value是存在的
  const allTheme = allThemePromiseResult.map((v) => v.value.default);
  const allKey = Object.keys(globTheme);
  msv = allTheme.map((theme, index) => {
    const v = theme;
    const ks = allKey[index].split('/');
    const themeName = ks[ks.length - 1].replace('.less', '');
    return {
      scopeName: `theme-${themeName}`,
      varsContent: v,
    };
  });
  // 初始化 storage
  themeStorage = createWebStorage(import.meta.env.VITE_THEME_STORAGE_KEY, { isLocal: true });
  /**
   * 监听localStorage的storage事件
   * 用于iframe页面的动态换肤
   */
  window.addEventListener(
    'storage',
    function (e) {
      // 获取被修改的键值
      if (e.key === import.meta.env.VITE_THEME_STORAGE_KEY) {
        if (themeStorage) {
          const indexTheme = themeStorage.get(import.meta.env.VITE_THEME_STORAGE_KEY);
          if (indexTheme) {
            initTheme(indexTheme as string);
          } else {
            initTheme();
          }
        }
      }
    },
    false,
  );
}
/**
 * 设置预设的主题
 * @param theme
 */
export async function initTheme(theme?: string) {
  if (import.meta.env.VITE_ONLINE_THEME_ENABLED.toUpperCase() !== 'TRUE') {
    return;
  }
  return initThemeData().then(() => {
    let rTheme = theme;
    if (!theme && themeStorage) {
      const storeTheme = themeStorage.get(import.meta.env.VITE_THEME_STORAGE_KEY);
      if (storeTheme) {
        rTheme = storeTheme as string;
      } else {
        rTheme = import.meta.env.VITE_PRESET_THEME;
      }
    }
    if (rTheme === 'elderly-oriented') {
      elderlyEventBus.emit({
        size: 'large',
      });
    } else {
      elderlyEventBus.emit({
        size: 'default',
      });
    }
    toggleTheme({
      scopeName: `theme-${rTheme}`,
      multipleScopeVars: msv,
    });
  });
}

/**
 * 切换悼念模式
 * @param colorWeak
 */
export function updateColorWeak(colorWeak: boolean = false) {
  const app = document.body;
  colorWeak ? app.classList.add('colorWeak') : app.classList.remove('colorWeak');
}
