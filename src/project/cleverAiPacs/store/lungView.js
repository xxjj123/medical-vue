import dicomParser from "dicom-parser";
import { dicomTagDescriptions } from "@/assets/js/utils/dicom/tagCode";

import Vue from 'vue';
import * as cornerstone from '@cornerstonejs/core';
import { RenderingEngine ,Enums,utilities,metaData,getRenderingEngine  } from '@cornerstonejs/core';
// import { Types } from '@cornerstonejs/core';

import * as cornerstoneTools from '@cornerstonejs/tools';
const { ViewportType,MetadataModules } = Enums;
const {Events} = cornerstoneTools.Enums
const { MouseBindings } = cornerstoneTools.Enums;
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
const {annotation,ToolGroupManager, LengthTool,PanTool,ZoomTool,DragProbeTool,SplineROITool, RectangleROITool ,CobbAngleTool} = cornerstoneTools;
const { transformWorldToIndex } = utilities;


cornerstone.init();
cornerstoneDICOMImageLoader.init();
cornerstoneTools.init();

cornerstone.imageLoader.registerImageLoader('wadouri', cornerstoneDICOMImageLoader.wadouri.loadImage);
// import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

// cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
// cornerstoneWADOImageLoader.configure({
//   useWebWorkers: true,  // 启用 Web Worker 来提升性能
// });


import {CircularMagnifyTool} from "@/picComps/picDiagnose/menudata/spine/toolClass"


import {ViewData,AllViewData, ViewRenderer} from './data';

import {xhr_getSlice,xhr_getDcmSlice} from "@/api";

import { gdcmReadImage} from "@itk-wasm/image-io"

const VIEW_TYPES = {
  CORONAL: 1,
  AXIAL: 2,
  SAGITTAL: 0,
};

const VIEW_INFO = {
  AXIAL: {
    viewportId: 'STACK_AXIAL',
    viewName: 'axial',
    getTrueIjk: (ijk) => [ijk[0], ijk[1], ""],
    autoPlay:{
      state:false,
      timerId: null,
      animationId: null,
    }
  },
  CORONAL: {
    viewportId: 'STACK_CORONAL',
    viewName: 'coronal',
    getTrueIjk: (ijk) => [ijk[0], "", ijk[1]] ,
    autoPlay:{
      state:false,
      timerId: null,
      animationId: null,
    }
  },
  SAGITTAL: {
    viewportId: 'STACK_SAGITTAL',
    viewName: 'sagittal',
    getTrueIjk: (ijk) =>  ["", ijk[0], ijk[1]],
    autoPlay:{
      state:false,
      timerId: null,
      animationId: null,
    }
  },
};



const VIEW_COLORS = {
  BACKGROUND: [0, 0, 0]
};

const BBOX_COLORS = {
  DEFAULT: [0.29, 0.56, 0.89],
  SELECTED: [1.0, 1.0, 0.0],
};
const BBOX_LINEWIDTH = {
  DEFAULT: 1,
  SELECTED: 2,
};


const getDefaultState = () => ({
  isload: false,
  isIjkLoad:false,
  studies_selected: {},

  // seriesInfo: {
  //   seriesId: "",
  //   axialCount: "",
  //   coronalCount: "",
  //   sagittalCount: "",
  //   imageCount: "",
  // },

  viewMprViews: Array.from({ length: 3 }, () => ({
    viewIndex: null,
    viewName: null,
    grw: null,
    interactor: null,
    renderWindow: null,
  })),
  ViewPortData:{
    [VIEW_INFO.AXIAL.viewportId]:{
      ...VIEW_INFO.AXIAL,
      ...new ViewData()},
    [VIEW_INFO.SAGITTAL.viewportId]:{
      ...VIEW_INFO.SAGITTAL,
      ...new ViewData()},
    [VIEW_INFO.CORONAL.viewportId]:{
      ...VIEW_INFO.CORONAL,
      ...new ViewData()}
  },

  CoronalData: new ViewData(),
  AxialData: new ViewData(),
  SagittalData: new ViewData(),
  noduleInfo: {},

  annotations: { value: [], index: new Set() },
  mouseDown: false,
  autoPlayStates: Array.from({ length: 3 }, () => ({
    isPlay: false,
    isAutoPlay: false,
    viewIndex: null,
    timerId: null,
    animationId: null,
  })),
  animationIds: Array.from({ length: 3 }, () => ({
    viewIndex: null,
    animationId: null,
  })),
  activeModule: null,
  activedModules: [],

  allViewData: new AllViewData(),
  selectedNoduleId: null,
});

