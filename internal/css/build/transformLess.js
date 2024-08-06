const less = require('less');
const { readFileSync } = require('fs');
const path = require('path');
const postcss = require('postcss');
const NpmImportPlugin = require('less-plugin-npm-import');
const postcssConfig = require('./postcssConfig');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, '../../../.env/.env.development'),
});

const themeVars = readFileSync(
  path.resolve(__dirname, `../../theme/preset-theme/${process.env.VITE_PRESET_THEME}.less`),
).toString();
// const PRIMARY_COLOR_REGEX = /@primary-color: (.*);/g
// const match = themeVars.matchAll(PRIMARY_COLOR_REGEX)
// const primaryColor = match.next().value[1]
const variables = {};
// TODO: 需要进一步处理这个读取less变量的方法
//   以处理注释及其他不合法的内容
themeVars.split('\n').forEach((tv) => {
  if (tv.trim().length <= 0) {
    return;
  }
  const [k, v] = tv.trim().split(':');
  if (k.trim().indexOf('@') !== 0) {
    return;
  }
  if (k.trim().indexOf('/') === 0 || k.trim().indexOf('*') === 0) {
    return;
  }
  variables[k.trim().replace('@', '')] = v.trim();
});

function transformLess(lessFile, config = {}) {
  const { cwd = process.cwd() } = config;
  const resolvedLessFile = path.resolve(cwd, lessFile);

  let data = readFileSync(resolvedLessFile, 'utf-8');
  data = data.replace(/^\uFEFF/, '');

  // Do less compile
  const lessOpts = {
    paths: [path.dirname(resolvedLessFile)],
    filename: resolvedLessFile,
    plugins: [new NpmImportPlugin({ prefix: '~' })],
    javascriptEnabled: true,
    modifyVars: {
      'public-path':
        process.env.VUE_APP_PUBLIC_PATH !== undefined ? process.env.VUE_APP_PUBLIC_PATH : '/',
      ...variables,
    },
    math: 'always',
  };
  return less
    .render(data, lessOpts)
    .then((result) => {
      const source = result.css;
      return postcss(postcssConfig.plugins).process(source, { from: undefined });
    })
    .then((r) => {
      return r.css;
    });
}

module.exports = transformLess;
