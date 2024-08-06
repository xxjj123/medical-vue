import { loadEnv } from 'vite';
import viteCommonConfig from '../../viteCommonConfig';
import path from 'path';
import chalk from 'chalk';

let viteAppEnv: Record<string, string>;
let currentMode: string;

/**
 * 初始化viteAppEnv
 * @param mode
 */
export async function initEnv(mode: string) {
  viteAppEnv = loadEnv(
    mode === 'optimize' ? 'development' : mode,
    path.resolve(process.cwd(), './.env'),
    '',
  );
  currentMode = mode;
}

/**
 * 获取指定名称的env
 * @param key
 * @returns
 */
export function getEnv(key: string): string {
  if (key === undefined) {
    error(chalk.bgRed('在获取env时,必须传入env的名字!'));
    return undefined;
  }
  const env = viteAppEnv[key];
  if (env === undefined) {
    if (key !== 'RUN_ENV') {
      warn(
        `在\`${chalk.blueBright(`.env.${currentMode}`)}\`文件中没有找到环境变量:${chalk.blue(
          key,
        )}! 这个警告一般情况下可以忽略!`,
      );
    }
  }
  return env;
}

/**
 * 判断一个env是否是true
 * @param key
 * @returns
 */
export function isEnvTrue(key: string): boolean {
  return getEnv(key)?.toUpperCase() === 'TRUE';
}

export function getOpen() {
  // 配置启动默认的页面
  let open: boolean | string = false;
  if (viteCommonConfig.open) {
    open = `${getEnv('VITE_PUBLIC_PATH')}/${viteCommonConfig.open}`.replaceAll(/\/\//g, '/');
  }
  return open;
}

export function log(msg: string) {
  // eslint-disable-next-line no-console
  console.log(msg);
}

export function warn(msg: string) {
  // eslint-disable-next-line no-console
  console.warn(msg);
}

export function error(msg: string) {
  // eslint-disable-next-line no-console
  console.error(msg);
}
