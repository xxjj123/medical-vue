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
      const bounds = [ymin,ymax]
      return {pointsList,bounds}
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

const coordinate = vtkCoordinate.newInstance();
import {
  xhr_queryNodule,xhr_queryOperate,xhr_updateNoduleLesion,xhr_saveOperate
} from "@/api";

const VIEW_INFO = {
  AXIAL: {
    viewportId: 'STACK_AXIAL',
    viewName: 'axial',
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
    ijkId:0,

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
    noduleInfo: {},


    isload:false,

    viewMprViews: Array.from({length: 3}, () => (new ViewRenderer)),

    CoronalData: new ViewData,
    AxialData: new ViewData,
    SagittalData: new ViewData,
    noduleInfo: {
      computeSeriesId:null,
      studyId:null,
      seriesId:null,
      seriesInstanceUid:null,
      hasLesion: false,
      studyInstanceUid:null,
      imageCount:null,
      noduleLesionList:[],

    },
    operateInfo:{
      computeSeriesId:null,
      lesionOrderType:null,
      riskFilter:null,
      typeFilter :null,
      majorAxisSelectFilter :null,
      majorAxisScopeFilter :null,
      findingOrderType :null,
      diagnosisType:null
    },

    annotations: {value: [], index: new Set()},
    picker: vtkPicker.newInstance(),

    animationIds: Array.from({length: 3}, () => ({
      viewIndex: null,
      animationId: null,
    })),

    selectedNoduleId:null

  },
  getters: {
    viewsData: (state) => [
      state.SagittalData,
      state.CoronalData,
      state.AxialData,
    ],
  },
  mutations: {
    SET_NODULE_INFO(state, noduleInfo) {
      console.log("noduleInfo=======",noduleInfo)
      state.noduleInfo = noduleInfo;
    },
    SET_OPERATE_INFO(state, operateInfo) {
      console.log("operateInfo=======",operateInfo)
      state.operateInfo = operateInfo;
    },
    SAVE_MODULE(state,lungViewStore){
      const {ViewPortData,renderingEngineId,allViewData } =  lungViewStore
      state.allViewData = JSON.parse(JSON.stringify(allViewData));
      state.ViewPortData = JSON.parse(JSON.stringify(ViewPortData));


      console.log("save",ViewPortData);


      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewportEntries = Object.values(ViewPortData);

      viewportEntries.map((viewInfo) =>{
        const viewport = renderingEngine.getViewport(
          viewInfo.viewportId
        )
        console.log(viewport.getImageData());

        const presentation = viewport.getViewPresentation()
        state.ViewPortData[viewInfo.viewportId].prePresentation  = presentation
        // state.ViewPortData[viewInfo.viewportId].preImage = viewport.getImageData()
      })

    },

    ADD_ANNOTATION(state, annotation) {
      state.annotations.value.push(annotation);
      state.annotations.index.add(
        `${annotation.viewIndex}-${annotation.bboxIndex}`,
      );
    },
    ACTIVATE_ANNOTATAION(state,index){
      state.selectedNoduleId = index
    },

    INIT_NODULE_RENDER_VIEW(state,v_state){
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
      state.allViewData.invert = false
      state.allViewData.isPan = false

      state.allViewData.layOut = LayoutIcons.AXIAL;
      state.allViewData.buttons = [ButtonNames.Layout, ButtonNames.Ckcw, ButtonNames.Jbinfo, ButtonNames.Szckx, ButtonNames.Pyms, ButtonNames.Bcj];
      state.allViewData.activeButtons = [ButtonNames.Jbinfo ]

    },
    INIT_NODULE_ALL_VIEW_DATA(state){
      const originalData = new AllViewData();
      originalData.colorWindow = 1500;
      originalData.colorLevel = -500;
      originalData.isPan = false;
      originalData.layOut = LayoutIcons.AXIAL;
      originalData.buttons = [ButtonNames.Layout, ButtonNames.Ckcw, ButtonNames.Jbinfo, ButtonNames.Szckx, ButtonNames.Pyms, ButtonNames.Bcj];
      originalData.activeButtons = [ButtonNames.Jbinfo,  ]
      state.allViewData.copyFrom(originalData)
    },
    INIT_NODULE_VIEW_DATA(state, seriesInfo) {
      const viewTypes = [VIEW_TYPES.AXIAL, VIEW_TYPES.CORONAL, VIEW_TYPES.SAGITTAL];
      const viewNames = [VIEW_NAMES.AXIAL, VIEW_NAMES.CORONAL, VIEW_NAMES.SAGITTAL];
      const viewDatas = ["AxialData","CoronalData", "SagittalData"]
      const dimensions = [seriesInfo.axialCount, seriesInfo.coronalCount, seriesInfo.sagittalCount];

      viewTypes.forEach((viewType, index) => {
          const originalData = new ViewData();
          originalData.viewIndex = viewType;
          originalData.viewName = viewNames[index];
          originalData.dimension = dimensions[index];
          originalData.changedPageIndex = Math.round(dimensions[index] / 2) + 1;

          state[viewDatas[index]].copyFrom(originalData);
      });
  },
  UPDATE_NODULE_OPERATE(state,{updateList}){
    updateList.forEach(item=>{
      const {key,value} = item
      state.operateInfo[key] = value;

    })
  },
  UPDATE_NODULE_LESSION(state,{noduleid,updateList}){
    const lesion = state.noduleInfo.noduleLesionList.find(item => item.id === noduleid);
    if (lesion) {
      updateList.forEach(item=>{
        const {key,value} = item
        lesion[key] = value;

      })
    }

  },
    SET_STATE(state,v_state){
      console.log("保存下来1",v_state.allViewData)
      state.allViewData.copyFrom(v_state.allViewData)
      state.CoronalData.copyFrom(v_state.CoronalData)
      state.SagittalData.copyFrom(v_state.SagittalData)
      state.AxialData.copyFrom(v_state.AxialData)

      state.CoronalData.changedPageIndex = state.CoronalData.pageIndex
      state.SagittalData.changedPageIndex = state.SagittalData.pageIndex
      state.AxialData.changedPageIndex = state.AxialData.pageIndex
    },

  },
  actions: {
    async saveModule({commit,rootState}){
      console.log("保存结节数据");

      const {lungViewStore} = rootState
      commit("SAVE_MODULE",lungViewStore)

    },
    async InitModule({state,rootState,commit,dispatch},seriesInfo){
      const operatequery = await xhr_queryOperate({ computeSeriesId:seriesInfo.computeSeriesId});
      const nodulequery = await xhr_queryNodule({ computeSeriesId:seriesInfo.computeSeriesId});
      console.log(operatequery)
      if (nodulequery.serviceSuccess && operatequery) {
        commit("SET_NODULE_INFO",nodulequery.data.resultData)
        commit("SET_OPERATE_INFO",operatequery.data.resultData)
      }
      const {lungViewStore} = rootState
      // const {ViewPortData,renderingEngineId,allViewData } =  lungViewStore
      // const renderingEngine = getRenderingEngine(renderingEngineId);
      // const viewport = renderingEngine.getViewport(
      //   viewInfo.viewportId
      // )
      commit("SAVE_MODULE",lungViewStore)
      commit("INIT_ALL_VIEW_DATA")

      console.log("initNodule ok ");

    },
    async InitModuleState({state,commit,rootState,dispatch},seriesInfo){
      const operatequery = await xhr_queryOperate({ computeSeriesId:seriesInfo.computeSeriesId});
      const nodulequery = await xhr_queryNodule({ computeSeriesId:seriesInfo.computeSeriesId});
      console.log(operatequery)
      if (nodulequery.serviceSuccess && operatequery) {
        commit("SET_NODULE_INFO",nodulequery.data.resultData)
        commit("SET_OPERATE_INFO",operatequery.data.resultData)
      }
      await dispatch("lungViewStore/clearAllAutoplay",null,{root:true} )

      const {lungViewStore} = rootState
      commit("INIT_NODULE_ALL_VIEW_DATA")
      commit("INIT_NODULE_VIEW_DATA",seriesInfo)
      commit("INIT_NODULE_RENDER_VIEW",lungViewStore)

    },
    async ActiveNodule({dispatch,state,rootState,commit}){
      console.log("触发了结节");

       await dispatch("lungViewStore/ActiveModule","noduleStore",{root:true})

    },
    async ActiveNoduleState({dispatch,state,rootState,commit}){
      await dispatch("lungViewStore/clearAllAutoplay",null,{root:true} )
      const {lungViewStore} = rootState



      if(lungViewStore.activedModules.includes("noduleStore")){
        await dispatch("lungViewStore/ActiveModule","noduleStore",{root:true})
      }else{
        await dispatch("lungViewStore/InitModuleView","noduleStore",{root:true})
        dispatch("InitAnnotations")

      }
    },
    // UpdateSliceNodule

    async UpdateSlice({state,rootState,dispatch},{viewInfo,imageId}){
      const {lungViewStore} = rootState

      const {viewportId, pageIndex} =  viewInfo

      const { renderingEngineId,toolGroupId} = lungViewStore
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
         viewportId
      )
      const image = viewport?.getImageData()
      const {voxelManager,imageData} = image

      const {getImagePoint} = VIEW_METHOD[viewportId]

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

      state.noduleInfo.noduleLesionList?.forEach((nodule)=>{
        const points = nodule.points
        const result = getImagePoint(points)
         const {pointsList,bounds} =  result

        if(pageIndex >= bounds[0] && pageIndex <= bounds[1]){
          console.log("绘制",viewportId,);

          const worldPoints = pointsList.map((point,index)=>{
            return imageData.indexToWorld([...point,0]);
          })
          const annotationUID =   utilities.uuidv4()
          const options = {annotationUID,type:'lessionAnno',viewportId,pageIndex:pageIndex,id:nodule.id}
          dispatch("lungViewStore/customDrawSpline", { viewInfo,points:worldPoints,options },{root:true} );
          const styles = {
            color: nodule.id == state.selectedNoduleId?'rgb(255, 255, 0)' :'rgb(0, 0, 255)'
          };
          annotation.config.style.setAnnotationStyles( annotationUID, styles);
        }
      })
    },

    async handleMousePress(
      {dispatch, commit, state, getters,rootState},
      {pickedPosition,view},
    ) {

      const {lungViewStore} = rootState
      const pickedX = pickedPosition[0];
      const pickedY = pickedPosition[1];

      state.annotations.value.forEach((annotation) => {
        if (annotation.viewIndex === view.viewIndex) {
          if (
            view.pageIndex >= annotation.boundsmin &&
            view.pageIndex <= annotation.boundsmax &&
            annotation.worldpoint1[0] <= pickedX &&
            annotation.worldpoint2[0] >= pickedX &&
            annotation.worldpoint1[1] <= pickedY &&
            annotation.worldpoint2[1] >= pickedY
          ) {
            const selectedAnnotation = annotation.bboxIndex;
            state.annotations.value.forEach((anno) => {
              let color = BBOX_COLORS.DEFAULT
              let lineWidth = BBOX_LINEWIDTH.DEFAULT
              if (anno.bboxIndex == selectedAnnotation) {
                commit("ACTIVATE_ANNOTATAION",selectedAnnotation)
                color = BBOX_COLORS.SELECTED
                lineWidth = BBOX_LINEWIDTH.SELECTED
              }
              anno.actor
                .getProperty()
                .setColor(
                  ...color
                )
              anno.actor.getProperty().setLineWidth(lineWidth);

            });
          }
        }
      });
      dispatch("lungViewStore/freshView",view.viewIndex,{root:true})

    },

    async updateNoduleOperate({state,commit},{updateList}){
      commit("UPDATE_NODULE_OPERATE",{updateList})
       await xhr_saveOperate(state.operateInfo).then(res=>{
        // console.log(res)
       })

    },

    async updateNoduleLesion({state,commit},{noduleid,updateList}){
      console.log("updateNoduleLesion",noduleid,updateList)
      const lesion = state.noduleInfo.noduleLesionList.find(item => item.id === noduleid);

      commit("UPDATE_NODULE_LESSION",{noduleid,updateList})
      if (lesion) {
       await xhr_updateNoduleLesion(lesion).then(res=>{
        // console.log(res)
       })
    }
    },


    /**
     * 结节标记选择
     * @param {number} bboxindex - 结节索引index
     */
    async ChooseAnnotation({state, dispatch, getters, commit,rootGetters},{currentim,bboxindex}) {
      dispatch("lungViewStore/clearAllAutoplay",null,{root:true})

      const nodule = state.noduleInfo.noduleLesionList.find((nodule) => nodule.id === bboxindex);
      if (nodule) {
        const { points, id } = nodule;
        commit("ACTIVATE_ANNOTATAION", id);

        const bbox = points.split(",").map(Number);
        const ijk = [
          Math.floor((bbox[0] + bbox[1]) / 2),
          Math.floor((bbox[2] + bbox[3]) / 2),
          Math.floor((bbox[4] + bbox[5]) / 2),
        ];

        await dispatch("lungViewStore/UpdateIJK", ijk, { root: true });
      }


    },

  },
};
