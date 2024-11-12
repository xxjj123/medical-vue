
let __unconfig_data;
let __unconfig_stub = function (data = {}) { __unconfig_data = data };
__unconfig_stub.default = (data = {}) => { __unconfig_data = data };
import { type ConfigEnv, defineConfig } from 'vite';
import { buildViteConfig } from './build-vite/buildVite';

const __unconfig_default =  defineConfig(async (env: ConfigEnv & { ignoreHtmlPlugin: boolean }) => {
  return buildViteConfig(env);
});

if (typeof __unconfig_default === "function") __unconfig_default(...[{"command":"serve","mode":"development"}]);export default __unconfig_data;