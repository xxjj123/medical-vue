const VIEW_INFO = {
  AXIAL:{viewportId:'STACK_AXIAL',viewName:'axial'},
  CORONAL:{viewportId:'STACK_CORONAL',viewName:'coronal'},
  SAGITTAL:{viewportId:'STACK_SAGITTAL',viewName:'sagittal'},
}


import * as cornerstoneTools from '@cornerstonejs/tools';
const {ToolGroupManager,annotation, LengthTool,PanTool,  RectangleROITool, ZoomTool,SplineROITool ,CobbAngleTool} = cornerstoneTools;
const { MouseBindings } = cornerstoneTools.Enums;
import { RenderingEngine ,Enums,utilities,metaData,  getRenderingEngine} from '@cornerstonejs/core';
import {CircularMagnifyTool} from "@/picComps/picDiagnose/menudata/spine/toolClass"
import mutations from '@common/store/mutations';




import "@kitware/vtk.js/Rendering/Profiles/All";
import {
  readDicomTags,
  readImageDicomFileSeriesWorkerFunction,
} from "@itk-wasm/dicom";
import vtkXMLImageDataReader from "@kitware/vtk.js/IO/XML/XMLImageDataReader";
import vtkGenericRenderWindow from "@kitware/vtk.js/Rendering/Misc/GenericRenderWindow";
import vtkImageMapper from "@kitware/vtk.js/Rendering/Core/ImageMapper";
import vtkImageSlice from "@kitware/vtk.js/Rendering/Core/ImageSlice";
import vtkInteractorStyleImage from "@kitware/vtk.js/Interaction/Style/InteractorStyleImage";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkPolyData from "@kitware/vtk.js/Common/DataModel/PolyData";
import vtkPoints from "@kitware/vtk.js/Common/Core/Points";
import vtkCellArray from "@kitware/vtk.js/Common/Core/CellArray";
import vtkPicker from "@kitware/vtk.js/Rendering/Core/Picker";
import vtkCoordinate from "@kitware/vtk.js/Rendering/Core/Coordinate";
import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import throttle from "lodash/throttle";
import Vue from "vue";
import vtkITKHelper from "@kitware/vtk.js/Common/DataModel/ITKHelper";

import {xhr_getSlice,xhr_getDcmSlice} from "@/api";
const coordinate = vtkCoordinate.newInstance();

import { gdcmReadImage} from "@itk-wasm/image-io"

const VIEW_TYPES = {
  CORONAL: 1,
  AXIAL: 2,
  SAGITTAL: 0,
};

const VIEW_NAMES = {
  CORONAL: "coronal",
  AXIAL: "axial",
  SAGITTAL: "sagittal",
};
import {
  ButtonNames,
  suffix_name,
  suffix_show,
  LayoutIcons,
} from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";
const VIEWDATA_NAMES = ["SagittalData", "CoronalData", "AxialData"];

