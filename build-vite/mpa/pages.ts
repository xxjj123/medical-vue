import glob from 'fast-glob';
import { readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizePath } from 'vite';
import { POS } from 'vite-plugin-virtual-html';
import pageService from '../../multipleService.config';
import ViteCommonConfig from '../../viteCommonConfig';

const { html: htmlPages, cli } = ViteCommonConfig;
const { modules } = cli;

export const __dirname = resolve(dirname(fileURLToPath(import.meta.url)), '../../');

export const IGNORE_NODE_MODULES_HTML = '!/node_modules/**/node_modules/**/*.html';

export async function getInternalPages() {
  const yhModules = await readdir(resolve(__dirname, './node_modules/@yh/'));
  return yhModules
    .filter((m) => m.indexOf('cli-pages') >= 0)
    .map((m) => {
      return `/node_modules/@yh/${m}/**/*.html`;
    });
}

/**
 * 获取文件名称
 * @return {string} 文件名称
 * @param {string} html 一个html文件
 */
export function getHtmlName(html: string): string {
  return html.substring(html.lastIndexOf('/') + 1, html.length).split('.')[0];
}

export async function getAllPages() {
  // 获取/node_modules/@yh/cli-pages-**/**/*.html
  const internalPages = await getInternalPages();
  // 获取放在/src/project/下的html文件
  const modulePages = modules.map((m) => `/src/project/**/${m}.html`);
  const allPagesConfig = [].concat(internalPages).concat(modulePages).concat(htmlPages);
  allPagesConfig.push(IGNORE_NODE_MODULES_HTML);
  // 生成使用glob来获取的html文件
  const globPattern = allPagesConfig
    .map((html) => {
      try {
        if ('entry' in html) {
          return undefined;
        }
      } catch {
        // do nothing
      }
      // 将配置的路径处理成绝对路径
      if (html[0] === '!') {
        return `!${normalizePath(process.cwd())}${html.replace('!', '')}`;
      }
      return normalizePath(process.cwd() + html);
    })
    .filter((v) => v !== undefined);
  const pages = {};
  // 执行glob获取所有配置的html文件
  glob.sync(globPattern).forEach((g) => {
    pages[getHtmlName(g.replace(normalizePath(process.cwd()), ''))] = g.replace(
      normalizePath(process.cwd()),
      '',
    );
  });
  // 将allPagesConfig中的对象转换为vite-plugin-virtual-html可识别的配置
  allPagesConfig.forEach((html) => {
    try {
      if (!('entry' in html)) {
        return;
      }
    } catch {
      return;
    }
    pages[html.path] = html.entry;
  });
  return pages;
}

export async function getInjectCode() {
  const injectVariables = {};
  Object.keys(pageService.multipleServiceConfig).forEach((k) => {
    const v = pageService.multipleServiceConfig[k];
    if (Object.prototype.toString.call(v) === '[object Object]') {
      injectVariables[k] = {
        pos: POS.before,
        find: '</head>',
        ...(v as object),
      };
    } else {
      injectVariables[k] = {
        pos: POS.before,
        find: '</head>',
        replacement: v,
      };
    }
  });
  return injectVariables;
}
