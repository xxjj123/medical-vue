import { type ComponentResolver, kebabCase } from 'unplugin-vue-components';
import { mergeConfig } from 'vite';
import cliOverride from '../../../viteCommonConfig';

import { readFileSync } from 'node:fs';
import glob from 'fast-glob';
import { error } from '../utils';

const modulePages = {};

glob
  .sync([`${glob.convertPathToPattern(process.cwd())}/node_modules/@yh/**/pages.json`])
  .forEach((file) => {
    const content = readFileSync(file).toString();
    try {
      const jsonContent = JSON.parse(content);
      Object.assign(modulePages, jsonContent);
    } catch (e) {
      const filePath = file.replace(process.cwd(), '');
      error(`JSON文件转换时出现错误!\n请检查文件: '${filePath}'`);
      throw e;
    }
  });

const OVERRIDE_PAGES_COMPONENTS = mergeConfig(modulePages, cliOverride.cli.override);

/**
 * 这个插件用于解析html标签并将符合规则(规则配置在OVERRIDE_PAGES_COMPONENTS中)的标签对应的组件返回
 * 最终渲染的组件为这个方法返回的组件
 * 如果返回为undefined,则不进行任何处理
 */
export default (): ComponentResolver => {
  return {
    type: 'component',
    resolve(name) {
      const kbName = kebabCase(name);
      if (OVERRIDE_PAGES_COMPONENTS[kbName]) {
        return {
          from: OVERRIDE_PAGES_COMPONENTS[kbName],
        };
      }
      const paths = kbName.replace(/_/g, '/').split('/');
      if (!OVERRIDE_PAGES_COMPONENTS[paths[0]]) {
        return;
      }
      const pageResult = paths.reduce((pv, cv) => {
        if (pv === undefined || !pv) {
          return undefined;
        }
        if (cv in pv) {
          return pv[cv];
        }
        return undefined;
      }, OVERRIDE_PAGES_COMPONENTS);
      if (pageResult === undefined) {
        return;
      }
      return {
        from: pageResult,
      };
    },
  };
};
