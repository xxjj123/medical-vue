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


import {CircularMagnifyTool,PointInfoTool} from "@/picComps/picDiagnose/menudata/spine/toolClass"

import {ViewData,AllViewData, ViewRenderer} from './data';

import {xhr_getSlice,xhr_getDcmSlice,xhr_queryNodule,xhr_queryOperate} from "@/api";

import { gdcmReadImage} from "@itk-wasm/image-io"


cornerstoneTools.addTool(SplineROITool)

const VIEW_TYPES = {
  CORONAL: 1,
  AXIAL: 2,
  SAGITTAL: 0,
};

const VIEW_INFO = {
  AXIAL: {
    viewportId: 'STACK_AXIAL',
    viewName: 'axial',
    ijkId:2,
    getTrueIjk: (ijk) => [ijk[0], ijk[1], ""],
    getImagePoint:(points)=>{
      const [xmin, xmax, ymin, ymax, zmin, zmax] = points.split(",").map(Number);

      const pointsList = [
        [xmin, ymin],
        [xmax, ymin],
        [xmax, ymax],
        [xmin, ymax],
        [xmin, ymin]
      ];
      const bounds = [zmin,zmax]
      return {pointsList,bounds}
    },

    autoPlay:{
      state:false,
      timerId: null,
      animationId: null,
    }
  },
  CORONAL: {
    viewportId: 'STACK_CORONAL',
    viewName: 'coronal',
    ijkId:1,
    getTrueIjk: (ijk) => [ijk[0], "", ijk[1]] ,
    getImagePoint:(points)=>{
      const [xmin, xmax, ymin, ymax, zmin, zmax] = points.split(",").map(Number);
      const pointsList = [
        [xmin, zmin],
        [xmax, zmin],
        [xmax, zmax],
        [xmin, zmax],
        [xmin, zmin]
      ];
      const bounds = [ymin,ymax]
      return {pointsList,bounds}
    },
    autoPlay:{
      state:false,
      timerId: null,
      animationId: null,
    }
  },
  SAGITTAL: {
    viewportId: 'STACK_SAGITTAL',
    viewName: 'sagittal',
    ijkId:0,
    getTrueIjk: (ijk) =>  ["", ijk[0], ijk[1]],
    getImagePoint:(points)=>{
      const [xmin, xmax, ymin, ymax, zmin, zmax] = points.split(",").map(Number);
      const pointsList = [
        [ymin, zmin],
        [ymax, zmin],
        [ymax, zmax],
        [ymin, zmax],
        [ymin, zmin]
    ];
      const bounds = [xmin,xmax]
      return {pointsList,bounds}
    },

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
  allViewData: new AllViewData(),
  noduleInfo: {},
  noduleLesionList:[],


  CoronalData: new ViewData(),
  AxialData: new ViewData(),
  SagittalData: new ViewData(),

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

   selectedNoduleId: null,
});

