import { type ConfigEnv, defineConfig } from 'vite';
import { buildViteConfig } from './build-vite/buildVite';

export default defineConfig(async (env: ConfigEnv & { ignoreHtmlPlugin: boolean }) => {
  return buildViteConfig(env);
});
