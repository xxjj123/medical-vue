import { isEnvTrue } from './utils';

const useDemandImport = isEnvTrue('BUILD_DEMAND_UI_IMPORT');
export function manualChunks(id: string) {
  if (id.includes('faceConfig')) {
    return '1.chunk-faceConfig';
  }
  if (id.includes('styleCover.less')) {
    return '2_chunk-styleCover';
  }
  if (useDemandImport) {
    if (id.includes('node_modules/vue')) {
      return 'chunk-vuejs';
    }
    if (id.includes('node_modules/@yh/ta-utils')) {
      return 'chunk-ta-utils';
    }
    if (id.includes('node_modules/@yh/ta404-ui')) {
      return 'chunk-ta404-ui';
    }
  }
  // if (id.includes('@yh/ta-utils')) {
  //   return 'chunk-utils'
  // }
  // if (id.includes('@yh/ta404-ui')) {
  //   return 'chunk-ui'
  // }
  // if (id.includes('node_modules/moment')) {
  //   return 'vendor-moment'
  // }

  // if (id.includes('node_modules/@yh/ta-utils')) {
  //   return 'yh-utils-modules'
  // }

  // if (id.includes('node_modules/vuex')) {
  //   return 'vendor-vuex'
  // }

  // if (id.includes('node_modules/vue-router')) {
  //   return 'vendor-vue-router'
  // }

  // if (id.includes('node_modules/vue/')) {
  //   return 'vendor-vue'
  // }

  // if (id.includes('node_modules/@yh/icons-svg')) {
  //   return 'yh-other-modules'
  // }

  // if (id.includes('node_modules/@yh/ta404-ui/es/big-table')) {
  //   return 'yh-404-ui-big-table-modules'
  // }

  // if (id.includes('node_modules/@yh/ta404-ui')) {
  //   return 'yh-404-ui-modules'
  // }

  // if (id.includes('node_modules/less')) {
  //   return 'vendor-less'
  // }

  // if (id.includes('node_modules/crypto-js')) {
  //   return 'vendor-crypto-js'
  // }

  // if (id.includes('node_modules/wangeditor')) {
  //   return 'vendor-wang-editor'
  // }

  // if (id.includes('node_modules/jquery')) {
  //   return 'vendor-jquery'
  // }

  // if (id.includes('node_modules/interactjs')) {
  //   return 'vendor-interactjs'
  // }

  // if (id.includes('node_modules/jsrsasign')) {
  //   return 'vendor-jsrsasign'
  // }

  // if (id.includes('node_modules/plyr')) {
  //   return 'vendor-plyr'
  // }

  // if (id.includes('components/404-ui')) {
  //   return 'vendor-ta404-ui'
  // }

  // if (id.includes('node_modules')) {
  //   return 'vendor'
  // }
}
