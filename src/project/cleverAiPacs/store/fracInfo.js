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
    INIT_FRAC_RENDER_VIEW(state,v_state){
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
    INIT_FRAC_ALL_VIEW_DATA(state){
      const originalData = new AllViewData();
      originalData.colorWindow = 1500;
      originalData.colorLevel = -500;
      originalData.isPan = false;
      originalData.layOut = LayoutIcons.MPR;
      originalData.buttons = [ButtonNames.Layout, ButtonNames.Ckcw, ButtonNames.Jbinfo, ButtonNames.Szckx, ButtonNames.Pyms];
      originalData.activeButtons = [ButtonNames.Jbinfo,  ]
      state.allViewData.copyFrom(originalData)
    },
    INIT_FRAC_VIEW_DATA(state, seriesInfo) {
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
    async InitModuleState({state,commit,rootState,dispatch},seriesInfo){
      const result = await xhr_queryFrac({ computeSeriesId:seriesInfo.computeSeriesId});
      if (result.serviceSuccess) {
        commit("SET_FRAC_INFO",result.data.resultData)
      }
      await dispatch("mprViewStore/clearAllAutoplay",null,{root:true} )

      const {mprViewStore} = rootState
      commit("INIT_FRAC_ALL_VIEW_DATA")
      commit("INIT_FRAC_VIEW_DATA",seriesInfo)
      commit("INIT_FRAC_RENDER_VIEW",mprViewStore)

    },
    async ActiveFracState({dispatch,state,rootState,commit}){
      await dispatch("mprViewStore/clearAllAutoplay",null,{root:true} )
      const {mprViewStore} = rootState

      if(mprViewStore.activedModules.includes("fracInfoStore")){
        await dispatch("mprViewStore/ActiveModule","fracInfoStore",{root:true})
      }else{
        await dispatch("mprViewStore/InitModuleView","fracInfoStore",{root:true})
        dispatch("InitAnnotations")

      }
    },
    async InitAnnotations({state,rootState,dispatch},computeSeriesId){
      const {mprViewStore} = rootState

      state.viewMprViews.forEach((view, index) => {
        state.fracInfo.fracLesionList.forEach(async (frac) => {
          const annotation = await dispatch("getAnnotationForView", {
            frac,
            viewIndex: view.viewIndex,
          });
          dispatch("addRectangleAnnotation", {
                view,
                annotation,
                bboxindex: frac.id,
              })
        });
        dispatch("mprViewStore/freshView",view.viewIndex,{root:true})
      })

    },
    async updateFracLession({state,commit},{fracid,key,value}){
      const lesion = state.fracInfo.fracLesionList.find(item => item.id === fracid);
      commit("UPDATE_FRAC_LESSION",{fracid,key,value})
      if (lesion) {
       await xhr_updateFracLesion(lesion).then(res=>{
        console.log(res)
       })
    }
    },
    async getAnnotationForView({state,dispatch}, {frac, viewIndex}) {
      const {fracBBox} = frac;
      const [xmin, xmax, ymin, ymax, zmin, zmax] = await dispatch("getBboxIndex",{pointsArray:fracBBox})
      const annotations = {
        [VIEW_TYPES.CORONAL]: {
          xmin: xmin,
          ymin: zmin,
          xmax: xmax,
          ymax: zmax,
          boundsmin: ymin,
          boundsmax: ymax,
        },
        [VIEW_TYPES.AXIAL]: {
          xmin: xmin,
          ymin: ymin,
          xmax: xmax,
          ymax: ymax,
          boundsmin: zmin,
          boundsmax: zmax,
        },
        [VIEW_TYPES.SAGITTAL]: {
          xmin: ymin,
          ymin: zmin,
          xmax: ymax,
          ymax: zmax,
          boundsmin: xmin,
          boundsmax: xmax,
        },
      };
      return annotations[viewIndex];
    },

    async handleMousePress(
      {dispatch, commit, state, getters,rootState},
      {pickedPosition,view},
    ) {

      const {mprViewStore} = rootState
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
      dispatch("mprViewStore/freshView",view.viewIndex,{root:true})

    },


    async UpdateSlice(
      {commit, dispatch, state},
      {viewIndex, index},
    ) {
      state.annotations.value.forEach((annotation) => {
        if (annotation.viewIndex === viewIndex) {
          annotation.actor.setVisibility(
            index >= annotation.boundsmin && index <= annotation.boundsmax,
          );

        }
      });
    },
    getBboxIndex({ commit, state, rootState, dispatch }, { pointsArray }) {
      const { mprViewStore } = rootState;
      const view = state.viewMprViews[2];
      const [x1, y1, z1, x2, y2, z2] = pointsArray.split(",").map(Number);

      const pageIndices = [view.pageIndex, view.pageIndex - 1];
      const [positionz1, positionz2] = pageIndices.map(pageIndex =>
        parseFloat(mprViewStore.seriesInfo.instanceMetadataList.find(item => item.instanceNumber === pageIndex).slicePosition)
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

    addRectangleAnnotation({commit, state,rootState,dispatch}, {view, annotation, bboxindex}) {
      const {mprViewStore} = rootState
      const {xmin, ymin, xmax, ymax, boundsmin, boundsmax} = annotation;
      let boundsZ = view.image.getBounds()[2]
      if(view.viewIndex == 2){
        boundsZ = view.image.getBounds()[5]
      }
      const [worldpoint1, worldpoint2] = [
        view.image.indexToWorld([xmin, ymin, boundsZ]),
        view.image.indexToWorld([xmax, ymax,boundsZ]),
      ];
      const points = vtkPoints.newInstance();
      points.setNumberOfPoints(5);
      points.setPoint(0, worldpoint1[0], worldpoint1[1], worldpoint1[2]);
      points.setPoint(1, worldpoint2[0], worldpoint1[1], worldpoint1[2]);
      points.setPoint(2, worldpoint2[0], worldpoint2[1], worldpoint2[2]);
      points.setPoint(3, worldpoint1[0], worldpoint2[1], worldpoint2[2]);
      points.setPoint(4, worldpoint1[0], worldpoint1[1], worldpoint1[2]);

      const lines = vtkCellArray.newInstance();
      lines.insertNextCell([5, 0, 1, 2, 3, 4]);

      const polyData = vtkPolyData.newInstance();
      polyData.setPoints(points);
      polyData.setLines(lines);

      const mapper = vtkMapper.newInstance();
      mapper.setInputData(polyData);

      const actor = vtkActor.newInstance();
      actor.setVisibility(
        view.pageIndex >= boundsmin && view.pageIndex <= boundsmax,
      );


      actor.setMapper(mapper);
      actor.getProperty().setColor(...BBOX_COLORS.DEFAULT);
      actor.getProperty().setLineWidth(1);

      commit("ADD_ANNOTATION", {
        actor,
        worldpoint1,
        worldpoint2,
        boundsmin,
        boundsmax,
        viewIndex: view.viewIndex,
        bboxIndex: bboxindex,
      });
      view.renderer.addActor(actor);
    },

    /**
     * 结节标记选择
     * @param {number} bboxindex - 结节索引index
     */
    async ChooseAnnotation({state, dispatch, getters, commit,rootGetters},{ bboxindex}) {
      dispatch("mprViewStore/clearAllAutoplay",null,{root:true})
      const viewsData = rootGetters['mprViewStore/viewsData']

      state.fracInfo.fracLesionList.forEach(async (frac) => {
        const {fracBBox, id} = frac;
        const bbox =    await dispatch("getBboxIndex",{pointsArray:fracBBox})

        if (id == bboxindex) {
          const ijk = [
            Math.floor((bbox[0] + bbox[1]) / 2),
            Math.floor((bbox[2] + bbox[3]) / 2),
            Math.floor((bbox[4] + bbox[5]) / 2),
          ];
          state.annotations.value.forEach((anno) => {

            let color = BBOX_COLORS.DEFAULT
            let lineWidth = BBOX_LINEWIDTH.DEFAULT
            if (anno.bboxIndex === bboxindex) {
              commit("ACTIVATE_ANNOTATAION",bboxindex)
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
          viewsData.forEach((viewdata, index) => {
            dispatch("mprViewStore/SetViewData", {
              viewIndex: viewdata.viewIndex,
              key: "changedPageIndex",
              value: ijk[viewdata.viewIndex],
            },{
              root: true,
            },);

          });
          await dispatch("mprViewStore/UpdateIJK", ijk,{root:true});

          viewsData.forEach((viewdata, index) => {
            dispatch("mprViewStore/UpdateDisplay", {
              viewIndex: viewdata.viewIndex,
              changedPageIndex: viewdata.changedPageIndex,
            },{root:true});
          });
        }
      });
    },

  },
};
