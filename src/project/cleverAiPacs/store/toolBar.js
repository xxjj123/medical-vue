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
const ButtonNames = {
  Layout:"Layout",//视窗调整
  Ckcw: "ckcw", // 窗宽窗位
  Mjtyms: "mjtyms", // 密集投影
  Jbinfo: "jbinfo", // 角标信息
  AiInfo: "aiInfo", // ai 信息
  Szckx: "szckx", // 十字参考线
  Pyms: "pyms", // 平移模式
  Bcj : "bcj", //靶重建
  EditCobb  :"editCobb",
  Zoom : "zoom",
  Reset :"reset",
  Invert : "invert",
  AutoPlay:"autoPlay"
};

const ButtonNamesLabel = {
  Layout:"视窗调整",//视窗调整
  Ckcw: "窗宽窗位", // 窗宽窗位
  Mjtyms: "密集投影", // 密集投影
  Jbinfo: "角标信息", // 角标信息
  AiInfo: "ai 信息", // ai 信息
  Szckx: "十字参考线", // 十字参考线
  Pyms: "平移模式", // 平移模式
  Bcj : "靶重建" //靶重建
};


// const LayoutNames = {
//   LGGJ:"Lggj",
//   MPR:"Mpr",
//   AXIAL:"Axial",
//   CORONAL:"Coronal",
//   SAGITTAL: "Sagittal",
//    RECON : "Recon"

// };

const suffix_active = `_on`;
const suffix_show = `_show`;

import {
  LayoutIcons
} from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";

