
import { RenderingEngine ,Enums,utilities,metaData,cache,  getRenderingEngine,imageLoader} from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
const {annotation} = cornerstoneTools;

const VIEW_METHOD = {
  ['STACK_AXIAL']:{
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
  },
  ['STACK_CORONAL']:{
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
  },
  ['STACK_SAGITTAL']:{
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
  }
  }
}

import "@kitware/vtk.js/Rendering/Profiles/All";
import {
  readDicomTags,
  readImageDicomFileSeriesWorkerFunction,
} from "@itk-wasm/dicom";
import vtkImageMapper from "@kitware/vtk.js/Rendering/Core/ImageMapper";
import vtkImageSlice from "@kitware/vtk.js/Rendering/Core/ImageSlice";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkPolyData from "@kitware/vtk.js/Common/DataModel/PolyData";
import vtkPoints from "@kitware/vtk.js/Common/Core/Points";
import vtkCellArray from "@kitware/vtk.js/Common/Core/CellArray";
import vtkPicker from "@kitware/vtk.js/Rendering/Core/Picker";
import vtkCoordinate from "@kitware/vtk.js/Rendering/Core/Coordinate";
import {ViewData,AllViewData,ViewRenderer} from './data';
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";

import {
  ButtonNames,
  LayoutIcons
} from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";

import {xhr_queryPneumonia,xhr_updatePneuCheckStatus} from "@/api";
const coordinate = vtkCoordinate.newInstance();

import { gdcmReadImage} from "@itk-wasm/image-io"


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

const VIEWDATA_NAMES = ["SagittalData", "CoronalData", "AxialData"];

