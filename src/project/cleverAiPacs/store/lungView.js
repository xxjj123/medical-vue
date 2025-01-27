import dicomParser from "dicom-parser";
import { dicomTagDescriptions } from "@/assets/js/utils/dicom/tagCode";

import Vue from 'vue';
import * as cornerstone from '@cornerstonejs/core';
import { RenderingEngine ,Enums,utilities,metaData,getRenderingEngine ,imageLoader} from '@cornerstonejs/core';
// import { Types } from '@cornerstonejs/core';

import * as cornerstoneTools from '@cornerstonejs/tools';
const { ViewportType,MetadataModules } = Enums;
const {Events} = cornerstoneTools.Enums
const { MouseBindings } = cornerstoneTools.Enums;
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
const {annotation,ToolGroupManager, LengthTool,PanTool,ZoomTool,DragProbeTool,SplineROITool, RectangleROITool } = cornerstoneTools;
const { transformWorldToIndex,imageToWorldCoords,transformIndexToWorld } = utilities;

import debounce from 'lodash/debounce';

// console.log("utilities",utilities);
// console.log("Events",Events);

// cornerstone.Events

cornerstone.init();
cornerstoneTools.init();

cornerstoneDICOMImageLoader.init();
imageLoader.registerImageLoader('wadouri', cornerstoneDICOMImageLoader.wadouri.loadImage);
// cornerstone.cache.setMaxCacheSize(10000000)

import {CircularMagnifyTool,PointInfoTool} from "@/picComps/picDiagnose/menudata/spine/toolClass"

import {ViewData,AllViewData, ViewRenderer} from './data';
import {xhr_getSlice,xhr_getDcmSlice,xhr_queryNodule,xhr_queryOperate} from "@/api";
import { gdcmReadImage} from "@itk-wasm/image-io"
import {
  LayoutIcons,
} from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";

cornerstoneTools.addTool(SplineROITool)