export default {
  namespaced: true,
  state: {
    renderingEngineId:'myRenderingEngine',
    seriesInfo:{
      seriesId: "",
      axialCount: "",
      coronalCount: "",
      sagittalCount: "",
      imageCount: ""
    },
    ...getDefaultState(),

  },

  mutations: {
    SET_SERIES_INFO(state,seriesInfo){
        state.seriesInfo = seriesInfo
    },
    RESET_STATE(state){
      Object.assign(state, getDefaultState())
    },
    ADD_MODULE(state,module){
      state.activedModules.push(module);
    },
    UPDATE_DIAGNOSE_STATE(state,{store,v_state}){
      state.activeModule = store
      state.allViewData.copyFrom(v_state.allViewData)
      state.CoronalData.copyFrom(v_state.CoronalData)
      state.SagittalData.copyFrom(v_state.SagittalData)
      state.AxialData.copyFrom(v_state.AxialData)

    },
    UPDATE_AUTOPLAY_STATUS(state, { viewportId, updates}){

      const autoPlayState = state.ViewPortData[viewportId];
        Object.keys(updates).forEach(key => {
          autoPlayState.autoPlay[key] = updates[key];
        });
    },
    CLEAR_AUTOPLAY(state, viewportId) {
      const autoPlayState = state.ViewPortData[viewportId].autoPlay;

      if (autoPlayState && autoPlayState.state) {
        // 清除定时器和动画帧
        if (autoPlayState.timerId) {
          clearInterval(autoPlayState.timerId);
          autoPlayState.timerId = null;
        }
        if (autoPlayState.animationId) {
          cancelAnimationFrame(autoPlayState.animationId);
          autoPlayState.animationId = null;
        }

        // 更新状态
        autoPlayState.autoPlay = false;

      }
    }
,
    UPDATE_LOAD_STATUS(state,statu) {
      state.isload = statu;
    },
    UPDATE_IJKLOAD_STATUS(state,statu) {
      state.isIjkLoad = statu;
    },
    SET_STUDIES_SELECTED(state, payload) {
      state.studies_selected = payload;
    },

    INIT_VIEW_MPR_VIEW(state, {viewIndex, data}) {
      state.viewMprViews[viewIndex] = data;
    },
    SET_VIEW_MPR_VIEW(state, {viewIndex, key, value}) {
      state.viewMprViews[viewIndex][key] = value;
    },
    SET_VIEW_DATA(state, {viewportId, key, value}) {
      const view = state.ViewPortData[viewportId];
      view[key] = value;
      // console.log("SET_VIEW_DATA",key,value);
      // console.log("state.ViewPortData[viewportId]",state.ViewPortData[viewportId]);


    },
    // SET_VIEW_DATA(state, {viewIndex, key, value}) {
    //   const viewName = VIEWDATA_NAMES[viewIndex];
    //   if (!state[viewName]) {
    //     state[viewName] = {};
    //   }
    //   state[viewName][key] = value;
    // },

    SET_MOUSE_DOWN(state, value) {
      state.mouseDown = value;
    },

    SET_ALL_VIEW_STATE(state, { key, value}) {
      state.allViewData[key] = value;
    },


  },
  actions: {

    InitViews({state,dispatch},{axialElement, coronalElement, sagittalElement }){
      const renderingEngineId = state.renderingEngineId;
      const renderingEngine = new RenderingEngine(renderingEngineId);

      const viewportInputArray = [
        {
          viewportId: VIEW_INFO.AXIAL.viewportId,
          type: ViewportType.STACK,
          element: axialElement,
          defaultOptions: {
            background:  [1, 0, 0.2],
          },
        },
        {
          viewportId: VIEW_INFO.CORONAL.viewportId,
          type: ViewportType.STACK,
          element: coronalElement,
          defaultOptions: {
            background:  [0.2, 0, 1],
          },
        },
        {
          viewportId: VIEW_INFO.SAGITTAL.viewportId,
          type: ViewportType.STACK,
          element: sagittalElement,
          defaultOptions: {
            background:  [1, 0, 1],
          },
        },
      ];


      renderingEngine.setViewports(viewportInputArray);
      console.log("Events",Events);


      [VIEW_INFO.SAGITTAL, VIEW_INFO.CORONAL, VIEW_INFO.AXIAL].forEach(viewInfo=>{
        const {viewportId,getTrueIjk} = viewInfo
        const viewport = renderingEngine.getViewport(viewportId)
        const element = viewport.element
        const image = viewport?.getImageData()

        element.addEventListener( Events.MOUSE_CLICK, (event)=>{
          const image = viewport?.getImageData()
          if(image){
            const {voxelManager,imageData} = image

            const worldPos = event.detail.currentPoints.world
            let ijk = transformWorldToIndex(imageData,worldPos);
            const trueijk = getTrueIjk(ijk);

             dispatch("UpdateIJK",trueijk)

            }


        })
        element.addEventListener( Events.MOUSE_DRAG, (event)=>{
          const image = viewport?.getImageData()
          if(image){
            const {voxelManager,imageData} = image

            const worldPos = event.detail.currentPoints.world
            let ijk = transformWorldToIndex(imageData,worldPos);
            const trueijk = getTrueIjk(ijk);

             dispatch("UpdateIJK",trueijk)

            }


        })




      })



    },


    async InitAllSlice({dispatch,state,rootState,commit},seriesInfo){
      commit("SET_SERIES_INFO",seriesInfo)
      const modules = ["noduleInfoStore", "fracInfoStore", "pneumoniaInfoStore"];
      // await Promise.all(modules.map(module => dispatch(module + "/InitModuleState", seriesInfo, { root: true })))

      commit("SET_VIEW_DATA", {
        viewportId: VIEW_INFO.SAGITTAL.viewportId,
        key: "dimension",
        value: seriesInfo.sagittalCount,
      });
      commit("SET_VIEW_DATA", {
        viewportId: VIEW_INFO.CORONAL.viewportId,
        key: "dimension",
        value: seriesInfo.coronalCount,
      });
      commit("SET_VIEW_DATA", {
        viewportId: VIEW_INFO.AXIAL.viewportId,
        key: "dimension",
        value: seriesInfo.axialCount,
      });
      // const dimensions = [seriesInfo.sagittalCount, seriesInfo.coronalCount, seriesInfo.axialCount]
      // const ijk = dimensions.map(item => Math.round(item / 2) + 1)

      const updateSlices = async () => {
        const viewportEntries = Object.values(state.ViewPortData);

        await Promise.all(
          viewportEntries.map(async (viewInfo) => {
            const sliceIndex = Math.round(viewInfo.dimension / 2) + 1;
            console.log("sliceIndex", sliceIndex);

            const file = await dispatch("GetDicomFile", {
              viewInfo,
              index: sliceIndex,
            });

            await dispatch("UpdateSlice", { viewInfo, file });
          })
        );

        await dispatch("resetView");
      };

      // 调用函数
      updateSlices();



    },
    async UpdateIJK({dispatch, getters, commit}, ijk) {
      console.log( "ijk",ijk);

      await Promise.all(
        [VIEW_INFO.SAGITTAL, VIEW_INFO.CORONAL, VIEW_INFO.AXIAL].map(async (viewInfo, index) => {
          const sliceIndex = ijk[index];
          return dispatch("updateSliceForView",{ viewInfo ,  index:sliceIndex })

        })
      );
      // await dispatch("resetView");
    },
    async updateSliceForView({dispatch,commit,state}, { viewInfo , index }) {
      if(index == '') return;
      commit("UPDATE_LOAD_STATUS",true)

      const file = await dispatch("GetDicomFile", {viewInfo, index});
      if (file) {
        commit("UPDATE_LOAD_STATUS", false);
        await dispatch("UpdateSlice", {viewInfo, file});
        commit("SET_VIEW_DATA", {viewportId:viewInfo.viewportId, key: "pageIndex", value: index});

      }
      const {renderingEngineId} = state;
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewInfo.viewportId
      )

      viewport.render()
    },

    async GetDicomFile({ dispatch, state, commit }, { viewInfo, index }) {
      // console.log(viewInfo,index);
      commit("SET_VIEW_DATA", { viewportId:viewInfo.viewportId, key: "gotoPageIndex", value: index });

      try {
        const res = await xhr_getSlice({
          seriesId: state.seriesInfo.seriesId,
          viewName: viewInfo.viewName,
          viewIndex: index,
        });

        if (res) {
          const file = new File([res.data], "image.dcm" );
          // dispatch("UpdateSlice",{viewInfo,file})
          return file
        } else {
          console.error("Request failed: No data returned");
          return null;
        }
      } catch (error) {
        console.error("Request failed:", error);
        return null;
      }
    },


    async UpdateSlice(
      {commit, dispatch, state,rootState},
      {viewInfo,file},
    ) {
      // console.log("UpdateSlice");

      const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);


      const imageIds = [imageId];
      const {renderingEngineId} = state;
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewInfo.viewportId
      )

      // await viewport.setStack(imageIds);
      const preImageIds = viewport.getImageIds()
      // console.log(preImageIds.length>0);


      if(viewport.getImageIds()?.length > 0 ){
        // console.log("更新");
        const image =await  cornerstone.imageLoader.loadImage(imageId)

        // console.log(viewport);

        const presentation = viewport.getViewPresentation()
        // console.log(presentation);

        // renderingEngine.resize(true, false);
        viewport.renderImageObject(image)
        // viewport.setViewPresentation(presentation);





      }else{
        // console.log("初始化");
        // const image =await  cornerstone.imageLoader.loadImage(imageId)
        // viewport.renderImageObject(image)
        await viewport.setStack(imageIds);
         const WW = 1500
         const WC = -500

        viewport. setProperties({ voiRange: { upper: WC + WW / 2, lower: WC - WW / 2 } });


      }
      const {pixelSpacing,sliceThickness,frameOfReferenceUID,rows,columns,sliceLocation,imagePositionPatient } = metaData.get(MetadataModules.IMAGE_PLANE, imageId);

      // console.log(pixelSpacing,sliceThickness,frameOfReferenceUID,rows,columns,sliceLocation,imagePositionPatient);


    },

    async resetView({state,dispatch}){
      [VIEW_INFO.SAGITTAL, VIEW_INFO.CORONAL, VIEW_INFO.AXIAL].forEach(async (viewInfo, index) => {
        const { renderingEngineId} = state
        const renderingEngine = getRenderingEngine(renderingEngineId);
        const viewport = renderingEngine.getViewport(
          viewInfo.viewportId
        )

        renderingEngine.resize(true, false);
        const displayArea  =  await dispatch("createDisplayArea",{size:1,pointValue:0.5})

        viewport.setOptions(displayArea);
        viewport.setProperties(displayArea);
        viewport.render();
      });

    },

    createDisplayArea({state},
      {size,
      pointValue,
      canvasValue = pointValue,
      rotation = 90,
      flipHorizontal = false}
    ) {
      const imagePoint = Array.isArray(pointValue)
        ? pointValue
        : [pointValue, pointValue];
      const canvasPoint = Array.isArray(canvasValue)
        ? canvasValue
        : [canvasValue, canvasValue];
      return {
        rotation,
        flipHorizontal,
        invert:false,
        displayArea: {
          imageArea: Array.isArray(size) ? size : [size, size],
          imageCanvasPoint: {
            imagePoint,
            canvasPoint,
          },
        },
      };
    },

    // tools ===================================================================

    clearAllAutoplay({state,getters,commit,dispatch}){
      const viewportEntries = Object.values(state.ViewPortData);
      viewportEntries.map(async (viewInfo) => {
        commit("CLEAR_AUTOPLAY", viewInfo.viewportId);
        commit("UPDATE_AUTOPLAY_STATUS", {
          viewportId:viewInfo.viewportId,
          updates:{
            state: false,
            timerId: null,
            animationId: null,
          }
        });})



    },

    /**
     * 自动播放
     * @param {number} viewIndex - 操作页面索引
     * @param {number} time - 单片切换时间，单元毫秒
     */
    AutoPlay({ commit, dispatch, state, getters,rootState }, { viewportId }) {
      const viewData = state.ViewPortData[viewportId]
      console.log("viewData.autoPlay.state",viewData );

      if (!viewData.autoPlay.state ) {
        dispatch("clearAllAutoplay")
        // 定义一个变量来保存 requestAnimationFrame 的 ID
         // 创建定时器，每隔 50ms 触发
         const timer = setInterval(() => {
          let newIndex =
            (viewData.changedPageIndex % viewData.dimension) + 1;

          if (viewData.changedPageIndex === viewData.dimension) {
            newIndex = 1;
            commit("SET_VIEW_DATA", {
              viewportId,
              key: "changedPageIndex",
              value: 1,
            });
          } else {
            commit("SET_VIEW_DATA", {
              viewportId,
              key: "changedPageIndex",
              value: viewData.changedPageIndex + 1,
            });
          }
          if(!state.isload){
            dispatch("updateSliceForView", {
              viewInfo:viewData,
              index: viewData.changedPageIndex,
            });
          }
        }, 60);
          commit("UPDATE_AUTOPLAY_STATUS", {
            viewportId,
            updates:{
              state: true,
              timerId: timer,
            }
          });

        commit("UPDATE_AUTOPLAY_STATUS", {
          viewportId,
          updates:{
            state: true,
          }
        });
      } else {
         commit("CLEAR_AUTOPLAY", viewportId);
         if(viewData.gotoPageIndex != viewData.changedPageIndex){
          dispatch("updateSliceForView", {
            viewInfo:viewData,
            index: viewData.changedPageIndex,
          });
         }
         commit("UPDATE_AUTOPLAY_STATUS", {
          viewportId,
          updates:{
            state: false,
          }
        });
      }
    },


    beforeViewDestory({state,commit,dispatch}){
      dispatch("clearAllAutoplay")
      commit("RESET_STATE")
      // commit("toolBarStore/INIT_BUTTON_SHOW_STATE",[],{root:true})
      // commit("toolBarStore/INIT_BUTTON_ACTIVE_STATE",[],{root:true})

    }
  },
};
