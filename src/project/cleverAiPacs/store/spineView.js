import dicomParser from "dicom-parser";


import * as cornerstone from '@cornerstonejs/core';
import { RenderingEngine, Enums  } from '@cornerstonejs/core';

import * as cornerstoneTools from '@cornerstonejs/tools';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';

cornerstone.init();
cornerstoneDICOMImageLoader.init();
cornerstoneTools.init();

cornerstone.imageLoader.registerImageLoader('wadouri', cornerstoneDICOMImageLoader.wadouri.loadImage);

// cornerstoneTools.addTool(cornerstoneTools.RectangleROIAnnotationTool);
// cornerstoneTools.addTool(cornerstoneTools.AnnotationDisplayTool);


const {ToolGroupManager, PanTool, RectangleROITool, ZoomTool, LengthTool } = cornerstoneTools;
const toolGroupId = 'ctToolGroup';
const ctToolGroup = ToolGroupManager.createToolGroup(toolGroupId);


const viewportId = "spineViewPort"
const renderingEngineId = "renderingEngine"


import {AllViewData} from './data';
import {xhr_getSlice,xhr_getSingleImage} from "@/api";
import {
  ButtonNames
} from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";



const VIEW_COLORS = {
  BACKGROUND: [0, 0, 0]
};




export default {
  namespaced: true,
  state: {
    seriesInfo: {
      seriesId: "",
      axialCount: "",
      coronalCount: "",
      sagittalCount: "",
      imageCount: "",
    },
    view:{
    },
    allViewData: { hu:'',reversed:false,cameraRotate:0 ,scaleLength: null,cobb:0},

  },

  mutations: {
    SET_SERIES_INFO(state, seriesInfo) {
      state.seriesInfo = seriesInfo;
    },
    SET_VIEW(state,view){
      state.view = view;
    },
    SET_VIEW_ITEM(state, { key, value}) {
      state.view[key] = value;
    },

    SET_ALL_VIEW_STATE(state, { key, value}) {
      state.allViewData[key] = value;

    },
    INIT_NODULE_ALL_VIEW_DATA(state){
      const originalData = new AllViewData();
      originalData.colorWindow = 4096;
      originalData.colorLevel = 1024;
      originalData.isPan = true;
      originalData.layOut = null;
      originalData.buttons = [ButtonNames.Ckcw, ButtonNames.Jbinfo,  ButtonNames.Pyms];
      originalData.activeButtons = [ButtonNames.Jbinfo , ButtonNames.Pyms ]
      state.allViewData = {...state.allViewData,...originalData}
    },

  },
  actions: {
    async InitView(
      {dispatch, commit, state},
      element
    ) {

      const renderingEngine = new RenderingEngine(renderingEngineId);
      commit('SET_VIEW_ITEM', {key:"renderer",value:renderingEngine});
      const viewportInput = {
        viewportId ,
        element,
        type: Enums.ViewportType.STACK,
        defaultOptions: {
          background: [1,1,1], // 黑色背景
                    // background: [0, 0, 0], // 黑色背景

        },
      };


      renderingEngine.enableElement(viewportInput);
      commit("SET_VIEW_ITEM",{key:"element",value:element})


    },
    InitViewData({state,dispatch,commit}){


    },

    async GetSlice({dispatch, state,commit}) {
      console.log("getslice")
      try {

        const res = await xhr_getSingleImage({
          studyid: "1838512078533521409",

        });

        if (res) {


          const file = new File([res.data], "image.dcm" );
          dispatch("UpdateSlice",{file})


        } else {
          console.error("Request failed: No data returned");
        }

      } catch (error) {
        console.error("Request failed:", error);
      }
    },


    async UpdateSlice({dispatch, state,commit},{file}) {
      ctToolGroup.addTool(PanTool.toolName);
ctToolGroup.addTool(LengthTool.toolName);
ctToolGroup.addTool(ZoomTool.toolName);
ctToolGroup.addViewport(viewportId, renderingEngineId);


ctToolGroup.setToolActive(LengthTool.toolName, {
  bindings: [{ mouseButton: 1 }],
});
ctToolGroup.setToolActive(PanTool.toolName, {
  bindings: [{ mouseButton: 2}],
});
ctToolGroup.setToolActive(ZoomTool.toolName, {
  bindings: [{ mouseButton: 4 }],
});
// ctToolGroup.setToolActive(StackScrollMouseWheelTool.toolName);


      const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);

      const imageIds = [imageId];
      // 获取渲染引擎和视口
      const renderer = state.view.renderer;
      if (!renderer) {
        throw new Error('Renderer is not initialized.');
      }

      const viewport = renderer.getViewport(viewportId);
      if (!viewport) {
        throw new Error(`Viewport with ID "${viewportId}" not found.`);
      }

      // 使用正确的参数调用 setStack
      await viewport.setStack(imageIds);
      // viewport.fitToWindow();

      // 渲染视图
      viewport.render();

    },


    beforeViewDestory({state,commit,dispatch}){

    },


  },
};