const VIEW_INFO = {
  AXIAL: {
    viewportId: 'STACK_AXIAL',
    viewName: 'axial',
    originDirTag:['A','L','P','R'],
    dirTag :['A','L','P','R'],
    layoutIcon:LayoutIcons.AXIAL,
    ijkId:2,
    autoPlay:{
      state:false,
      timerId: null,
      animationId: null,
    }
  },
  CORONAL: {
    viewportId: 'STACK_CORONAL',
    viewName: 'coronal',
    originDirTag :['S','L','I','R'],
    dirTag :['S','L','I','R'],

    layoutIcon:LayoutIcons.CORONAL,

    ijkId:1,
    autoPlay:{
      state:false,
      timerId: null,
      animationId: null,
    }
  },
  SAGITTAL: {
    viewportId: 'STACK_SAGITTAL',
    viewName: 'sagittal',
    originDirTag :['S','P','I','A'],
    dirTag :['S','P','I','A'],
    layoutIcon:LayoutIcons.SAGITTAL,

    ijkId:0,
    autoPlay:{
      state:false,
      timerId: null,
      animationId: null,
    }
  },
};
const VIEW_METHOD = {
  [VIEW_INFO.AXIAL.viewportId]:{
    getTrueIjk: (ijk) => [ijk[0], ijk[1], ""],
    ijkToImage: (ijk) => [ijk[0], ijk[1]],
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
  },
  [VIEW_INFO.CORONAL.viewportId]:{
    getTrueIjk: (ijk) => [ijk[0], "", ijk[1]] ,
    ijkToImage: (ijk) => [ijk[0], ijk[2]],
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
  },
  [VIEW_INFO.SAGITTAL.viewportId]:{
    getTrueIjk: (ijk) =>  ["", ijk[0], ijk[1]],
    ijkToImage: (ijk) => [ijk[1], ijk[2]],

    getImagePoint:(points)=>{
      const [xmin, xmax, ymin, ymax, zmin, zmax] = points.split(",").map(Number);
      const pointsList = [
        [ymin, zmin],
        [ymax, zmin],
        [ymax, zmax],
        [ymin, zmax],
        [ymin, zmin]
      ];
      const bounds = [ymin,ymax]
      return {pointsList,bounds}
    }
  }
}


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
  ViewPortInstanceData:{
    [VIEW_INFO.AXIAL.viewportId]:{
      ...new ViewData()},
    [VIEW_INFO.SAGITTAL.viewportId]:{
      ...new ViewData()},
    [VIEW_INFO.CORONAL.viewportId]:{
      ...new ViewData()}
  },
  allViewData: new AllViewData(),
  activeModule: null,
  allModules:[],
  activeIJK:new Array(3),
  actualIJK:new Array(3),



  CoronalData: new ViewData(),
  AxialData: new ViewData(),
  SagittalData: new ViewData(),

  annotations: { value: [], index: new Set() },
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
  getters :{
    AxialViewData: state => {
      return state.ViewPortData[VIEW_INFO.AXIAL.viewportId]
    },
    CoronalViewData: state => {
      return state.ViewPortData[VIEW_INFO.CORONAL.viewportId]
    },
    SagittalViewData: state => {
      return state.ViewPortData[VIEW_INFO.SAGITTAL.viewportId]
    },
  },

  mutations: {

    SET_MODULE(state,{activeModule,moduleName}){

       if(!state.activedModules.includes(moduleName)){
        state.activedModules.push(moduleName);

      }
      state.activeModule  = moduleName
      const {ViewPortData,allViewData ,activeIJK} =  activeModule
      // console.log("activeIJK",activeIJK);

      // console.log("allViewData",allViewData);
      // console.log("ViewPortData",ViewPortData);

      state.allViewData = JSON.parse(JSON.stringify(allViewData)); //深拷贝
      state.ViewPortData = JSON.parse(JSON.stringify(ViewPortData));
      state.activeIJK = activeIJK

    },

    UPDATE_ALL_CROSS_HAIR(state){
      const {renderingEngineId,ViewPortData } =  state
      const renderingEngine = getRenderingEngine(renderingEngineId);

      const viewportEntries = Object.values(ViewPortData);
      viewportEntries.map(viewInfo=>{
        const {viewportId} = viewInfo
        const {ijkToImage} = VIEW_METHOD[viewportId]
        const imageIJ = ijkToImage(state.activeIJK)

        const viewport = renderingEngine.getViewport(
          viewportId
       )
        const image = viewport?.getImageData()
        if(image){
          const {imageData} = image

          const worldPos = imageData.indexToWorld([...imageIJ,0]);
          const canvasPos = viewport.worldToCanvas(worldPos)
          const view = state.ViewPortData[viewportId];
          view['displayX'] = canvasPos[0]||0;
          view['displayY'] = canvasPos[1]||0;
        }


      })

    },
    UPDATE_CROSS_HAIR(state,viewportId){
      if(viewportId){
        const {renderingEngineId } =  state
        const renderingEngine = getRenderingEngine(renderingEngineId);

        const {ijkToImage} = VIEW_METHOD[viewportId]
        // console.log("UPDATE_CROSS_HAIR",state.activeIJK);

        const imageIJ = ijkToImage(state.activeIJK)

        const viewport = renderingEngine.getViewport(
          viewportId
       )
        const image = viewport?.getImageData()
        if(image){
          const {imageData} = image
          const worldPos = imageData.indexToWorld([...imageIJ,0]);
          const canvasPos = viewport.worldToCanvas(worldPos)
          const view = state.ViewPortData[viewportId];
          view['displayX'] = canvasPos[0]||0;
          view['displayY'] = canvasPos[1]||0;
        }
      }
    },

    SET_SERIES_INFO(state,seriesInfo){
        state.seriesInfo = seriesInfo
    },
    SET_SERIES_INFO_ITEM(state,{key,value}){
      state.seriesInfo[key] = value;
    },
    SET_NODULE_INFO(state, noduleInfo) {
      // console.log("noduleInfo=======",noduleInfo)
      state.noduleInfo = noduleInfo;
    },
    RESET_STATE(state){
      Object.assign(state, getDefaultState())
    },
    ADD_MODULE(state,module){
      state.activedModules.push(module);
    },
    UPDATE_DIAGNOSE_STATE(state,{stateName,v_state}){
      state.activeModule = stateName
      // state.
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
      if(key == 'rotate' || key == 'flipVertical' ||key == 'flipHorizontal' ){
        const {originDirTag,rotate,flipVertica,flipHorizontal} = state.ViewPortData[viewportId]

        const dirTag = [...originDirTag]
        if(flipHorizontal){
          dirTag[1] = originDirTag[3]
          dirTag[3] = originDirTag[1]

        }
        if(flipVertica){
          dirTag[0] = originDirTag[2]
          dirTag[2] = originDirTag[0]
        }
        if (rotate % 90 === 0) {
          let steps = (rotate / 90) % originDirTag.length;
          for (let i = 0; i < steps; i++) {
            let lastElement = dirTag.pop();
            dirTag.unshift(lastElement);
          }
        }

        state.ViewPortData[viewportId].dirTag = dirTag
      }
      if(key=='pageIndex'){
        state.actualIJK[view.ijkId] = value
      }


      if(key=='changedPageIndex'){
        state.activeIJK[view.ijkId] = value
        const {renderingEngineId } =  state
        const renderingEngine = getRenderingEngine(renderingEngineId);

        const {ijkToImage} = VIEW_METHOD[viewportId]
        const imageIJ = ijkToImage(state.activeIJK)

        const viewport = renderingEngine.getViewport(
          viewportId
       )
        const image = viewport?.getImageData()
        if(image){
          const {imageData} = image
          const worldPos = imageData.indexToWorld([...imageIJ,0]);
          const canvasPos = viewport.worldToCanvas(worldPos)
          const view = state.ViewPortData[viewportId];
          view['displayX'] = canvasPos[0]||0;
          view['displayY'] = canvasPos[1]||0;
        }

      }
    },

    SET_ALL_VIEW_STATE(state, { key, value}) {
      if(key == 'zoomView'){
        if(state.allViewData['zoomView']){
          state.allViewData['zoomView'] = null
        }else{
          state.allViewData[key] = value;
        }
      }else{
        state.allViewData[key] = value;
      }
      // const viewportEntries = Object.values(state.ViewPortData);
      // viewportEntries.map((viewInfo)=>{
      //   state.ViewPortData[viewInfo.viewportId].zoomView = viewInfo.layoutIcon == value

      // })


    },

  },
  actions: {
    async addMyFavorite({commit},myFavorite){
      commit("SET_SERIES_INFO_ITEM",{key:'myFavorite',value:myFavorite})
    },
    SetAllViewData({commit},{ key,value }){
      commit("SET_ALL_VIEW_STATE",{ key,value })
    },
    async ActiveModule({dispatch, state, getters, commit,rootState,rootGetters},currentModuleState){
       await dispatch("clearAllAutoplay" )

      //  if(state.viewData.autoPlay.state)

      // await imageLoader.loadAndCacheImage(viewInfo.imageId)

      // const {toolBarStore} = rootGetters

      if(state.activedModules.includes(currentModuleState)){
        const preActivedTools = rootGetters["toolBarStore/getAllButtonActiveStates"]
        const trueKeys = Object.keys(preActivedTools).filter(key => preActivedTools[key] === true).map(key => key.replace('_on', ''));
        commit("SET_ALL_VIEW_STATE",{ key:"activeButtons",value:trueKeys})

        // console.log("rootGetters",trueKeys);

      }

      // console.log("toolBarStore",toolBarStore.activeButtons.join(","));
      console.log("stateall",state.allViewData.activeButtons.join(","));

      if(state.activeModule){
        dispatch(state.activeModule+"/saveModule",null,{root:true})
      }





      const activeModule = rootState[currentModuleState]
      commit("SET_MODULE",{activeModule,moduleName:currentModuleState})

      const {renderingEngineId,ViewPortData,allViewData,toolGroupId } =  state

      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewportEntries = Object.values(ViewPortData);

      // const ijk = new Array(3);
      // viewportEntries.map((viewInfo) => {
      //   const {pageIndex} = viewInfo
      //   ijk[viewInfo.ijkId] = pageIndex

      // })
      // console.log("ijk",ijk);

      // await dispatch("UpdateIJK",ijk)

      viewportEntries.map(async (viewInfo) =>{
        const {viewportId,camera,prop,changedPageIndex,pageIndex } = viewInfo
        const viewport = renderingEngine.getViewport(
           viewportId
        )

        if(camera){
          viewport.setCamera(camera)
          viewport.setProperties(prop)
        }
        commit("SET_VIEW_DATA", {viewportId, key: "changedPageIndex", value: changedPageIndex});
        // const camera = viewInfo.camera
        if(changedPageIndex != pageIndex ){
          console.log("在线下载",viewInfo.imageId);

          dispatch("updateSliceForView", {
            viewInfo,
            index: changedPageIndex,
          });
        }else{
          const cachedImage = await  cornerstone.cache.getImageLoadObject(viewInfo.imageId).promise;

          if(cachedImage){
            console.log("加载缓存",viewInfo.imageId);
            // const camera = viewInfo.camera
            // console.log("camera",camera);
            const {rotation} = viewport.getViewPresentation();
            const {flipHorizontal,flipVertical} = viewport.getCamera();

            viewport.imageIds = [viewInfo.imageId]
            viewport.renderImageObject(cachedImage)

            viewport.setCamera({flipHorizontal,flipVertical})
            viewport.setViewPresentation({rotation})
            // if(camera){
            //   viewport.setCamera(camera)
            //   viewport.setProperties(prop)
            // }

          }else{
            console.log("在线下载",viewInfo.imageId);
            dispatch("updateSliceForView", {
              viewInfo,
              index: changedPageIndex,
            });
          }
        }


        // console.log("state.activeModule",state.activeModule);
        commit("UPDATE_CROSS_HAIR" )

      })

      requestAnimationFrame(()=>{
        viewportEntries.map(async (viewInfo) =>{
          const {viewportId,camera,prop } = viewInfo
          const viewport = renderingEngine.getViewport(
             viewportId
          )

            cornerstoneTools.utilities.triggerAnnotationRenderForViewportIds([
              viewportId
            ]);
            viewport.render()
            dispatch(state.activeModule+"/UpdateSlice",{viewInfo,imageId:state.ViewPortData[viewInfo.viewportId].imageId},{root:true})


        })
      })

      const toolGroup =  ToolGroupManager.getToolGroup(toolGroupId);
      const cornerstoneToolButtom = [ZoomTool,PanTool]
      cornerstoneToolButtom.forEach(tool=>{
        // console.log("禁止了",tool.toolName);

        toolGroup.setToolPassive(tool.toolName);
      })

      viewportEntries.map(viewinfo=>{
       const viewport = renderingEngine.getViewport( viewinfo.viewportId)
         viewport.element.style.cursor = 'default'
      })

      // console.log("allViewData.activeButtons",allViewData.activeButtons.join(","));

      // dispatch("lungToolsStore/UpdateWindowCenter",allViewData.windowCenter,{root:true})
      // dispatch("lungToolsStore/UpdateWindowWidth",allViewData.windowWidth,{root:true})
      dispatch("toolBarStore/initButtonState",{showButtons: allViewData.buttons ,activeButtons:allViewData.activeButtons} ,{root:true})
      commit("toolBarStore/SET_SLICE_CT_PIC_LAYOUT",allViewData.layOut,{root:true})



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
            // background:  [1, 0, 0.2],
            background:  [0,0,0],

          },
        },
        {
          viewportId: VIEW_INFO.CORONAL.viewportId,
          type: ViewportType.STACK,
          element: coronalElement,
          defaultOptions: {
            // background:  [0.2, 0, 1],
            background:  [0,0,0],

          },
        },
        {
          viewportId: VIEW_INFO.SAGITTAL.viewportId,
          type: ViewportType.STACK,
          element: sagittalElement,
          defaultOptions: {
            // background:  [1, 0, 1],
            background:  [0,0,0],

          },
        },
      ];
      commit("SET_ALL_VIEW_STATE",{key:'windowWidth',value:1000})
      commit("SET_ALL_VIEW_STATE",{key:'windowCenter',value:500})
      renderingEngine.setViewports(viewportInputArray);
      // toolGroup.addViewport(viewportId, renderingEngineId);

      [VIEW_INFO.SAGITTAL, VIEW_INFO.CORONAL, VIEW_INFO.AXIAL].forEach(viewInfo=>{
        const {viewportId, } = viewInfo
        const {getTrueIjk} = VIEW_METHOD[viewInfo.viewportId]
        const viewport = renderingEngine.getViewport(viewportId)
        const element = viewport.element

        const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);

        element.addEventListener( Events.MOUSE_MOVE, (event)=>{
          const image = viewport?.getImageData()
          if(image){
            const {voxelManager,imageData} = image
            const worldPos = event.detail.currentPoints.world
            const ijk = transformWorldToIndex(imageData,worldPos);
            const value = voxelManager.getAtIJKPoint(ijk);

            commit("SET_VIEW_DATA", {
              viewportId,
              key: "hu",
              value: value,
            });

          }

        })
        element.addEventListener( Events.MOUSE_CLICK, (event)=>{
          dispatch("clearAllAutoplay")

          const image = viewport?.getImageData()
          // console.log("isInteractingWithTool",cornerstoneTools.state.isInteractingWithTool);
          // console.log("isMultiPartToolActive",cornerstoneTools.state.isMultiPartToolActive);

          const toolGroup =  ToolGroupManager.getToolGroup(toolGroupId);

           const PanToolInstance = toolGroup.toolOptions[PanTool.toolName]

          if(!( PanToolInstance?.mode =='active')){
            if(image ){
              //     const toolGroup =  ToolGroupManager.getToolGroup(toolGroupId);
              // console.log("toolGroup",toolGroup);
              // console.log("cornerstoneTools",cornerstoneTools.state.isInteractingWithTool);

              const {voxelManager,imageData,dimensions} = image

              const worldPos = event.detail.currentPoints.world
              let ijk = transformWorldToIndex(imageData,worldPos);
              console.log("ijk",ijk,dimensions);

              ijk = ijk.map((item,index)=>{
                if(item >dimensions[index] ){
                  return dimensions[index]
                }else if(item < 1){
                  return 1
                }
                return item
              })
              console.log("ijk",ijk,dimensions);


               const viewData = state.ViewPortData[viewportId]
               const trueijk = getTrueIjk(ijk);
              const pointIjk = trueijk.map(item=>item==''?viewData.pageIndex:item)

              dispatch(state.activeModule+"/handleMousePress",{viewportId,pointIjk},{root:true})

               dispatch("UpdateIJK",trueijk)

              }
          }

        })

        const onMouseDragStop = debounce(() => {
          // console.log('Mouse Drag has stopped!');
          const {actualIJK,activeIJK} = state
          let equal = true
          for (let i = 0; i < actualIJK.length; i++) {
            if (actualIJK[i] !== activeIJK[i]) {
              equal = false;
            }
          }
          if(!equal){
            commit("UPDATE_IJKLOAD_STATUS",false) //强制最后一次
            dispatch("UpdateIJK",activeIJK)

          }
          // const viewData = state.ViewPortData[viewportId]
          // if(viewData.pageIndex !== viewData.changedPageIndex){
          //   dispatch("updateSliceForView", {
          //     viewInfo:viewData,
          //     index: viewData.changedPageIndex,
          //   });
          // }
      }, 200);
        element.addEventListener( Events.MOUSE_DRAG, (event)=>{
          dispatch("clearAllAutoplay")

          const image = viewport?.getImageData()

          const toolGroup =  ToolGroupManager.getToolGroup(toolGroupId);

          const PanToolInstance = toolGroup.toolOptions[PanTool.toolName]

          const ZoomToolInstance = toolGroup.toolOptions[ZoomTool.toolName]

          const isAllowed = !( PanToolInstance?.mode =='Active') && !( ZoomToolInstance?.mode =='Active')


         if(isAllowed){
          // console.log(" PanToolInstance?.mode",PanToolInstance?.mode);

            if(image){
              const {voxelManager,imageData,dimensions} = image

              const worldPos = event.detail.currentPoints.world
              let ijk = transformWorldToIndex(imageData,worldPos);
              ijk = ijk.map((item,index)=>{
                if(item >dimensions[index] ){
                  return dimensions[index]
                }else if(item < 1){
                  return 1
                }
                return item
              })
              const trueijk = getTrueIjk(ijk);

              dispatch("UpdateIJK",trueijk)
            }
          }

          onMouseDragStop()

        })
        element.addEventListener( cornerstone.EVENTS.IMAGE_RENDERED, (event)=>{
          const {viewportId} = event.detail
          const {renderingEngineId} = state;

          const renderingEngine = getRenderingEngine(renderingEngineId);
          const viewport = renderingEngine.getViewport(
            viewportId
          )
          const image = viewport?.getImageData()
          if(image){
            commit("UPDATE_ALL_CROSS_HAIR")
            // commit("UPDATE_CROSS_HAIR",viewportId)
          }

        })

        const onMouseWheelStop = debounce(() => {
            // console.log('Mouse wheel has stopped!');
            const viewData = state.ViewPortData[viewportId]
            if(viewData.pageIndex !== viewData.changedPageIndex){
              dispatch("updateSliceForView", {
                viewInfo:viewData,
                index: viewData.changedPageIndex,
              });
            }
        }, 200);
        element.addEventListener( Events.MOUSE_WHEEL, (event)=>{
          dispatch("clearAllAutoplay")

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
            commit("UPDATE_ALL_CROSS_HAIR")

            // commit("UPDATE_CROSS_HAIR",viewData.viewportId)
          if(!state.isload){
            dispatch("updateSliceForView", {
              viewInfo:viewData,
              index: viewData.changedPageIndex,
            });

          }
          }


          onMouseWheelStop();
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
      toolGroup.setToolEnabled(PointInfoTool.toolName);


      const PanToolInstance = toolGroup.toolOptions[PanTool.toolName]
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
        viewportEntries.map(  (viewInfo) => {
          const {viewportId} = viewInfo
          commit("SET_VIEW_DATA", {
            viewportId,
            key: "invert",
            value: false,
          });
          commit("SET_VIEW_DATA", {
            viewportId,
            key: "rotate",
            value: 0,
          });


        })

        await dispatch("UpdateIJK",ijk)
        await dispatch("resetView");
      };

      await updateSlices();



      const modules = ["noduleStore", "fracStore", "pneumoniaStore"];
      const {noduleStore,fracStore,pneumoniaStore} = rootState
      // console.log("noduleStore,fracStore,pneumoniaStore",noduleStore,fracStore,pneumoniaStore);


       await Promise.all(modules.map(module => dispatch(module + "/InitModule", seriesInfo, { root: true })))
      console.log("准备就绪");

      dispatch("noduleStore/ActiveNodule",null,{root:true})


    },

    async UpdateIJK({state,dispatch, getters, commit}, ijk) {
      // console.log("ijk",ijk);
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

      commit("UPDATE_ALL_CROSS_HAIR")

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
      const {viewportId,ijkId} = viewInfo
      const oldModule = state.activeModule

      const viewInstance =  state.ViewPortInstanceData[viewportId]
      if(viewInstance.pageIndex != index) {
        commit("UPDATE_LOAD_STATUS",true)

        const file = await dispatch("GetDicomFile", {viewInfo, index});

        const isChangedModule = oldModule == state.activeModule
        console.log("module",oldModule,state.activeModule);

        if(!isChangedModule){
          console.log("前后不一致！！",oldModule,state.activeModule);

        }
        console.log("isChangedModule",isChangedModule);

        if (file && isChangedModule) {
          commit("UPDATE_LOAD_STATUS", false);
          const imageId = await dispatch("UpdateSlice", {viewInfo, file});
          commit("SET_VIEW_DATA", {viewportId, key: "pageIndex", value: index});
          commit("SET_VIEW_DATA", {viewportId, key: "imageId", value: imageId});



        }

      }
      const {renderingEngineId} = state;

      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      )
      // console.log("viewport",viewport);

      // dispatch("UpdateSliceNodule",{viewInfo,imageId})

      const { rotation } = viewport.getViewPresentation();
      console.log("rotation",rotation);

      if(state.activeModule){
        dispatch(state.activeModule+"/UpdateSlice",{viewInfo,imageId:viewInfo.imageId},{root:true})

      }

      cornerstoneTools.utilities.triggerAnnotationRenderForViewportIds([
        viewportId
      ]);
      viewport.render()

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
      const {viewportId,} =viewInfo
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
      const {rotation} = viewport.getViewPresentation();
      const {flipHorizontal,flipVertical} = viewport.getCamera();

      viewport.renderImageObject(image)
      // console.log("flipHorizontal,flipVertical,rotation",flipHorizontal,flipVertical,rotation);

      viewport.setCamera({flipHorizontal,flipVertical})
      viewport.setViewPresentation({rotation})
      // commit("SET_VIEW_DATA", {
      //   viewportId,
      //   key: "flipVertical",
      //   value: flipVertical,
      // });
      // commit("SET_VIEW_DATA", {
      //   viewportId,
      //   key: "flipVertical",
      //   value: flipVertical,
      // });


      // viewport.setCamera(camera);
      // viewport.setCamera(camera);


      if( preImageIds?.length == 0) {
        const WW = 1500
        const WC = -500

       viewport.setProperties({ voiRange: { upper: WC + WW / 2, lower: WC - WW / 2 } });
      }
      const { element } = viewport;
      // let annotations = annotation.state.getAllAnnotations()

      // const annotationIds = []

      // annotations.forEach(anno=>{
      //   if( anno.metadata?.type == 'lessionAnno'  && anno.metadata?.viewportId == viewportId){
      //     annotationIds.push(anno.annotationUID)
      //    }
      // })
      // annotationIds.forEach(annoId=>{
      //   annotation.state.removeAnnotation(annoId)

      // })

      commit("SET_VIEW_DATA", { viewportId , key: "imageId", value: imageId });
      // commit("SET_VIEW_DATA", { viewportId , key: "image", value: image });


      // const {pixelSpacing,sliceThickness,frameOfReferenceUID,rows,columns,sliceLocation, imagePositionPatient } = metaData.get(MetadataModules.IMAGE_PLANE, imageId);

      return imageId

    },
    async UpdateSliceNodule({state,dispatch},{viewInfo,imageId}){
      const {viewportId, pageIndex} =  viewInfo

      const { renderingEngineId,toolGroupId} = state
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewInfo.viewportId
      )
      const image = viewport?.getImageData()
      const {voxelManager,imageData} = image

      state.noduleInfo.noduleLesionList?.forEach((nodule)=>{
        const points = nodule.points
        const {getImagePoint} = VIEW_METHOD[viewInfo.viewportId]
        const {pointsList,bounds} = getImagePoint(points)

        if(pageIndex > bounds[0] && pageIndex < bounds[1]){

          const worldPoints = pointsList.map((point,index)=>{
            return imageData.indexToWorld([...point,0]);
          })
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
      const { renderingEngineId} = state
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      )
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
          // commit("UPDATE_CROSS_HAIR",viewData.viewportId)

          if(!state.isload){
            dispatch("updateSliceForView", {
              viewInfo:viewData,
              index: viewData.changedPageIndex,
            });
          }
          viewport.render()
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
        // commit("UPDATE_ALL_CROSS_HAIR")

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
