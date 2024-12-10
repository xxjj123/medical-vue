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
  },
  CORONAL: {
    viewportId: 'STACK_CORONAL',
    viewName: 'coronal',
    getTrueIjk: (ijk) => [ijk[0], "", ijk[1]] ,
  },
  SAGITTAL: {
    viewportId: 'STACK_SAGITTAL',
    viewName: 'sagittal',
    getTrueIjk: (ijk) =>  ["", ijk[0], ijk[1]],
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
      console.log("UPDATE_DIAGNOSE_STATE",v_state.AxialData)
      state.activeModule = store
      state.allViewData.copyFrom(v_state.allViewData)
      state.CoronalData.copyFrom(v_state.CoronalData)
      state.SagittalData.copyFrom(v_state.SagittalData)
      state.AxialData.copyFrom(v_state.AxialData)
      console.log("state.AxialData",state.AxialData)

    },
    UPDATE_AUTOPLAY_STATUS(state, { viewIndex, updates}){
      const autoPlayState = state.autoPlayStates[viewIndex];
        Object.keys(updates).forEach(key => {
          autoPlayState[key] = updates[key];
        });
    },
    CLEAR_AUTOPLAY(state, viewIndex) {
      const autoPlayState = state.autoPlayStates[viewIndex];

      if (autoPlayState && autoPlayState.isAutoPlay) {
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
        autoPlayState.isAutoPlay = false;

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
    SET_VIEW_DATA(state, {viewIndex, key, value}) {
      const viewName = VIEWDATA_NAMES[viewIndex];
      if (!state[viewName]) {
        state[viewName] = {};
      }
      state[viewName][key] = value;
    },

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


      })



    },


    async InitAllSlice({dispatch,state,rootState,commit},seriesInfo){
      commit("SET_SERIES_INFO",seriesInfo)
      const modules = ["noduleInfoStore", "fracInfoStore", "pneumoniaInfoStore"];
      await Promise.all(modules.map(module => dispatch(module + "/InitModuleState", seriesInfo, { root: true })))

      const dimensions = [seriesInfo.sagittalCount, seriesInfo.coronalCount, seriesInfo.axialCount]
      const ijk = dimensions.map(item => Math.round(item / 2) + 1)

      const updateSlices = async () => {
        await Promise.all(
          [VIEW_INFO.SAGITTAL, VIEW_INFO.CORONAL, VIEW_INFO.AXIAL].map(async (viewInfo, index) => {
            const sliceIndex = ijk[index];
            const file = await dispatch("GetDicomFile", {
              viewInfo: viewInfo,
              index: sliceIndex,
            });
            return dispatch("UpdateSlice", { viewInfo, file });
          })
        );

        await dispatch("resetView");
      };

      // 调用 updateSlices 函数
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
      const file = await dispatch("GetDicomFile", {viewInfo, index});
      if (file) {
        await dispatch("UpdateSlice", {viewInfo, file});
      }
      const {renderingEngineId} = state;
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewInfo.viewportId
      )

      viewport.render()
    },

    async GetDicomFile({ dispatch, state, commit }, { viewInfo, index }) {
      console.log(viewInfo,index);

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
      console.log("UpdateSlice");

      const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);
 

      const imageIds = [imageId];
      const {renderingEngineId} = state;
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewInfo.viewportId
      )

      // await viewport.setStack(imageIds);
      const preImageIds = viewport.getImageIds()
      console.log(preImageIds.length>0);


      if(viewport.getImageIds()?.length > 0 ){
        console.log("更新");
        const image =await  cornerstone.imageLoader.loadImage(imageId)

        console.log(viewport);

        const presentation = viewport.getViewPresentation()
        console.log(presentation);

        // renderingEngine.resize(true, false);
        viewport.renderImageObject(image)
        // viewport.setViewPresentation(presentation);





      }else{
        console.log("初始化");
        // const image =await  cornerstone.imageLoader.loadImage(imageId)
        // viewport.renderImageObject(image)
        await viewport.setStack(imageIds);
         const WW = 1500
         const WC = -500

        viewport. setProperties({ voiRange: { upper: WC + WW / 2, lower: WC - WW / 2 } });


      }
      const {pixelSpacing,sliceThickness,frameOfReferenceUID,rows,columns,sliceLocation,imagePositionPatient } = metaData.get(MetadataModules.IMAGE_PLANE, imageId);

      console.log(pixelSpacing,sliceThickness,frameOfReferenceUID,rows,columns,sliceLocation,imagePositionPatient);


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
    // addRectangleAnnotation({commit, state}, {view, annotation, bboxindex}) {
    //   const {xmin, ymin, xmax, ymax, boundsmin, boundsmax} = annotation;
    //   let boundsZ = view.image.getBounds()[2]
    //   if(viewIndex == 2){
    //     boundsZ = view.image.getBounds()[5]
    //   }
    //   const [worldpoint1, worldpoint2] = [
    //     view.image.indexToWorld([xmin, ymin, boundsZ]),
    //     view.image.indexToWorld([xmax, ymax,boundsZ]),
    //   ];
    //   const points = vtkPoints.newInstance();
    //   points.setNumberOfPoints(5);
    //   points.setPoint(0, worldpoint1[0], worldpoint1[1], worldpoint1[2]);
    //   points.setPoint(1, worldpoint2[0], worldpoint1[1], worldpoint1[2]);
    //   points.setPoint(2, worldpoint2[0], worldpoint2[1], worldpoint2[2]);
    //   points.setPoint(3, worldpoint1[0], worldpoint2[1], worldpoint2[2]);
    //   points.setPoint(4, worldpoint1[0], worldpoint1[1], worldpoint1[2]);

    //   const lines = vtkCellArray.newInstance();
    //   lines.insertNextCell([5, 0, 1, 2, 3, 4]);

    //   const polyData = vtkPolyData.newInstance();
    //   polyData.setPoints(points);
    //   polyData.setLines(lines);

    //   const mapper = vtkMapper.newInstance();
    //   mapper.setInputData(polyData);

    //   const actor = vtkActor.newInstance();
    //   actor.setVisibility(false);


    //   actor.setMapper(mapper);
    //   actor.getProperty().setColor(...BBOX_COLORS.DEFAULT);
    //   actor.getProperty().setLineWidth(1);

    //   commit("ADD_ANNOTATION", {
    //     actor,
    //     worldpoint1,
    //     worldpoint2,
    //     boundsmin,
    //     boundsmax,
    //     viewIndex: viewIndex,
    //     bboxIndex: bboxindex,
    //   });
    //   view.renderer.addActor(actor);
    //   view.renderWindow.render();
    // },
    // tools ===================================================================


    /**
     * 自动播放
     * @param {number} viewIndex - 操作页面索引
     * @param {number} time - 单片切换时间，单元毫秒
     */
    // AutoPlay({ commit, dispatch, state, getters,rootState }, { viewIndex }) {

    //   const view = rootState[state.activeModule].viewMprViews[viewIndex];
    //   const viewData = getters.viewsData[viewIndex]
    //   if (!state.autoPlayStates[viewIndex].isAutoPlay ) {
    //     dispatch("clearAllAutoplay")
    //     // 定义一个变量来保存 requestAnimationFrame 的 ID
    //      // 创建定时器，每隔 50ms 触发
    //      const timer = setInterval(() => {
    //       let newIndex =
    //         (viewData.changedPageIndex % viewData.dimension) + 1;

    //       if (viewData.changedPageIndex === viewData.dimension) {
    //         newIndex = 1;
    //         commit("SET_VIEW_DATA", {
    //           viewIndex: viewIndex,
    //           key: "changedPageIndex",
    //           value: 1,
    //         });
    //         dispatch("UpdateDisplay", {
    //           viewIndex: viewIndex,
    //           changedPageIndex: 1,
    //         });
    //       } else {
    //         commit("SET_VIEW_DATA", {
    //           viewIndex: viewIndex,
    //           key: "changedPageIndex",
    //           value: viewData.changedPageIndex + 1,
    //         });
    //         dispatch("UpdateDisplay", {
    //           viewIndex: viewIndex,
    //           changedPageIndex:
    //           viewData.changedPageIndex,
    //         });
    //       }
    //       if(!state.isload){
    //         dispatch("updateSliceForView", {
    //           viewName: viewData.viewName,
    //           viewIndex: viewIndex,
    //           index: viewData.changedPageIndex,
    //         });
    //       }
    //     }, 60);
    //       commit("UPDATE_AUTOPLAY_STATUS", {
    //         viewIndex: viewIndex,
    //        updates:{
    //         timerId: timer,
    //         isPlay: true,
    //        }
    //       });

    //     commit("UPDATE_AUTOPLAY_STATUS", {
    //       viewIndex: viewIndex,
    //      updates:{
    //       isAutoPlay: true,
    //      }
    //     });
    //   } else {
    //      commit("CLEAR_AUTOPLAY", viewIndex);
    //      if(viewData.gotoPageIndex != viewData.changedPageIndex){
    //       dispatch("updateSliceForView", {
    //         viewName: viewData.viewName,
    //         viewIndex: viewData.viewIndex,
    //         index: viewData.changedPageIndex,
    //       });
    //      }
    //      commit("UPDATE_AUTOPLAY_STATUS", {
    //       viewIndex: viewIndex,
    //      updates:{
    //       isAutoPlay: false,
    //      }
    //     });
    //   }
    // },


    beforeViewDestory({state,commit,dispatch}){
      dispatch("clearAllAutoplay")
      commit("RESET_STATE")
      // commit("toolBarStore/INIT_BUTTON_SHOW_STATE",[],{root:true})
      // commit("toolBarStore/INIT_BUTTON_ACTIVE_STATE",[],{root:true})

    }
  },
};