export default {
  namespaced: true,
  state: {
    activeViewModule:null,
    activeToolModule:null,
    activeButtons:[],
    slice_CT_pic_layout: null, //ct-三视图+3d,容器布局方式（ps:这个名称和icon-class对应）
    ...Object.keys(ButtonNames).reduce((acc, key) => {
      acc[`${ButtonNames[key]}${suffix_active}`] = false;
      return acc;
    }, {}),
    ...Object.keys(ButtonNames).reduce((acc, key) => {
      acc[`${ButtonNames[key]}${suffix_show}`] = false;
      return acc;
    }, {}),

  },
  getters: {
    getAllButtonActiveStates: (state) => {
      return Object.keys(ButtonNames).reduce((acc, key) => {
        acc[`${ButtonNames[key]}${suffix_active}`] = state[`${ButtonNames[key]}${suffix_active}`];
        return acc;
      }, {});
    },
    getAllButtonShowStates: (state) => {
      return Object.keys(ButtonNames).reduce((acc, key) => {
        acc[`${ButtonNames[key]}${suffix_show}`] = state[`${ButtonNames[key]}${suffix_show}`];
        return acc;
      }, {});
    },

    allViewData:(state, getters, rootState)=>{
      const v_state = rootState[state.activeViewModule]

      return v_state?v_state.allViewData:{}
    }
  },
  mutations: {
    SET_ACTIVE_MODULE(state,{activeViewModule,activeToolModule}){
      state.activeViewModule = activeViewModule
      state.activeToolModule = activeToolModule
    },

    SET_SLICE_CT_PIC_LAYOUT(state, layout) {
      state.slice_CT_pic_layout = layout;

    },
    TOGGLE_BUTTON_ACTIVE_STATE(state, buttonName) {
      state[`${buttonName}${suffix_active}`] =
        !state[`${buttonName}${suffix_active}`];

      const activeButtons = Object.keys(ButtonNames).filter((key) => {
        return state[`${ButtonNames[key]}${suffix_active}`] === true;
      }).map((key) => ButtonNames[key]);
      state.activeButtons = activeButtons

    },
    INIT_BUTTON_ACTIVE_STATE(state, activeButtons) {
      Object.keys(ButtonNames).forEach((key) => {
        const button = ButtonNames[key];
        state[`${button}${suffix_active}`] = activeButtons.includes(button);
      });
    },
    TOGGLE_BUTTON_SHOW_STATE(state, buttonName) {
      state[`${buttonName}${suffix_show}`] =
        !state[`${buttonName}${suffix_show}`];

    },
    INIT_BUTTON_SHOW_STATE(state,showButtons) {
      Object.keys(ButtonNames).forEach((key) => {
        const button = ButtonNames[key];
        state[`${button}${suffix_show}`] = showButtons.includes(button);
      });

    }
  },
  actions: {
    setActiveModule({state,commit},activeModule){
      if(activeModule == 'MPR'){
        commit("SET_ACTIVE_MODULE",{activeViewModule:"mprViewStore",activeToolModule:"mprToolsStore"})

      }else if(activeModule == 'LUNG'){
        commit("SET_ACTIVE_MODULE",{activeViewModule:"lungViewStore",activeToolModule:"lungToolsStore"})

      }else if(activeModule == 'SPINE'){
        commit("SET_ACTIVE_MODULE",{activeViewModule:"spineViewStore",activeToolModule:"spineToolsStore"})

      }
    },

    initButtonState({state,commit,dispatch},{showButtons,activeButtons}){
      const newActiveButtons = activeButtons.join(",")
      console.log("new",newActiveButtons);

      const cornerstoneToolButtom = [ButtonNames.Zoom,ButtonNames.Pyms]


      // cornerstoneToolButtom.forEach(button => {
      //   const isOldActive = oldActiveButtons.includes(button);
      //   const isNewActive = newActiveButtons.includes(button);

      //   if (isOldActive !== isNewActive) {
      //     dispatch("activeButtonState", button);
      //   }
      // });
      commit("INIT_BUTTON_SHOW_STATE",showButtons)
      commit("INIT_BUTTON_ACTIVE_STATE",[])

      cornerstoneToolButtom.forEach(button => {
        if(activeButtons.includes(button)){
          dispatch("activeButtonState", button);
        }
      });

      commit("INIT_BUTTON_ACTIVE_STATE",activeButtons)

 
    },

    activeButtonState({state,commit,dispatch,rootState},buttonName){
      commit("TOGGLE_BUTTON_ACTIVE_STATE",buttonName)
      dispatch(state.activeViewModule+"/SetAllViewData",{
        key: "activeButtons",
        value: state.activeButtons,
      },{root:true})
      switch (buttonName) {
        case ButtonNames.Pyms:
          if(state[`${ButtonNames.Zoom}${suffix_active}`]){
            console.log("jinzoom");

            commit("TOGGLE_BUTTON_ACTIVE_STATE",ButtonNames.Zoom)
            dispatch(`${state.activeToolModule}/zoomView`, null, { root: true });
          }
          dispatch(`${state.activeToolModule}/ChangePan`, null, { root: true });
          break;

        case ButtonNames.Bcj:
          dispatch(state.activeViewModule+"/SetAllViewData",{
            key: "isRecon",
            value: state[`${ButtonNames.Bcj}${suffix_active}`],
          },{root:true})
          break;
        case ButtonNames.Zoom:
          if(state[`${ButtonNames.Pyms}${suffix_active}`]){
            console.log("jinpyms");
            commit("TOGGLE_BUTTON_ACTIVE_STATE",ButtonNames.Pyms)
            dispatch(`${state.activeToolModule}/ChangePan`, null, { root: true });
          }
          dispatch(`${state.activeToolModule}/zoomView`, null, { root: true });

          break;
        case ButtonNames.Invert:
            dispatch(`${state.activeToolModule}/invertView`, null, { root: true });
            break;

        case ButtonNames.Reset:
          if(state[`${ButtonNames.Invert}${suffix_active}`]){
            commit("TOGGLE_BUTTON_ACTIVE_STATE",ButtonNames.Invert)
            dispatch(`${state.activeToolModule}/invertView`, null, { root: true });
          }
          if(state[`${ButtonNames.Zoom}${suffix_active}`]){
            commit("TOGGLE_BUTTON_ACTIVE_STATE",ButtonNames.Zoom)
            dispatch(`${state.activeToolModule}/zoomView`, null, { root: true });
          }
            if(state[`${ButtonNames.Pyms}${suffix_active}`]){
              commit("TOGGLE_BUTTON_ACTIVE_STATE",ButtonNames.Pyms)
              dispatch(`${state.activeToolModule}/ChangePan`, null, { root: true });
            }
            dispatch(`${state.activeViewModule}/resetView`, null, { root: true });

          break;

        default:
          // 如果没有匹配的情况，可以在这里处理默认操作
          break;
      }
    },

    changeToolBar(){

    },
    AutoPlay({state,dispatch},{viewIndex}){
      console.log("viewIndex",viewIndex);

      dispatch(`${state.activeToolModule}/AutoPlay`, {viewIndex}, { root: true });
    },
    activeLayout({state,dispatch,commit},layout){
      // console.log("layout",layout);
      commit("SET_SLICE_CT_PIC_LAYOUT",layout)
      dispatch(state.activeViewModule+"/SetAllViewData",{
        key: "zoomView",
        value: null,
      },{root:true})
      dispatch(state.activeViewModule+"/SetAllViewData",{
        key: "layOut",
        value: layout,
      },{root:true})
    },
    activeZoom({state,dispatch,rootState},layoutIcon){
      dispatch(state.activeViewModule+"/SetAllViewData",{
        key: "zoomView",
        value: layoutIcon,
      },{root:true})

    },

    UpdateColorWindow({state,dispatch},value){
      dispatch(`${state.activeToolModule}/UpdateWindowWidth`, value, { root: true });
    },
    UpdateColorLevel({state,dispatch},value){
      dispatch(`${state.activeToolModule}/UpdateWindowCenter`, value, { root: true });

    }

  },
};
