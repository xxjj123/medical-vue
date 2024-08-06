import type { Plugin } from 'vite';
import { readFile } from 'node:fs/promises';

export interface FileReplaceOptions {
  file: string;
  newFile: string;
}
export default (opts: Array<FileReplaceOptions>): Plugin => {
  return {
    name: '@yh/vite-plugin-file-replacer',
    async load(id, options) {
      const filterOpt = opts.filter((opt) => {
        return id.indexOf(opt.file) >= 0;
      });
      if (filterOpt.length <= 0) {
        return null;
      }
      const { newFile } = filterOpt[0];
      return (await readFile(newFile)).toString();
    },
  };
};
