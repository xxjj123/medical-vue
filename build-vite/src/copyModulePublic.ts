import glob from 'fast-glob';

export function copyModulePublic() {
  return glob
    .sync([`${glob.convertPathToPattern(process.cwd())}/node_modules/@yh/*/public/**`])
    .map((file) => {
      return {
        from: file,
        to: '',
      };
    });
}
