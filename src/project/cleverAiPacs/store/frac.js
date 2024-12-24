import { RenderingEngine ,Enums,utilities,metaData,cache,  getRenderingEngine,imageLoader} from '@cornerstonejs/core';
const { transformWorldToIndex,imageToWorldCoords,transformIndexToWorld } = utilities;

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
    const bounds = [xmin,xmax]
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

import {xhr_queryFrac,xhr_updateFracLesion} from "@/api";
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
    // ViewPortData:{
    //   [VIEW_INFO.AXIAL.viewportId]:{
    //     ...VIEW_INFO.AXIAL,
    //     prePresentation:null,
    //     preImage:null,
    //     ...new ViewData()},
    //   [VIEW_INFO.SAGITTAL.viewportId]:{
    //     ...VIEW_INFO.SAGITTAL,
    //     prePresentation:null,
    //     preImage:null,
    //     ...new ViewData()},
    //   [VIEW_INFO.CORONAL.viewportId]:{
    //     ...VIEW_INFO.CORONAL,
    //     prePresentation:null,
    //     preImage:null,
    //     ...new ViewData()}
    // },
    // allViewData: new AllViewData(),
    ViewPortData:{

    },
    allViewData: {},
    activeIJK:new Array(3),
    fracLesionList:[],



    isload:false,

    viewMprViews: Array.from({length: 3}, () => (new ViewRenderer)),

    CoronalData: new ViewData,
    AxialData: new ViewData,
    SagittalData: new ViewData,
    fracInfo: {
      computeSeriesId:null,
      hasLesion: false,
      fracLesionList:[],
      seriesId:null,
      seriesInstanceUid:null,
      studyId:null,
      studyInstanceUid:null

    },

    annotations: {value: [], index: new Set()},
    picker: vtkPicker.newInstance(),

    animationIds: Array.from({length: 3}, () => ({
      viewIndex: null,
      animationId: null,
    })),

    allViewData:new AllViewData,
    selectedFracId:null

  },
  getters: {
    viewsData: (state) => [
      state.SagittalData,
      state.CoronalData,
      state.AxialData,
    ],
  },
  mutations: {
    SET_LESSION_LIST(state,list){
        state.fracLesionList = list
    },
    SAVE_MODULE(state,lungViewStore){
      const {ViewPortData,renderingEngineId,allViewData,activeIJK} =  lungViewStore
       console.log("allViewData",allViewData);

       state.allViewData = JSON.parse(JSON.stringify(allViewData));
       state.ViewPortData = JSON.parse(JSON.stringify(ViewPortData));
       state.activeIJK = activeIJK

      const renderingEngine = getRenderingEngine(renderingEngineId);

      const viewportEntries = Object.values(ViewPortData);
      // cache.purgeCache()
      viewportEntries.map(async (viewInfo) =>{
        const viewport = renderingEngine.getViewport(
          viewInfo.viewportId
        )
        const presentation = viewport.getViewPresentation()
        state.ViewPortData[viewInfo.viewportId].prePresentation  = presentation
        state.ViewPortData[viewInfo.viewportId].imageId = viewInfo.imageId
        // console.log("保存",viewInfo.imageId);
        state.ViewPortData[viewInfo.viewportId].camera = viewport.getCamera()
        state.ViewPortData[viewInfo.viewportId].prop = viewport.getProperties()

        //  console.log("保存",viewInfo.imageId);
        // console.log("viewport.getCamera()",viewport.getCamera());
        await imageLoader.loadAndCacheImage(viewInfo.imageId)
        // state.ViewPortData[viewInfo.viewportId].preImage = viewport.getImageData()

      })

    },

    SET_FRAC_INFO(state, fracInfo) {
      console.log("fracInfo=======",fracInfo)
      state.fracInfo = fracInfo;


    },

    ADD_ANNOTATION(state, annotation) {
      state.annotations.value.push(annotation);
      state.annotations.index.add(
        `${annotation.viewIndex}-${annotation.bboxIndex}`,
      );
    },
    ACTIVATE_ANNOTATAION(state,index){
      state.selectedFracId = index
    },
    UPDATE_FRAC_LESSION(state,{fracid,key,value}){
      const lesion = state.fracInfo.fracLesionList.find(item => item.id === fracid);
      if (lesion) {
          lesion[key] = value;
      }

    },

    SET_VIEW_MPR_VIEW(state, {viewIndex, key, value}) {
      state.viewMprViews[viewIndex][key] = value;
    },
    INIT_ALL_VIEW_DATA(state){
      console.log("INIT_ALL_VIEW_DATA",state.allViewData);
      state.allViewData.windowCenter = 300
      state.allViewData.windowWidth = 1500
      state.allViewData.rotate = 0

      state.allViewData.isPan = false
      state.allViewData.invert = false
      state.allViewData.flipHorizontal = false
      state.allViewData.flipVertical = false
      state.allViewData.zoomView = false

      state.allViewData.layOut = LayoutIcons.MPR;
      state.allViewData.buttons = [ButtonNames.Layout, ButtonNames.Ckcw, ButtonNames.Jbinfo, ButtonNames.Szckx, ButtonNames.Pyms, ButtonNames.Bcj];
      state.allViewData.activeButtons = [ButtonNames.Jbinfo ]
    },


  },
  actions: {
    async saveModule({commit,rootState}){
      console.log("保存骨折数据");

      const {lungViewStore} = rootState
      commit("SAVE_MODULE",lungViewStore)

    },
    async InitModule({state,commit,rootState,dispatch},seriesInfo){
      const result = await xhr_queryFrac({ computeSeriesId:seriesInfo.computeSeriesId});
      if (result.serviceSuccess) {
        commit("SET_FRAC_INFO",result.data.resultData)
      }
      const {lungViewStore} = rootState
      const {ViewPortData,renderingEngineId} = lungViewStore

      const renderingEngine = getRenderingEngine(renderingEngineId);


      commit("SAVE_MODULE",lungViewStore)
      commit("INIT_ALL_VIEW_DATA")
      console.log("initFrac ok ");
      console.log("ViewPortData",ViewPortData['STACK_AXIAL'].imageId);

      const viewport = renderingEngine.getViewport(
        "STACK_AXIAL"
      )
      const image = viewport?.getImageData()


      if(image){
        const {voxelManager,imageData} = image

        const view = ViewPortData["STACK_AXIAL"]

        const lessionList = []
        state.fracInfo.fracLesionList.forEach((frac)=>{
          const points = frac.fracBBox
          const [x1, y1, z1, x2, y2, z2] = points.split(",").map(Number);
          const point1 = [x1, y1, z1]
          const point2 = [x2, y2, z2]
          const ijk = transformWorldToIndex(imageData,point1);
          console.log("ijk",ijk);

          const pageIndices = [view.pageIndex, view.pageIndex - 1];
          const [positionz1, positionz2] = pageIndices.map(pageIndex =>
            parseFloat(lungViewStore.seriesInfo.instanceMetadataList.find(item => item.viewIndex === pageIndex).slicePosition)
          );

          const calculateZIndex = z => pageIndices[0] - (pageIndices[0] - pageIndices[1]) * (positionz1 - z) / (positionz1 - positionz2);
          const bbox1 =  transformWorldToIndex(imageData,[-x1, -y1, 0]);
          const bbox2 = transformWorldToIndex(imageData,[-x2, -y2, 0]);

          const pointsStr = [
            Math.min(bbox1[0], bbox2[0]), Math.max(bbox1[0], bbox2[0]),
            Math.min(bbox1[1], bbox2[1]), Math.max(bbox1[1], bbox2[1]),
            Math.min(calculateZIndex(z1), calculateZIndex(z2)), Math.max(calculateZIndex(z1), calculateZIndex(z2))
          ].join(",")

          lessionList.push({points:pointsStr,id:frac.id})
          console.log(frac.id,"bbox",pointsStr);
        })
        console.log("lessionList",lessionList);

        commit("SET_LESSION_LIST",lessionList)
      }


    },

    async ActiveFrac({dispatch,state,rootState,commit}){
      console.log("骨折");
      // const renderingEngineId = "myRenderingEngine"
      // const renderingEngine = getRenderingEngine(renderingEngineId);

      // const viewport = renderingEngine.getViewport(
      //   'STACK_AXIAL'
      // )
      // viewport.setProperties({ invert:true});
      await dispatch("lungViewStore/ActiveModule","fracStore",{root:true})

   },

    async updateFracLesion({state,commit},{fracid,key,value}){
      const lesion = state.fracInfo.fracLesionList.find(item => item.id === fracid);
      commit("UPDATE_FRAC_LESSION",{fracid,key,value})
      if (lesion) {
       await xhr_updateFracLesion(lesion).then(res=>{
        console.log(res)
       })
    }
    },

    async handleMousePress(
      {dispatch, commit, state, getters,rootState},
      {viewportId,pointIjk},
    ) {
      console.log("trueijk",pointIjk);

      const frac = state.fracLesionList.find((frac) => {
        const points = frac.points
        const [xmin, xmax, ymin, ymax, zmin, zmax] = points.split(",").map(Number);
        const [pointx,pointy,pointz] = pointIjk

        const isWithinRange = (
          pointx >= xmin && pointx <= xmax &&
          pointy >= ymin && pointy <= ymax &&
          pointz >= zmin && pointz <= zmax
      );
         if(isWithinRange){
            commit("ACTIVATE_ANNOTATAION", frac.id);
            const {lungViewStore} = rootState
            const {ViewPortData} = lungViewStore

            const viewInfo = ViewPortData[viewportId]

            dispatch("UpdateSlice",{viewInfo:ViewPortData[viewportId],imageId:ViewPortData[viewportId].imageId})
            cornerstoneTools.utilities.triggerAnnotationRenderForViewportIds([
                        viewportId
                      ]);
                      // viewport.render()

         }


      });




    },
    async UpdateSlice({state,rootState,dispatch},{viewInfo,imageId}){
      console.log("state.fracLesionList",state.fracLesionList);

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

      state.fracLesionList?.forEach((frac)=>{
        const points = frac.points
        const result = getImagePoint(points)

         const {pointsList,bounds} =  result

        if(pageIndex >= bounds[0] && pageIndex <= bounds[1]){

          const worldPoints = pointsList.map((point,index)=>{
            return imageData.indexToWorld([...point,0]);
          })
          const annotationUID =   utilities.uuidv4()
          const options = {annotationUID,type:'lessionAnno',viewportId,pageIndex:pageIndex,id:frac.id}
          dispatch("lungViewStore/customDrawSpline", { viewInfo,points:worldPoints,options },{root:true} );
          const styles = {
              color: frac.id == state.selectedFracId?'rgb(255, 255, 0)' :'rgb(0, 0, 255)'
          };
          annotation.config.style.setAnnotationStyles( annotationUID, styles);
        }
      })


    },

    getBboxIndex({ commit, state, rootState, dispatch }, { pointsArray }) {
      const { mprViewStore } = rootState;
      const view = state.viewMprViews[2];
      const [x1, y1, z1, x2, y2, z2] = pointsArray.split(",").map(Number);

      const pageIndices = [view.pageIndex, view.pageIndex - 1];
      const [positionz1, positionz2] = pageIndices.map(pageIndex =>
        parseFloat(mprViewStore.seriesInfo.instanceMetadataList.find(item => item.viewIndex === pageIndex).slicePosition)
      );

      const calculateZIndex = z => pageIndices[0] - (pageIndices[0] - pageIndices[1]) * (positionz1 - z) / (positionz1 - positionz2);
      const bbox1 = view.image.worldToIndex([-x1, -y1, 0]);
      const bbox2 = view.image.worldToIndex([-x2, -y2, 0]);

      return [
        Math.min(bbox1[0], bbox2[0]), Math.max(bbox1[0], bbox2[0]),
        Math.min(bbox1[1], bbox2[1]), Math.max(bbox1[1], bbox2[1]),
        Math.min(calculateZIndex(z1), calculateZIndex(z2)), Math.max(calculateZIndex(z1), calculateZIndex(z2))
      ];
    },

    async ChooseAnnotation({state, dispatch, getters, commit,rootGetters},{ bboxindex}) {
      console.log("ChooseAnnotation",bboxindex,state.fracLesionList);

      dispatch("lungViewStore/clearAllAutoplay",null,{root:true})

      const frac = state.fracLesionList.find((item) => item.id === bboxindex);
      if (frac) {
        const { points, id } = frac;
        console.log("id",id);
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
