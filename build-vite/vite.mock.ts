import type { UserConfig } from 'vite';
import { buildBaseConfig } from './vite.base';

export async function buildMockConfig(mode: string): Promise<UserConfig> {
  return await buildBaseConfig(mode);
}
