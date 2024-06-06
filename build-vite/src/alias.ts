import viteCommonConfig from '../../viteCommonConfig';

const { alias } = viteCommonConfig;

export function buildAlias(mode: string) {
  const rAlias = {
    ...alias.base,
    ...alias[mode],
  };
  return Object.keys(rAlias).map((key) => {
    const v = rAlias[key];
    if (v.replacement) {
      return v;
    } else {
      return {
        find: key,
        replacement: v,
      };
    }
  });
}
