/**
 * toolBar 图像工具条控制权
 * description：
 * 1、通用工具
 * 2、专业部位的医学工具
 * 3、事件状态流转
 * 4、初始化状态
 * 5、单张成像组件-小工具-状态共用
 * 6、布局控制
 */
import Vue from 'vue';


export default {
  namespaced: true,
  state: {
    slice_CT_pic_layout: "lggjst" //ct-三视图+3d,容器布局方式（ps:这个名称和icon-class对应）
  },
  getters: {

  },
  mutations: {
    // 定义一个 mutation 来改变 slice_CT_pic_layout 的值
    SET_SLICE_CT_PIC_LAYOUT(state, layout) {
      state.slice_CT_pic_layout = layout;
    }
  },
  actions: {},
}
