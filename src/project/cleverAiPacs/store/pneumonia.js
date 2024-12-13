import { RenderingEngine ,Enums,utilities,metaData,  getRenderingEngine} from '@cornerstonejs/core';
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
        prePresentation:null,
        preImage:null,
        ...new ViewData()},
      [VIEW_INFO.SAGITTAL.viewportId]:{
        ...VIEW_INFO.SAGITTAL,
        prePresentation:null,
        preImage:null,
        ...new ViewData()},
      [VIEW_INFO.CORONAL.viewportId]:{
        ...VIEW_INFO.CORONAL,
        prePresentation:null,
        preImage:null,
        ...new ViewData()}
    },
    allViewData: new AllViewData(),





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
      const {ViewPortData,renderingEngineId,allViewData } =  lungViewStore
      state.allViewData = JSON.parse(JSON.stringify(allViewData));
      state.ViewPortData = JSON.parse(JSON.stringify(ViewPortData));

      const renderingEngine = getRenderingEngine(renderingEngineId);

      const viewportEntries = Object.values(ViewPortData);

      viewportEntries.map((viewInfo) =>{
        const viewport = renderingEngine.getViewport(
          viewInfo.viewportId
        )
        const presentation = viewport.getViewPresentation()
        state.ViewPortData[viewInfo.viewportId].prePresentation  = presentation
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
    SET_CONTOURS_LIST(state,{viewName,actorList}){
      state.contourActorList[viewName] = actorList
    },
    INIT_PNEUMONIA_RENDER_VIEW(state,v_state){
      const indexs = [0,1,2]
      state.viewMprViews.forEach((view,index) => {
        const originalView = new ViewRenderer();
        originalView.viewIndex = indexs[index]
        originalView.renderer = vtkRenderer.newInstance();
        originalView.image = null
        originalView.sliceMapper = vtkImageMapper.newInstance()
        originalView.sliceActor = vtkImageSlice.newInstance()
        originalView.sliceActor.setMapper(originalView.sliceMapper);
        originalView.renderer.addActor(originalView.sliceActor);
        originalView.renderer.setBackground(...VIEW_COLORS.BACKGROUND);
        view.copyFrom(originalView)
      });
    },
    SET_VIEW_MPR_VIEW(state, {viewIndex, key, value}) {
      state.viewMprViews[viewIndex][key] = value;
    },

    INIT_ALL_VIEW_DATA(state){
      console.log("INIT_ALL_VIEW_DATA",state.allViewData);
      state.allViewData.windowCenter = -500
      state.allViewData.windowWidth = 1500
      state.allViewData.isPan = false
      state.allViewData.layOut = LayoutIcons.MPR;
      state.allViewData.buttons = [ButtonNames.Layout, ButtonNames.Ckcw, ButtonNames.Jbinfo, ButtonNames.Szckx, ButtonNames.Pyms, ButtonNames.Bcj];
      state.allViewData.activeButtons = [ButtonNames.Jbinfo ]
    },
    INIT_PNEUMONIA_ALL_VIEW_DATA(state){
      const originalData = new AllViewData();
      originalData.colorWindow = 1500;
      originalData.colorLevel = -500;
      originalData.isPan = false;
      originalData.layOut = LayoutIcons.MPR;
      // originalData.buttons = [ButtonNames.Layout, ButtonNames.Ckcw, ButtonNames.Jbinfo, ButtonNames.Szckx, ButtonNames.Pyms, ButtonNames.Bcj ];
      originalData.buttons = [ButtonNames.Layout, ButtonNames.Ckcw, ButtonNames.Jbinfo,  ButtonNames.Pyms, ButtonNames.Bcj ];

      originalData.activeButtons = [ButtonNames.Jbinfo ]
      state.allViewData.copyFrom(originalData)
    },
    INIT_PNEUMONIA_VIEW_DATA(state, seriesInfo){
      const originalAxialData = new ViewData();
      originalAxialData.viewIndex = VIEW_TYPES.AXIAL
      originalAxialData.viewName = VIEW_NAMES.AXIAL
      originalAxialData.dimension = seriesInfo.axialCount
      originalAxialData.changedPageIndex = Math.round(seriesInfo.axialCount / 2) + 1
      state.AxialData.copyFrom(originalAxialData)

      const originalCoronalData = new ViewData();
      originalCoronalData.viewIndex = VIEW_TYPES.CORONAL
      originalCoronalData.viewName = VIEW_NAMES.CORONAL
      originalCoronalData.dimension = seriesInfo.coronalCount
      originalCoronalData.changedPageIndex = Math.round(seriesInfo.coronalCount / 2) + 1
      state.CoronalData.copyFrom(originalCoronalData)

      const originalSagittalData = new ViewData();
      originalSagittalData.viewIndex = VIEW_TYPES.SAGITTAL
      originalSagittalData.viewName = VIEW_NAMES.SAGITTAL
      originalSagittalData.dimension = seriesInfo.sagittalCount
      originalSagittalData.changedPageIndex = Math.round(seriesInfo.sagittalCount / 2) + 1
      state.SagittalData.copyFrom(originalSagittalData)



    },
    SET_STATE(state,v_state){
      console.log("保存下来",v_state.allViewData)
      state.allViewData.copyFrom(v_state.allViewData)
      state.CoronalData.copyFrom(v_state.CoronalData)
      state.SagittalData.copyFrom(v_state.SagittalData)
      state.AxialData.copyFrom(v_state.AxialData)

      state.CoronalData.changedPageIndex = state.CoronalData.pageIndex
      state.SagittalData.changedPageIndex = state.SagittalData.pageIndex
      state.AxialData.changedPageIndex = state.AxialData.pageIndex
    }

  },
  actions: {
    async saveModule({commit,rootState}){
      console.log("保存肺炎数据");

      const {lungViewStore} = rootState
      commit("SAVE_MODULE",lungViewStore)

    },
    async InitModule({state,commit,rootState,dispatch},seriesInfo){
      const result = await xhr_queryPneumonia({ computeSeriesId:seriesInfo.computeSeriesId});

      if (result.serviceSuccess) {
        console.log(result.data.resultData)
        commit("SET_PNEUMONIA_INFO",result.data.resultData)
      }
      const {lungViewStore} = rootState

      commit("SAVE_MODULE",lungViewStore)

      commit("INIT_ALL_VIEW_DATA")

      console.log("initPneumonia ok ");

      // const {mprViewStore} = rootState
      // commit("INIT_PNEUMONIA_ALL_VIEW_DATA")
      // commit("INIT_PNEUMONIA_VIEW_DATA",seriesInfo)
      // commit("INIT_PNEUMONIA_RENDER_VIEW",mprViewStore)

    },
    async InitModuleState({state,commit,rootState,dispatch},seriesInfo){
      const result = await xhr_queryPneumonia({ computeSeriesId:seriesInfo.computeSeriesId});

      if (result.serviceSuccess) {
        console.log(result.data.resultData)
        commit("SET_PNEUMONIA_INFO",result.data.resultData)
      }

      const {mprViewStore} = rootState
      commit("INIT_PNEUMONIA_ALL_VIEW_DATA")
      commit("INIT_PNEUMONIA_VIEW_DATA",seriesInfo)
      commit("INIT_PNEUMONIA_RENDER_VIEW",mprViewStore)

    },
    async ActivePneumonia({dispatch,state,rootState,commit}){
      console.log("肺炎");

      await dispatch("lungViewStore/ActiveModule","pneumoniaStore",{root:true})

   },
    async ActivePneumoniaState({dispatch,state,rootState,commit}){
      const {mprViewStore} = rootState

      await dispatch("mprViewStore/clearAllAutoplay",null,{root:true} )

      if(mprViewStore.activedModules.includes("pneumoniaInfoStore")){
        await dispatch("mprViewStore/ActiveModule","pneumoniaInfoStore",{root:true})
      }else{
        await dispatch("mprViewStore/InitModuleView","pneumoniaInfoStore",{root:true})

      }

    },

    async updatePneumoniaLession({state,commit},{pneuid,key,value}){
      console.log({pneuid,key,value})
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
      {pickedPosition,view},
    ) {
      const {mprViewStore} = rootState
      const pickedX = pickedPosition[0];
      const pickedY = pickedPosition[1];

    },
    async UpdateSlice({state,rootState,dispatch},{viewInfo,imageId}){
      console.log("更新肺炎");


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
            console.log("contours.points", points.length);

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

            // const couroursPoints =JSON.parse(contours.points.replace(/\s/g, ''));
            // dispatch("InitContours",{view,contours:couroursPoints})
          }

    },

    // async UpdateSlice(
    //   {commit, dispatch, state,getters},
    //   {viewIndex, index},
    // ) {

    //   const view = state.viewMprViews[viewIndex]
    //   const viewName = getters.viewsData[viewIndex].viewName;

    //   console.log(view.renderer.getActors())
    //   view.renderer.getActors().forEach((actor,index)=>{
    //     if(index>0){
    //       view.renderer.removeActor(actor);
    //     }
    //   })
    //   // view.renderer.getActors()
    //   // view.renderer.get(actor);
    //   console.log("contourActorList",state.contourActorList)
    //   // view.renderer.removeActor(state.contourActorList[0]);
    //   // state.contourActorList.forEach(actor=>{
    //   //   console.log(actor)
    //   //   view.renderer.removeActor(actor);
    //   // })
    //   commit("SET_CONTOURS_LIST",{viewName,actorList:[]})

    //   const contours = state.pneumoniaInfo.pneumoniaContourList.find(
    //     item => item.instanceNumber === index && item.viewName === viewName
    //   );

    //   if(contours){
    //     const couroursPoints =JSON.parse(contours.points.replace(/\s/g, ''));
    //     dispatch("InitContours",{view,contours:couroursPoints})
    //   }

    // },

    async InitContours({state,rootState,dispatch,commit},{view,contours}){

      console.log(view,contours)
      const { mprViewStore } = rootState;
      let boundsZ = view.image.getBounds()[2];
      if (view.viewIndex == 2) {
        boundsZ = view.image.getBounds()[5];
      }
      console.log(view,view.image.getBounds())

      boundsZ = boundsZ -2000

      const actorList = []
      contours.forEach((pointsArray, contourIndex) => {
        // 创建 vtkPoints 实例并动态设置点
        const points = vtkPoints.newInstance();
        points.setNumberOfPoints(pointsArray.length / 2);

        for (let i = 0; i < pointsArray.length; i += 2) {
          const [x, y] = [pointsArray[i], pointsArray[i + 1]];
          const worldPoint = view.image.indexToWorld([x, y, boundsZ]);
          points.setPoint(i / 2, worldPoint[0], worldPoint[1], worldPoint[2]);
        }

        // 创建线的连接
        const lines = vtkCellArray.newInstance();
        const pointIndices = Array.from({ length: pointsArray.length / 2 }, (_, i) => i);
        lines.insertNextCell([pointsArray.length / 2, ...pointIndices]);

        // 设置 polyData 和 mapper
        const polyData = vtkPolyData.newInstance();
        polyData.setPoints(points);
        polyData.setLines(lines);

        const mapper = vtkMapper.newInstance();
        mapper.setInputData(polyData);

        // 创建 actor，设置可见性和其他属性
        const actor = vtkActor.newInstance();
        actor.setVisibility(true); // 根据需要设置可见性条件
        actor.setMapper(mapper);
        actor.getProperty().setColor(1, 0, 0); // 设置颜色
        actor.getProperty().setLineWidth(1); // 设置线宽

        actorList.push(actor)
        console.log("Actor for contour:", contourIndex, actor);
        view.renderer.addActor(actor); // 添加 actor 到渲染器
      });

      commit("SET_CONTOURS_LIST",{viewName:view.viewName,actorList})

      // 刷新视图
      dispatch("mprViewStore/freshView", view.viewIndex, { root: true });

    }




  },
};
