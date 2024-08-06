// 在这里import需要的依赖,用于提前优化
// 注意1: 此处只需要import相应的依赖,而不需要做其他的操作
// 注意2: 只有在控制台出现类似`new dependencies found`之类的输出时,才需要将输出的依赖放到此处引入
// 注意3: 优化是在install时期完成,用于节省首次启动时的时间
// 例如: import '@yh/ta404-ui'
import '@yh/ta404-ui/es/store';
import 'vue-bus';
import 'vue-router/dist/vue-router.esm';
import '@yh/ta404-ui/es/driver';
import '@yh/ta404-ui/es/driver/style';
import '@vueuse/core';
import '@yh/ta404-ui/es/_dict';
import '@vue/babel-helper-vue-jsx-merge-props';
import '@yh/ta-utils/uuidV4';
import 'vue-grid-layout';
import 'echarts/core';
import 'echarts/charts';
import 'echarts/components';
import 'echarts/features';
import 'echarts/renderers';
import 'moment/src/moment';
import '@yh/ta404-ui/es/utils/js/downloadFile';
import '@yh/ta404-ui/es/utils/js/cryptoFn';
import '@yh/ta404-ui/es/table/index';
import '@yh/ta404-ui/es/table/style';
import '@yh/icons-svg/lib/dist';
import '@yh/ta404-ui/es/utils/js/excel.util';
import '@yh/ta404-ui/es/_dict/collectionUtil';
import '@yh/ta-utils/crypto/sm/crypto/utils/hex';
import '@yh/ta-utils/validURL';
import '@yh/ta-utils/validIP';
import '@yh/ta-utils/validIPv4';
import '@yh/ta-utils/validIPv6';
import '@yh/ta404-ui/es/descriptions/style';
