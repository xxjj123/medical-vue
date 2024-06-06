import routesContainer from '@common/components/routesContainer.vue';

// 模块part 声明导入
import modulePart2 from '../modulePart/modulePart2/routes';

const innerRoutes = [...modulePart2];
// 导入路由声明
export default [
  {
    path: '/',
    component: routesContainer,
    children: innerRoutes.map((item) => ({
      ...item,
    })),
  },
];
