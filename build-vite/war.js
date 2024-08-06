import { zip } from 'zip-a-folder';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { existsSync, rmSync } from 'node:fs';
import { config } from 'dotenv';

const _dirname = dirname(fileURLToPath(import.meta.url));

config({
  path: resolve(_dirname, '../.env/.env.production'),
});

const warPath = `./dist/${process.env.WAR_NAME}.war`;
if (existsSync(resolve(_dirname, '..', warPath))) {
  rmSync(resolve(_dirname, '..', warPath));
}

// noinspection JSIgnoredPromiseFromCall
zip(`./dist${process.env.VITE_PUBLIC_PATH}`, warPath);