const VIEW_COLORS = {
  // BACKGROUND: [0.5, 0.5, 0.5]
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

export default {
  namespaced: true,
  state: {
    ViewPortData:{
      [VIEW_INFO.AXIAL.viewportId]:{
        ...VIEW_INFO.AXIAL,
        preImage:null,
        ...new ViewData()},
      [VIEW_INFO.SAGITTAL.viewportId]:{
        ...VIEW_INFO.SAGITTAL,
        preImage:null,
        ...new ViewData()},
      [VIEW_INFO.CORONAL.viewportId]:{
        ...VIEW_INFO.CORONAL,
        preImage:null,
        ...new ViewData()}
    },
    allViewData: new AllViewData(),
    activeIJK:new Array(3),






    // 选中行study信息，用于提取tags相关信息用
    viewMprViews: Array.from({length: 3}, () => (new ViewRenderer)),

    CoronalData: new ViewData,
    AxialData: new ViewData,
    SagittalData: new ViewData,
    pneumoniaInfo: {},
    contourActorList:{
      'sagittal':[],
      'coronal':[],
      'axial':[]
    },



    annotations: {value: [], index: new Set()},
    picker: vtkPicker.newInstance(),


    animationIds: Array.from({length: 3}, () => ({
      viewIndex: null,
      animationId: null,
    })),


    allViewData:new AllViewData,
    selectedPneumoniaId:null


  },
  getters: {
    viewsData: (state) => [
      state.SagittalData,
      state.CoronalData,
      state.AxialData,
    ],


  },
  mutations: {
    SAVE_MODULE(state,lungViewStore){
      const {ViewPortData,renderingEngineId,allViewData,activeIJK } =  lungViewStore
      state.allViewData = JSON.parse(JSON.stringify(allViewData));
      state.ViewPortData = JSON.parse(JSON.stringify(ViewPortData));
      console.log("保存pneu allViewData",allViewData);

      state.activeIJK = activeIJK

      const renderingEngine = getRenderingEngine(renderingEngineId);

      const viewportEntries = Object.values(ViewPortData);
      // cache.purgeCache()
      viewportEntries.map(async (viewInfo) =>{
        const viewport = renderingEngine.getViewport(
          viewInfo.viewportId
        )
        const presentation = viewport.getViewPresentation()
        state.ViewPortData[viewInfo.viewportId].pan  = viewport.getPan()
        state.ViewPortData[viewInfo.viewportId].imageId = viewInfo.imageId
        // console.log("保存",viewInfo.imageId);
        state.ViewPortData[viewInfo.viewportId].camera = viewport.getCamera()
        state.ViewPortData[viewInfo.viewportId].prop = viewport.getProperties()

        // console.log("viewport.getCamera()",viewport.getCamera());

        await imageLoader.loadAndCacheImage(viewInfo.imageId)
        // state.ViewPortData[viewInfo.viewportId].preImage = viewport.getImageData()

      })

    },
    SET_PNEUMONIA_INFO(state, pneumoniaInfo) {
      state.pneumoniaInfo = pneumoniaInfo;
      console.log("pneumoniaInfo",pneumoniaInfo);

      // state.pneumoniaInfo.focalDetailList = []

    },
    UPDATE_PNEUMONIA_LESSION(state,{pneuid,key,value}){
      const lesion = state.pneumoniaInfo.pneumoniaLesionList.find(item => item.id === pneuid);
      if (lesion) {
          lesion[key] = value;
      }

    },

    INIT_ALL_VIEW_DATA(state){
      // console.log("INIT_ALL_VIEW_DATA",state.allViewData);
      state.allViewData.windowCenter = -500
      state.allViewData.windowWidth = 1500
      state.allViewData.rotate = 0

      state.allViewData.isPan = false
      state.allViewData.zoomView = false

      state.allViewData.invert = false
      state.allViewData.flipHorizontal = false
      state.allViewData.flipVertical = false

      state.allViewData.layOut = LayoutIcons.MPR;
      state.allViewData.buttons = [ButtonNames.Layout, ButtonNames.Ckcw, ButtonNames.Jbinfo, ButtonNames.Szckx, ButtonNames.Pyms, ButtonNames.Bcj];
      state.allViewData.activeButtons = [ButtonNames.Jbinfo ]
    },


  },
  actions: {
    async saveModule({commit,rootState}){
      // console.log("保存肺炎数据");

      const {lungViewStore} = rootState
      commit("SAVE_MODULE",lungViewStore)

    },
    async InitModule({state,commit,rootState,dispatch},seriesInfo){
      const result = await xhr_queryPneumonia({ computeSeriesId:seriesInfo.computeSeriesId});

      if (result.serviceSuccess) {
        // console.log(result.data.resultData)
        commit("SET_PNEUMONIA_INFO",result.data.resultData)
      }
      const {lungViewStore} = rootState
      commit("SAVE_MODULE",lungViewStore)
      commit("INIT_ALL_VIEW_DATA")


    },

    async ActivePneumonia({dispatch,state,rootState,commit}){
      // console.log("肺炎");

      await dispatch("lungViewStore/ActiveModule","pneumoniaStore",{root:true})

   },


    async updatePneumoniaLession({state,commit},{pneuid,key,value}){
      // console.log({pneuid,key,value})
      const lesion = state.pneumoniaInfo.pneumoniaLesionList.find(item => item.id === pneuid);
      commit("UPDATE_PNEUMONIA_LESSION",{pneuid,key,value})
      if (lesion) {
        const data = {
          "pneumoniaLesionId":pneuid,
          "checked":value
        }

       await xhr_updatePneuCheckStatus(data).then(res=>{
        console.log(res)
       })
    }
    },

    async handleMousePress(
      {dispatch, commit, state, getters,rootState},
      {viewportId,pointIjk},
    ) {
      // console.log("trueijk",pointIjk);

      // const {lungViewStore} = rootState
      // const pickedX = pickedPosition[0];
      // const pickedY = pickedPosition[1];

    },
    async UpdateSlice({state,rootState,dispatch},{viewInfo,imageId}){
      // console.log("更新了pneu页面");

      const {lungViewStore} = rootState
      const { renderingEngineId} = lungViewStore

      const {pageIndex,viewName,viewportId} = viewInfo
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
         viewportId
      )
      let annotations = annotation.state.getAllAnnotations()
      const annotationIds = []
      annotations.forEach(anno=>{
        if( anno.metadata?.type == 'lessionAnno'  && anno.metadata?.viewportId == viewportId){
          annotationIds.push(anno.annotationUID)
         }
      })
      annotationIds.forEach(annoId=>{
        annotation.state.removeAnnotation(annoId)

      })

      const image = viewport?.getImageData()
      const {voxelManager,imageData} = image
      const contours = state.pneumoniaInfo.pneumoniaContourList.find(
            item => item.instanceNumber === pageIndex && item.viewName === viewName
          );
          if(contours){
            const points = JSON.parse(contours.points)

            points.forEach(pointsArray=>{
              const pointsList = []
              for (let i = 0; i < pointsArray.length; i += 2) {
                const x = pointsArray[i];
                const y = pointsArray[i + 1];
                pointsList.push([x, y]);
              }
              pointsList.push(pointsList[0])
              const worldPoints = pointsList.map((point,index)=>{
                return imageData.indexToWorld([...point,0]);
              })
              const annotationUID =   utilities.uuidv4()
              const options = {annotationUID,type:'lessionAnno',viewportId,pageIndex:pageIndex,id:'pneu'}
              dispatch("lungViewStore/customDrawSpline", { viewInfo,points:worldPoints,options },{root:true} );
              const styles = {
                color: 'rgb(255, 0, 0)'
              };
              annotation.config.style.setAnnotationStyles( annotationUID, styles);

            })

          }

    },


  },
};