export default {
  namespaced: true,
  actions: {
    UpdateWindowCenter({state, commit,rootState,dispatch}) {
      const value = 500

      console.log("UpdateWindowCenter",value);

      const {lungViewStore} = rootState
      const {ViewPortData,renderingEngineId,allViewData } =  lungViewStore
      console.log("allViewData",allViewData);

      const {windowCenter,windowWidth} =  allViewData
      const viewportEntries = Object.values(ViewPortData);
      const renderingEngine = getRenderingEngine(renderingEngineId);

      const WC =  value
      const WW = windowWidth
      viewportEntries.map((viewInfo) =>{
        const viewport = renderingEngine.getViewport(
          viewInfo.viewportId
        )
        viewport.setProperties({ voiRange: { upper: WC + WW / 2, lower: WC - WW / 2 } });
        // commit("UPDATE_WINDOW_CENTER",value);
        dispatch("lungViewStore/SetAllViewData", {
          key: "colorLevel",
          value: value,
        },{root:true});



      viewport.render();
      })


    },

    UpdateWindowWidth({state, commit,rootState,dispatch}) {
      // const value = 500
      // console.log("UpdateWindowWidth",value);

      // const {spineViewStore} = rootState
      // const {viewportId,renderingEngineId,imageId} =  spineViewStore.view
      // const {windowCenter,windowWidth} = spineViewStore.allViewData

      // const renderingEngine = getRenderingEngine(renderingEngineId);
      // const viewport = renderingEngine.getViewport(
      //   viewportId
      // )


      //   const WC =  windowCenter
      //   const WW = value

      //   viewport.setProperties({ voiRange: { upper: WC + WW / 2, lower: WC - WW / 2 } });
      //   // commit("UPDATE_WINDOW_WIDTH",value);
      //   dispatch("lungViewStore/SetAllViewData", {
      //     key: "colorWindow",
      //     value: value,
      //   },{root:true});


      // viewport.render();

    },
    addCube({state,rootState,dispatch}){
      console.log("addCube");

      const points = "289,335,273,326,125,188"
      const {lungViewStore} = rootState
      const {ViewPortData,renderingEngineId,allViewData } =  lungViewStore

      const {windowCenter,windowWidth} =  allViewData
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewportEntries = Object.values(ViewPortData);

       viewportEntries.map((viewInfo)=>{
          const {viewportId,imageId} =  viewInfo
          const {pointsList,bounds} = viewInfo.getImagePoint(points)
          console.log("pointsList",pointsList);


          const worldPoints = pointsList.map(point=>utilities.imageToWorldCoords(imageId,point))
          console.log("worldPoints",worldPoints);

          const annotationUID =   utilities.uuidv4()

          const options = {annotationUID,type:'nodule',viewportId,pageIndex:''}
          dispatch("lungViewStore/customDrawSpline", { viewInfo,points:worldPoints,options },{root:true});

          const styles = {
            color: 'rgb(0, 0, 255)'
          };
          annotation.config.style.setAnnotationStyles( annotationUID, styles);

          cornerstoneTools.utilities.triggerAnnotationRenderForViewportIds([
            viewportId
          ]);
          const viewport = renderingEngine.getViewport(
            viewportId
          )
          viewport.render()

      })



    },
    getAnnotation({state,rootState}){
      console.log("annotation",annotation );
      const AnnotationManager = annotation.state.getAnnotationManager()
      console.log("AnnotationManager",AnnotationManager );
      const viewportId = 'STACK_AXIAL'
      const {lungViewStore} = rootState
      const {ViewPortData,renderingEngineId,allViewData } =  lungViewStore
      const renderingEngine = getRenderingEngine(renderingEngineId);

      const viewport = renderingEngine.getViewport(
        viewportId
      )
      console.log("getAnnotationManager",AnnotationManager.getGroupKey(viewport.element) );



      console.log("allAnnotations",annotation.state.getAllAnnotations());

    },

    /**
     * 自动播放
     * @param {number} viewIndex - 操作页面索引
     * @param {number} time - 单片切换时间，单元毫秒
     */
    AutoPlay({ commit, dispatch, state ,rootState,rootGetters }, { viewIndex }) {
      console.log("AutoPlay=lung");

      // const { mprViewStore } = rootState;
      // const v_state = mprViewStore;
      // if(v_state.allViewData.isPan){
      //   dispatch("toolBarStore/activeButtonState",ButtonNames.Pyms,{root:true})

      // }
      let  viewportId = 'STACK_AXIAL'
      console.log(viewIndex);

      if(viewIndex == 1)  viewportId = 'STACK_AXIAL'
      if(viewIndex == 2)  viewportId = 'STACK_CORONAL'
      if(viewIndex == 3)  viewportId = 'STACK_SAGITTAL'


      dispatch("lungViewStore/AutoPlay",{ viewportId },{root:true})
    }
,

    /**
     * 页面反向
     * @param {number} viewIndex - 操作页面索引
     */
    ReverseWindow({commit, state,rootState,rootGetters,dispatch}, viewIndex) {
      const {mprViewStore} = rootState
      // const view = rootState[mprViewStore.viewMprViews[viewIndex]];
      const view = rootState[mprViewStore.activeModule].viewMprViews[viewIndex];

      const viewdata = rootGetters['mprViewStore/viewsData'][viewIndex];

      const colorTransferFunction = vtkColorTransferFunction.newInstance();
      if (!viewdata.reversed) {
        colorTransferFunction.addRGBPoint(0, 1, 1, 1); // 白色
        colorTransferFunction.addRGBPoint(255, 0, 0, 0); // 黑色
      } else {
        colorTransferFunction.addRGBPoint(255, 1, 1, 1); // 白色
        colorTransferFunction.addRGBPoint(0, 0, 0, 0); // 黑色
      }
      dispatch("mprViewStore/SetViewData", {
        viewIndex,
        key: "reversed",
        value: !viewdata.reversed,
      },{
        root: true,
      },);

      view.sliceActor
        .getProperty()
        .setRGBTransferFunction(0, colorTransferFunction);
      dispatch("mprViewStore/freshView",view.viewIndex,{root:true})

      // view.interactor.render();
    },

    /**
     * 水平翻转
     * @param {number} viewIndex - 操作页面索引
     */
    FlipHorizontal({commit, dispatch, state}, viewIndex) {
      const view = state.viewMprViews[viewIndex];
      const currentScale = view.sliceActor.getScale();
      const newScaleX = currentScale[0] === 1 ? -1 : 1; // 切换X轴的翻转状态

      view.sliceActor.setScale(newScaleX, currentScale[1], currentScale[2]);


      dispatch("setupCamera", viewIndex);
    },

    /**
     * 垂直翻转
     * @param {number} viewIndex - 操作页面索引
     */
    FlipVertical({commit, dispatch, state}, viewIndex) {
      const view = state.viewMprViews[viewIndex];
      const currentScale = view.sliceActor.getScale();
      const newScaleY = currentScale[1] === 1 ? -1 : 1; // 切换Y轴的翻转状态

      view.sliceActor.setScale(currentScale[0], newScaleY, currentScale[2]);

      dispatch("setupCamera", viewIndex);
    },

    // 改变平移
    ChangePan({dispatch, state, commit,rootState }) {


    }
,

    setupCamera({commit, state,rootState,rootGetters,dispatch}, viewIndex){
      dispatch("mprViewStore/setupCamera",viewIndex,{root:true})
    },
    /**
     * 重置视图
     */
    resizeSliceViews({dispatch, state,   commit,rootState,rootGetters}) {
      const {lungViewStore} = rootState
      const { renderingEngineId} =lungViewStore
      const renderingEngine = getRenderingEngine(renderingEngineId);

      [VIEW_INFO.SAGITTAL, VIEW_INFO.CORONAL, VIEW_INFO.AXIAL].forEach(viewInfo=>{
        const viewport = renderingEngine.getViewport(
          viewInfo.viewportId
        )

        if (renderingEngine) {
          const presentation = viewport.getViewPresentation()
          renderingEngine.resize(true, false);  //重置canvas
          viewport.setViewPresentation(presentation);
        }
      })

    },
    resizeCamera({state,dispatch,rootGetters}){
      const viewsData = rootGetters['mprViewStore/viewsData']
      viewsData.forEach((view) =>{
        dispatch("setupCamera",view.viewIndex)
      })
    },
    beforeViewDestory({state,commit,dispatch}){
      dispatch("clearAllAutoplay")
      commit("RESET_STATE")

    }
  },
};
