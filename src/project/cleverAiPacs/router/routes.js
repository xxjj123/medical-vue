import adminPageLayout from "@common/components/adminPageLayout.vue";

// 模块part 声明导入
import modulePart2 from "../modulePart/modulePart2/routes";
//登录后首页-管理列表
import manage from "../modulePart/manage/routes";
//诊断分析-控制台
import diagnose from "../modulePart/diagnose/routes";

import picdiagnose from "../modulePart/picdiagnose/routes";


const innerRoutes = [...modulePart2, ...manage, ...diagnose,...picdiagnose];
// 导入路由声明
export default [
  {
    path: "/",
    component: adminPageLayout,
    children: innerRoutes.map((item) => ({
      ...item,
    })),
  },
];