export default {
  namespaced: true,
  state: {
    renderingEngineId:'myRenderingEngine',
    toolGroupId:"toolGroup",
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
    SET_NODULE_INFO(state, noduleInfo) {
      console.log("noduleInfo=======",noduleInfo)
      state.noduleInfo = noduleInfo;
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

    },

    SET_MOUSE_DOWN(state, value) {
      state.mouseDown = value;
    },

    SET_ALL_VIEW_STATE(state, { key, value}) {
      state.allViewData[key] = value;

    },

  },
  actions: {
    SetAllViewData({commit},{ key,value }){
      commit("SET_ALL_VIEW_STATE",{ key,value })
    },
    async InitViews({state,commit,dispatch},{axialElement, coronalElement, sagittalElement }){
      const {renderingEngineId,toolGroupId} = state;
      const renderingEngine = new RenderingEngine(renderingEngineId);
      const toolGroup = await dispatch("initializeToolGroup",toolGroupId)

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
      commit("SET_ALL_VIEW_STATE",{key:'windowWidth',value:1000})
      commit("SET_ALL_VIEW_STATE",{key:'windowCenter',value:500})
      renderingEngine.setViewports(viewportInputArray);
      // toolGroup.addViewport(viewportId, renderingEngineId);


      [VIEW_INFO.SAGITTAL, VIEW_INFO.CORONAL, VIEW_INFO.AXIAL].forEach(viewInfo=>{
        const {viewportId,getTrueIjk} = viewInfo
        const viewport = renderingEngine.getViewport(viewportId)
        const element = viewport.element
        const image = viewport?.getImageData()

        element.addEventListener( Events.MOUSE_CLICK, (event)=>{
          const image = viewport?.getImageData()
          // console.log("isInteractingWithTool",cornerstoneTools.state.isInteractingWithTool);
          // console.log("isMultiPartToolActive",cornerstoneTools.state.isMultiPartToolActive);

          if(!cornerstoneTools.state.isInteractingWithTool){
            if(image ){
              //     const toolGroup =  ToolGroupManager.getToolGroup(toolGroupId);
              // console.log("toolGroup",toolGroup);
              // console.log("cornerstoneTools",cornerstoneTools.state.isInteractingWithTool);

                  const {voxelManager,imageData} = image

                  const worldPos = event.detail.currentPoints.world
                  let ijk = transformWorldToIndex(imageData,worldPos);
                  const trueijk = getTrueIjk(ijk);

                   dispatch("UpdateIJK",trueijk)

                  }
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



        element.addEventListener( Events.MOUSE_WHEEL, (event)=>{
          const image = viewport?.getImageData()
          if(image){
            const { wheel } = event.detail;
            const { direction } = wheel;
            const delta = direction  ;
            const viewData = state.ViewPortData[viewportId]

            let newIndex;
          if (direction > 0) {
            newIndex =
              (viewData.changedPageIndex %
                viewData.dimension) +
              1;
            if (
              viewData.changedPageIndex ===
              viewData.dimension
            ) {
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
          } else {
            newIndex =
              ((viewData.changedPageIndex -
                2 +
                viewData.dimension) %
                viewData.dimension) +
              1;
            if (viewData.changedPageIndex === 1) {
              commit("SET_VIEW_DATA", {
                viewportId,
                key: "changedPageIndex",
                value: viewData.dimension,
              });

            } else {
              commit("SET_VIEW_DATA", {
                viewportId,
                key: "changedPageIndex",
                value: viewData.changedPageIndex - 1,
              });

            }
          }
          if(!state.isload){
            dispatch("updateSliceForView", {
              viewInfo:viewData,
              index: viewData.changedPageIndex,
            });

          }
          }

        })

        toolGroup.addViewport(viewportId, renderingEngineId);

      })
    },

    initializeToolGroup({state},toolGroupId){
      const preToolGroup =  ToolGroupManager.getToolGroup(toolGroupId);

      if (preToolGroup) {
        return preToolGroup;
      }

      const toolGroup =  ToolGroupManager.createToolGroup(toolGroupId);

      toolGroup.addTool(ZoomTool.toolName)
      toolGroup.addTool(CobbAngleTool.toolName)
      toolGroup.addTool(PanTool.toolName);
      toolGroup.addTool(DragProbeTool.toolName)

      toolGroup.addTool(SplineROITool.toolName,{
        getTextLines:()=>{},

       });
      toolGroup.addTool(LengthTool.toolName)

      toolGroup.addTool(PointInfoTool.toolName,{
        getTextLines:(data, targetId)=>{
          const {pointLabel} = data
          const textLines = [];
          textLines.push(pointLabel)
          return textLines;
        }
      })
      toolGroup.addTool(CircularMagnifyTool.toolName)

      toolGroup.setToolEnabled(SplineROITool.toolName);
      toolGroup.setToolEnabled(CobbAngleTool.toolName);
      toolGroup.setToolEnabled(PointInfoTool.toolName);
      // toolGroup.setToolEnabled(LengthTool.toolName);
      // toolGroup.setToolActive(ZoomTool.toolName, {
      //     bindings: [
      //           {
      //             mouseButton: MouseBindings.Primary,
      //           },
      //         ],
      //   });
      return toolGroup;
    },


    async InitAllSlice({dispatch,state,rootState,commit},seriesInfo){
      commit("SET_SERIES_INFO",seriesInfo)
      const operatequery = await xhr_queryOperate({ computeSeriesId:seriesInfo.computeSeriesId});
      const nodulequery = await xhr_queryNodule({ computeSeriesId:seriesInfo.computeSeriesId});

      if (nodulequery.serviceSuccess && operatequery) {
        commit("SET_NODULE_INFO",nodulequery.data.resultData)
      }
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

      const updateSlices = async () => {
        const viewportEntries = Object.values(state.ViewPortData);

        const ijk = new Array(3);

        viewportEntries.map(  (viewInfo) => {
          const {dimension,viewportId} = viewInfo
          const sliceIndex = Math.round(dimension / 2) + 1;
          ijk[viewInfo.ijkId] = sliceIndex

        })
        await dispatch("UpdateIJK",ijk)

        await dispatch("resetView");
      };

      // 调用函数
      updateSlices();



    },
    async UpdateIJK({state,dispatch, getters, commit}, ijk) {
      [VIEW_INFO.SAGITTAL, VIEW_INFO.CORONAL, VIEW_INFO.AXIAL].map(async (viewInfo, index) => {
        const sliceIndex = ijk[index];
        if(sliceIndex && sliceIndex !== ''){
          commit("SET_VIEW_DATA", {
            viewportId:viewInfo.viewportId,
            key: "changedPageIndex",
            value: sliceIndex,
          });
        }

      })

      if (state.isIjkLoad)  return;

      commit("UPDATE_IJKLOAD_STATUS",true)

      // [VIEW_INFO.SAGITTAL, VIEW_INFO.CORONAL, VIEW_INFO.AXIAL]

      const {ViewPortData  } =  state
      const viewportEntries = Object.values(ViewPortData);
      await Promise.all(
        viewportEntries.map(async (viewInfo, index) => {
          const sliceIndex = ijk[viewInfo.ijkId];
          return dispatch("updateSliceForView",{ viewInfo ,  index:sliceIndex })

        })
      );

      commit("UPDATE_IJKLOAD_STATUS",false)

      // await dispatch("resetView");
    },
    async updateSliceForView({dispatch,commit,state}, { viewInfo , index }) {
      if(index == ''  ) return;
      commit("UPDATE_LOAD_STATUS",true)

      const file = await dispatch("GetDicomFile", {viewInfo, index});
      if (file) {
        const {viewportId} = viewInfo
        commit("UPDATE_LOAD_STATUS", false);
        const imageId = await dispatch("UpdateSlice", {viewInfo, file});
        commit("SET_VIEW_DATA", {viewportId, key: "pageIndex", value: index});
        const {renderingEngineId} = state;
        const renderingEngine = getRenderingEngine(renderingEngineId);
        const viewport = renderingEngine.getViewport(
          viewportId
        )

        dispatch("UpdateSliceNodule",{viewInfo,imageId})

        cornerstoneTools.utilities.triggerAnnotationRenderForViewportIds([
          viewportId
        ]);

        viewport.render()
      }

    },

    async GetDicomFile({ dispatch, state, commit }, { viewInfo, index }) {
      commit("SET_VIEW_DATA", { viewportId:viewInfo.viewportId, key: "gotoPageIndex", value: index });
      try {
        const res = await xhr_getSlice({
          seriesId: state.seriesInfo.seriesId,
          viewName: viewInfo.viewName,
          viewIndex: index,
        });

        if (res) {
          const file = new File([res.data], "image.dcm" );
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
      const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);
      const {viewportId} =viewInfo
      const imageIds = [imageId];
      const {renderingEngineId} = state;
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
         viewportId
      )

      // await viewport.setStack(imageIds);
      const preImageIds = viewport.getImageIds()
      // console.log("preImageIds",preImageIds);


      viewport.imageIds = imageIds
      const image =await  cornerstone.imageLoader.loadImage(imageId)
      viewport.renderImageObject(image)
      if( preImageIds?.length == 0) {
        const WW = 1500
        const WC = -500

       viewport. setProperties({ voiRange: { upper: WC + WW / 2, lower: WC - WW / 2 } });
      }
      const { element } = viewport;
      let annotations = annotation.state.getAllAnnotations()

      const annotationIds = []

      annotations.forEach(anno=>{
        if( anno.metadata?.type == 'nodule'  && anno.metadata?.viewportId == viewportId){
          annotationIds.push(anno.annotationUID)
         }
      })
      annotationIds.forEach(annoId=>{
        annotation.state.removeAnnotation(annoId)

      })



      commit("SET_VIEW_DATA", { viewportId , key: "imageId", value: imageId });




      const {pixelSpacing,sliceThickness,frameOfReferenceUID,rows,columns,sliceLocation,imagePositionPatient } = metaData.get(MetadataModules.IMAGE_PLANE, imageId);
      metaData.addProvider((type)=>{
        if (type === MetadataModules.IMAGE_PLANE    ) {
          const imageOrientationPatient = [1, 0, 0, 0, 1, 0 ];
          const imagePositionPatient = [0,0,0];
          let columnPixelSpacing = null;
          let rowPixelSpacing = null;
          if (pixelSpacing) {
              rowPixelSpacing = pixelSpacing[0];
              columnPixelSpacing = pixelSpacing[1];
          }
          let rowCosines = null;
          let columnCosines = null;
          if (imageOrientationPatient) {
              rowCosines = [
                  parseFloat(imageOrientationPatient[0]),
                  parseFloat(imageOrientationPatient[1]),
                  parseFloat(imageOrientationPatient[2]),
              ];
              columnCosines = [
                  parseFloat(imageOrientationPatient[3]),
                  parseFloat(imageOrientationPatient[4]),
                  parseFloat(imageOrientationPatient[5]),
              ];
          }
          return {
              frameOfReferenceUID,
              rows,
              columns ,
              imageOrientationPatient,
              rowCosines,
              columnCosines,
              imagePositionPatient,
              sliceThickness,
              sliceLocation ,
              pixelSpacing,
              rowPixelSpacing,
              columnPixelSpacing,
          };

        }
      })
      return imageId
      // console.log(pixelSpacing,sliceThickness,frameOfReferenceUID,rows,columns,sliceLocation,imagePositionPatient);

    },
    async UpdateSliceNodule({state,dispatch},{viewInfo,imageId}){

      state.noduleInfo.noduleLesionList?.forEach((nodule)=>{
        const points = nodule.points
        const {viewportId, pageIndex} =  viewInfo
        const {pointsList,bounds} = viewInfo.getImagePoint(points)
        if(pageIndex > bounds[0] && pageIndex < bounds[1]){

          const worldPoints = pointsList.map(point=>utilities.imageToWorldCoords(imageId,point))
          const annotationUID =   utilities.uuidv4()
          const options = {annotationUID,type:'nodule',viewportId,pageIndex:pageIndex,id:nodule.id}
          dispatch("customDrawSpline", { viewInfo,points:worldPoints,options } );
          const styles = {
            color: 'rgb(0, 0, 255)'
          };
          annotation.config.style.setAnnotationStyles( annotationUID, styles);
        }

      })
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

    customDrawSpline({state},{viewInfo,points,options}){
       const { renderingEngineId  } =  state
       const {imageId,viewportId } = viewInfo

      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      )
      const FrameOfReferenceUID = viewport.getFrameOfReferenceUID();
      const { viewPlaneNormal, viewUp } = viewport.getCamera();
      const instance = new SplineROITool();
      const referencedImageId = imageId

      const splineType = SplineROITool.SplineTypes.Linear;
      const splineConfig = instance._getSplineConfig(splineType);
      const SplineClass = splineConfig.Class;
      const splineInstance = new SplineClass();
      const canvasPoints = points.map((point) => viewport.worldToCanvas(point));
      splineInstance.setControlPoints(canvasPoints);
      const splinePolylineCanvas = splineInstance.getPolylinePoints();
      const splinePolylineWorld = splinePolylineCanvas.map((point) => viewport.canvasToWorld(point));
      const newannotation = {
          annotationUID:  options?.annotationUID || utilities.uuidv4(),
          data: {
              handles: {
                  activeHandleIndex:null,
                  points,
                  textBox:{

                  }
              },
              label: '',
              cachedStats: {},
              spline: {
                  type: splineType,
                  instance: splineInstance,
              },
              contour: {
                  closed: false,
                  polyline: splinePolylineWorld,
              },
          },
          highlighted: false,
          autoGenerated: false,
          // invalidated: false,
          isLocked: false,
          isVisible: true,
          metadata: {
              toolName: SplineROITool.toolName,
              viewPlaneNormal,
              FrameOfReferenceUID,
              referencedImageId,
              ...options
          },
      };

      annotation.state.addAnnotation(newannotation,viewport.element)

    },

    beforeViewDestory({state,commit,dispatch}){
      dispatch("clearAllAutoplay")
      commit("RESET_STATE")
      // commit("toolBarStore/INIT_BUTTON_SHOW_STATE",[],{root:true})
      // commit("toolBarStore/INIT_BUTTON_ACTIVE_STATE",[],{root:true})

    }
  },
};
