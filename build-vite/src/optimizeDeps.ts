import { getAllPages } from '../mpa/pages';

export async function optimizeEntriesBase(): Promise<Array<string>> {
  const pages = await getAllPages();
  return Object.values(pages).map((k) => (k as string).replace('/', ''));
}

/**
 * 将包含node_modules下的html模块的名称获取到并返回
 */
export async function optimizeLibs(): Promise<Array<string>> {
  return (await optimizeEntriesBase())
    .filter((k) => (k as string).indexOf('node_modules') >= 0)
    .map((lib) => {
      // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
      const [_i, scope, name] = lib.split('/');
      return `${scope}/${name}`;
    });
}

/**
 * 将不在node_modules下的html文件加入到entries中
 */
export async function optimizeEntries(): Promise<Array<string>> {
  return (await optimizeEntriesBase()).filter((k) => (k as string).indexOf('node_modules') < 0);
}
