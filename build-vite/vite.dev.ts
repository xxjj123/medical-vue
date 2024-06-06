import type { UserConfig } from 'vite';
import { buildBaseConfig } from './vite.base';
import { buildProxy, buildProxyForHTTP2 } from './src/proxy';
import { error, getOpen, isEnvTrue, warn } from './src/utils';
import { getOptimizeConfig } from './vite.optimize';
import { getAllPages } from './mpa/pages';

export async function buildDevConfig(mode: string): Promise<UserConfig> {
  const config: UserConfig = await buildBaseConfig(mode);

  config.server = {
    // 指定服务器应该监听哪个 IP 地址。 如果将此设置为 0.0.0.0 将监听所有地址，包括局域网和公网地址。
    // true就是localhost+你本地所有网卡的ip
    host: false,
    // 为开发服务器配置自定义代理规则。
    proxy: buildProxy(),
    // 开发时浏览器默认打开的路径
    open: getOpen(),
    // 传递给 chokidar 的文件系统监听器选项。
    watch: {
      useFsEvents: false,
      // 如果在启动时遇到反复重启dev-server的问题,则放开下面的注释
      // ignored: [
      //   '**/viteCommonConfig.ts',
      //   '**/multipleService.config.ts',
      //   '**/vite.config.ts',
      //   '**/.env.*',
      //   '**/build-vite/**/*.ts',
      //   '**/.idea/**',
      //   '**/.vscode/**'
      // ],
    },
  };
  // 配置预编译内容
  config.optimizeDeps = await getOptimizeConfig(mode);
  if (isEnvTrue('USE_HTTP2')) {
    buildProxyForHTTP2(config);
  }
  // 生成需要warmup的页面
  const htmlEntry = await getAllPages();
  const warmupHtml: string[] = Object.keys(htmlEntry)
    .map((k) => {
      const v = htmlEntry[k];
      if (v.constructor !== String) {
        return null;
      }
      // 路径必须以.开头
      return `.${v as string}`;
    })
    .filter((v) => v !== null);
  config.server.warmup = {
    clientFiles: [...warmupHtml],
  };
  // config.optimizeDeps.holdUntilCrawlEnd = true;
  return config;
}

// 启动仪式
export function init() {
  error(
    [
      '888888  db          dP88   dPYb     dP88',
      '  88   dPYb        dP 88  dP   Yb  dP 88',
      '  88  dP__Yb      d888888 Yb   dP d888888',
      '  88 dP    Yb         88   YbodP      88',
    ].join('\n'),
  );
  warn(
    [
      '',
      '                   _ooOoo_',
      '                  o8888888o',
      '                  88" . "88',
      '                  (| -_- |)',
      '                  O\\  =  /O',
      "               ____/`---'\\____",
      "             .'  \\\\|     |//  `.",
      '            /  \\\\|||  :  |||//  \\',
      '           /  _||||| 卍 |||||-  \\',
      '           |   | \\\\\\  -  /// |   |',
      "           | \\_|  ''\\---/''  |   |",
      '           \\  .-\\__  `-`  ___/-. /',
      "         ___`. .'  /--.--\\  `. . __",
      '      ."" \'<  `.___\\_<|>_/___.\'  >\'"".',
      '     | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |',
      '     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /',
      "======`-.____`-.___\\_____/___.-`____.-'======",
      "                   `=---='",
      '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
      '         佛祖保佑       永无BUG',
    ].join('\n'),
  );
}
