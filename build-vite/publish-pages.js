import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import { exec } from 'child_process';

import {
  removeNpmrc,
  removePkgJson,
  writeNpmrc,
  writePkgJson,
  __dirname,
} from './publish-utils/utils.js';

// const commonModule = path.resolve(__dirname, '../cli/common')
const pagesDir = path.resolve(__dirname, '../pages');
const pagesDirName = (await fsp.readdir(pagesDir)).filter((d) => {
  return d.indexOf('.') !== 0;
});
const pagesDirPath = pagesDirName.map((pd) => path.resolve(pagesDir, pd));

const needPublishModules = [
  // commonModule,
  ...pagesDirPath,
];
needPublishModules.forEach(async (pd) => {
  if (!fs.existsSync(pd)) {
    return;
  }
  await writeNpmrc(pd);
  await writePkgJson(pd);
  const cmd = 'pnpm publish';
  // 在publish之前需要在~/.npmrc配置_authToken
  exec(
    cmd,
    {
      cwd: pd,
    },
    async (error, _stdout, _stderr) => {
      if (!error) {
        // fs.rmSync(npmrc)
      } else {
        // eslint-disable-next-line no-console
        console.error(error);
      }
      await removeNpmrc(pd);
      await removePkgJson(pd);
    },
  );
});
