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


function GetTureIJK({viewType, ijk}) {
  const newijkMap = {
    [VIEW_TYPES.AXIAL]: [ijk[0], ijk[1], ""],
    [VIEW_TYPES.SAGITTAL]: ["", ijk[0], ijk[1]],
    [VIEW_TYPES.CORONAL]: [ijk[0], "", ijk[1]],
  };
  return newijkMap[viewType];
}

const initialViewData = {
  viewIndex: null,
  viewName: null,
  pageIndex: null,
  dimension: null,
  changedPageindex: null,
  displayX: null,
  displayY: null,
  scaleLength: null,
  Ww: null,
  Wl: null,
  reversed: false,
  cameraRotate: 0,
  hu: "",
};

export default {
  namespaced: true,
  state: {
    isload:false,
    // 选中行study信息，用于提取tags相关信息用
    studies_selected: {},
    /**
     * { [computeSeriesId] : [] ,...}
     *
     */
    series_map_dicom: {},
    seriesInfo: {
      seriesId: "",
      axialCount: "",
      coronalCount: "",
      sagittalCount: "",
      imageCount: "",
    },
    viewMprViews: Array.from({length: 3}, () => ({
      viewIndex: null,
      viewName: null,
      view: null,
      pageIndex: null,
      dimension: null,
    })),
    CoronalData: { ...initialViewData },
    AxialData: { ...initialViewData },
    SagittalData: { ...initialViewData },
    noduleInfo: {},

    annotations: {value: [], index: new Set()},
    picker: vtkPicker.newInstance(),
    mouseDown: false,
    autoPlayStates: Array.from({length: 3}, () => ({
      isPlay:false,
      isAutoPlay:false,
      viewIndex: null,
      timerId: null,
      animationId:null,
    })),
    animationIds: Array.from({length: 3}, () => ({
      viewIndex: null,
      animationId: null,
    })),


    noduleDiagnoseState:{
      colorWindow:null,
      colorLevel:null,
      isPan:false
    },
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
    UPDATE_AUTOPLAY_STATUS(state, { viewIndex, updates}){
      const autoPlayState = state.autoPlayStates[viewIndex];
        Object.keys(updates).forEach(key => {
          autoPlayState[key] = updates[key];
        });
    },
    CLEAR_AUTOPLAY(state, viewIndex) {
      console.log("CLEAR_AUTOPLAY")
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
    SET_STUDIES_SELECTED(state, payload) {
      state.studies_selected = payload;
    },
    SET_SERIES_MAP_DICOM(state, payload) {
      state.series_map_dicom = payload;
    },
    SET_SERIES_INFO(state, seriesInfo) {
      state.seriesInfo = seriesInfo;
    },
    SET_NODULE_INFO(state, noduleInfo) {
      state.noduleInfo = noduleInfo;
      state.noduleInfo.focalDetailList = []

    },

    INIT_VIEW_MPR_VIEW(state, {viewType, data}) {
      state.viewMprViews[viewType] = data;
    },
    SET_VIEW_MPR_VIEW(state, {viewType, key, value}) {
      state.viewMprViews[viewType][key] = value;
    },
    SET_VIEW_DATA(state, {viewType, key, value}) {
      const viewName = VIEWDATA_NAMES[viewType];
      if (!state[viewName]) {
        state[viewName] = {};
      }

      state[viewName][key] = value;
    },

    SET_MOUSE_DOWN(state, value) {
      state.mouseDown = value;
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

    SET_NODULE_DIAGNOSE_DATA(state, { key, value}) {
      state.noduleDiagnoseState[key] = value;
    },
    RESET_STATE(state){
      state.isload = false;
      state.studies_selected = {};
      state.series_map_dicom = {};
      state.seriesInfo = {
        seriesId: "",
        axialCount: "",
        coronalCount: "",
        sagittalCount: "",
        imageCount: "",
      };
      state.viewMprViews = Array.from({length: 3}, () => ({
        viewIndex: null,
        viewName: null,
        view: null,
        pageIndex: null,
        dimension: null,
      }));
      state.CoronalData = {
        viewIndex: null,
        viewName: null,
        pageIndex: null,
        dimension: null,
        changedPageindex: null,
        displayX: null,
        displayY: null,
        scaleLength: null,
        Ww: null,
        Wl: null,
        reversed: false,
        cameraRotate: 0,
        hu: "",
      };
      state.AxialData = { ...state.CoronalData };
      state.SagittalData = { ...state.CoronalData };
      state.noduleInfo = {};
      state.annotations = { value: [], index: new Set() };
      state.mouseDown = false;
      state.autoPlayStates = Array.from({ length: 3 }, () => ({
        isPlay: false,
        isAutoPlay: false,
        viewIndex: null,
        timerId: null,
        animationId: null,
      }));
      state.animationIds = Array.from({ length: 3 }, () => ({
        viewIndex: null,
        animationId: null,
      }));
      state.noduleDiagnoseState = {
        colorWindow: null,
        colorLevel: null,
        isPan: false,
      };
      state.selectedNoduleId = null;

    }

  },
  actions: {
    async InitView(
      {dispatch, commit, state},
      {container, viewName, viewType},
    ) {
      const data = await dispatch("InitMprView", {
        container,
      });

      commit("INIT_VIEW_MPR_VIEW", {
        viewType,
        data: {
          viewIndex: viewType,
          viewName,
          view: data,
        },
      });

      commit("SET_VIEW_DATA", {viewType, key: "viewName", value: viewName});
      commit("SET_VIEW_DATA", {viewType, key: "viewIndex", value: viewType});
    },
    async InitMprView({dispatch, commit}, {container, mode}) {

      const grw = vtkGenericRenderWindow.newInstance();
      grw.setContainer(container);
      const {width, height} = container.getBoundingClientRect();
      grw.resize(width, height);

      const interactorstyle = vtkInteractorStyleImage.newInstance();
      interactorstyle.setInteractionMode("IMAGE2D");

      const obj = {
        grw,
        // viewMode: mode,
        index: null,
        image: null,
        renderWindow: grw.getRenderWindow(),
        renderer: grw.getRenderer(),
        interactor: grw.getInteractor(),
        sliceMapper: vtkImageMapper.newInstance(),
        sliceActor: vtkImageSlice.newInstance(),
      };

      obj.renderer.setBackground(...VIEW_COLORS.BACKGROUND);
      obj.renderWindow.addRenderer(obj.renderer);
      obj.renderWindow.setInteractor(obj.interactor);
      obj.interactor.initialize();
      obj.interactor.bindEvents(container);
      obj.interactor.setInteractorStyle(interactorstyle);
      obj.interactor.getInteractorStyle().modified();
      obj.interactor.onLeftButtonPress(()=>{
        obj.interactor.getInteractorStyle().endWindowLevel()
      })
      obj.sliceActor.setMapper(obj.sliceMapper);
      obj.renderer.addActor(obj.sliceActor);

      return obj;
    },

    async InitAxialView({dispatch}, container) {
      await dispatch("InitView", {
        container,
        viewName: VIEW_NAMES.AXIAL,
        viewType: VIEW_TYPES.AXIAL,
        // slicingMode: vtkImageMapper.SlicingMode.K,
      });
    },
    async InitCoronalView({dispatch}, container) {
      await dispatch("InitView", {
        container,
        viewName: VIEW_NAMES.CORONAL,
        viewType: VIEW_TYPES.CORONAL,
        // slicingMode: vtkImageMapper.SlicingMode.I,
      });
    },
    async InitSagittalView({dispatch}, container) {
      await dispatch("InitView", {
        container,
        viewName: VIEW_NAMES.SAGITTAL,
        viewType: VIEW_TYPES.SAGITTAL,
        // slicingMode: vtkImageMapper.SlicingMode.J,
      });
    },

    async InitSlice({dispatch, state, getters, commit}) {
      const dimensions = new Array(3);
      dimensions[VIEW_TYPES.SAGITTAL] = state.seriesInfo.sagittalCount;
      dimensions[VIEW_TYPES.CORONAL] = state.seriesInfo.coronalCount;
      dimensions[VIEW_TYPES.AXIAL] = state.seriesInfo.axialCount;

      const ijk = dimensions.map((d) => Math.round(d / 2) + 1);

      ijk.forEach((item, index) => {
        commit("SET_VIEW_MPR_VIEW", {
          viewType: index,
          key: "dimension",
          value: dimensions[index],
        });

        if (item <= 0) {
          item = 1;
        } else if (item > state.viewMprViews[index].dimension) {
          item = state.viewMprViews[index].dimension;
        }
        commit("SET_VIEW_DATA", {
          viewType: index,
          key: "changedPageindex",
          value: item,
        });
      });
      try {
        await dispatch("UpdateIJK", ijk);
        state.viewMprViews.forEach((view, index) => {
          dispatch("setupInteractor", {view, dimensions});
          console.log("state.noduleInfo.noduleLesionList",state.noduleInfo.noduleLesionList)
          state.noduleInfo.noduleLesionList.forEach(async (nodule) => {
            console.log("nodule",nodule)
            const annotation = await dispatch("getAnnotationForView", {
              nodule,
              viewType: view.viewIndex,
            });
            requestAnimationFrame(() =>
              dispatch("addRectangleAnnotation", {
                view,
                annotation,
                bboxindex: nodule.id,
              }),
            );
          });
          const point1 = [1, 0, 0];
          const point2 = [2, 0, 0];

          coordinate.setValue(...point1);
          const [point1x] = coordinate.getComputedDoubleDisplayValue(
            view.view.renderer,
          );
          coordinate.setValue(...point2);

          const [point2x] = coordinate.getComputedDoubleDisplayValue(
            view.view.renderer,
          );

          commit("SET_VIEW_DATA", {
            viewType: view.viewIndex,
            key: "scaleLength",
            value: Math.abs(point2x - point1x),
          });
        });
        await dispatch("UpdateIJK", ijk);
        ijk.forEach((item, index) => {
          dispatch("UpdateDisplay", {
            viewType: index,
            changedPageIndex: item,
          });
        });
      } catch (err) {
        console.log(err);
      }
    },
    getAnnotationForView({state}, {nodule, viewType}) {
      const {points} = nodule;

      const [xmin, xmax, ymin, ymax, zmin, zmax] = points.split(",").map(Number);
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
      return annotations[viewType];
    },
    UpdateDisplay({commit, state, dispatch}, {viewType, changedPageIndex}) {
      let pagex;
      let pagey;
      if (viewType == VIEW_TYPES.SAGITTAL) {
        pagex = changedPageIndex;
        pagey = state.CoronalData.changedPageindex;
        dispatch("UpdateDisplayValue", {
          changedViewType: VIEW_TYPES.AXIAL,
          pagex,
          pagey,
        });

        pagex = changedPageIndex;
        pagey = state.AxialData.changedPageindex;
        dispatch("UpdateDisplayValue", {
          changedViewType: VIEW_TYPES.CORONAL,
          pagex,
          pagey,
        });
      } else if (viewType == VIEW_TYPES.CORONAL) {
        pagex = state.SagittalData.changedPageindex;
        pagey = changedPageIndex;
        dispatch("UpdateDisplayValue", {
          changedViewType: VIEW_TYPES.AXIAL,
          pagex,
          pagey,
        });

        pagex = changedPageIndex;
        pagey = state.AxialData.changedPageindex;
        dispatch("UpdateDisplayValue", {
          changedViewType: VIEW_TYPES.SAGITTAL,
          pagex,
          pagey,
        });
      } else if (viewType == VIEW_TYPES.AXIAL) {
        pagex = state.SagittalData.changedPageindex;
        pagey = changedPageIndex;
        dispatch("UpdateDisplayValue", {
          changedViewType: VIEW_TYPES.CORONAL,
          pagex,
          pagey,
        });

        pagex = state.CoronalData.changedPageindex;
        pagey = changedPageIndex;
        dispatch("UpdateDisplayValue", {
          changedViewType: VIEW_TYPES.SAGITTAL,
          pagex,
          pagey,
        });
      }
    },
    UpdateDisplayValue({commit, state}, {changedViewType, pagex, pagey}) {
      const view = state.viewMprViews[changedViewType].view;
      if(view && view.image){
          const world = view.image.indexToWorld([pagex, pagey, 0]);
      coordinate.setValue(...world);

      const [ndcX, ndcY] = coordinate.getComputedDoubleDisplayValue(
        view.renderer,
      );

      commit("SET_VIEW_DATA", {
        viewType: changedViewType,
        key: "displayX",
        value: ndcX,
      });
      commit("SET_VIEW_DATA", {
        viewType: changedViewType,
        key: "displayY",
        value: ndcY,
      });
      }

    },
    async UpdateIJK({dispatch, getters, commit}, ijk) {

      await Promise.all([
        dispatch("updateSliceForView", {
          viewName: VIEW_NAMES.SAGITTAL,
          index: ijk[0],
          viewType: VIEW_TYPES.SAGITTAL,
        }),

        dispatch("updateSliceForView", {
          viewName: VIEW_NAMES.CORONAL,
          index: ijk[1],
          viewType: VIEW_TYPES.CORONAL,
        }),

        dispatch("updateSliceForView", {
          viewName: VIEW_NAMES.AXIAL,
          index: ijk[2],
          viewType: VIEW_TYPES.AXIAL,
        }),
      ]);
    },

    async updateSliceForView({dispatch,commit}, {viewName, index, viewType}) {
      if (index === "") return;
      commit("UPDATE_LOAD_STATUS",true)
      const imageData = await dispatch("GetSlice", {viewName,viewType, index});
      // commit("UPDATE_LOAD_STATUS",false)
      if (imageData) {
        await dispatch("UpdateSlice", {imageData, viewType, index});
      }
    },
    setupInteractor({dispatch, state, commit,getters}, {view, dimensions}) {
      const dimension = dimensions[view.viewIndex];
      commit("SET_VIEW_DATA", {
        viewType: view.viewIndex,
        key: "dimension",
        value: dimension,
      });


      view.view.interactor.onLeftButtonPress((event) => {
        console.log("点击了啦啦啦")
        dispatch("clearAllAutoplay")

        if (!state.noduleDiagnoseState.isPan) {
          dispatch("handleMousePress", {event, view});
        }else{
          view.view.interactor.getInteractorStyle().startPan()
        }
      });

      view.view.interactor.onMouseMove((event) => {
        if (!state.noduleDiagnoseState.isPan) {
          dispatch("handleMouseMove", {event, view});
        }else{
          dispatch("resizeSliceViews");
        }
      });

      view.view.interactor.onLeftButtonRelease(() =>
        commit("SET_MOUSE_DOWN", false),
      );

      view.view.interactor.onStartMouseWheel(() => {
        if(!state.autoPlayStates[view.viewIndex].isPlay){
          console.log("开始了")
          getters.viewsData.forEach((viewdata) => {
            commit("CLEAR_AUTOPLAY", viewdata.viewIndex);
            commit("UPDATE_AUTOPLAY_STATUS", {
              viewIndex: viewdata.viewIndex,
             updates:{
              isAutoPlay: false,
             }
            });
          });
          let animationId;

          const animate = () => {
            console.log("页面更新了",state.isload,getters.viewsData[view.viewIndex].changedPageindex)
            if (!state.isload) {
              dispatch("updateSliceForView", {
                viewName: view.viewName,
                viewType: view.viewIndex,
                index: getters.viewsData[view.viewIndex].changedPageindex,
              });
              animationId = requestAnimationFrame(animate);
              commit("UPDATE_AUTOPLAY_STATUS", {
                viewIndex: view.viewIndex,
                updates:{
                  timerId: null,
                animationId: animationId,
                isPlay: true,
                }
              });
            }

          };
          // 先赋值，再启动定时器和动画帧

          // 启动动画帧
          // animationId = requestAnimationFrame(animate);
        }
      });
      view.view.interactor.onMouseWheel((event) =>
        dispatch("handleMouseWheel", {spinY: event.spinY, view}),
      );
      view.view.interactor.onEndMouseWheel((event)=>{
        if(state.autoPlayStates[view.viewIndex].isPlay){
          commit("CLEAR_AUTOPLAY", view.viewIndex);
          const viewdata = getters.viewsData[view.viewIndex];
          if(viewdata.gotoPageIndex != viewdata.changedPageindex){
           dispatch("updateSliceForView", {
             viewName: viewdata.viewName,
             viewType: viewdata.viewIndex,
             index: viewdata.changedPageindex,
           });
          }
        }


      })




    },
    async handleMousePress(
      {dispatch, commit, state, getters},
      {event, view},
    ) {
      // getters.viewsData.forEach((viewdata) => {
      //   commit("CLEAR_AUTOPLAY", viewdata.viewIndex);
      //   commit("UPDATE_AUTOPLAY_STATUS", {
      //     viewIndex: viewdata.viewIndex,
      //    updates:{
      //     isAutoPlay: false,
      //    }
      //   });
      // });
    console.log("点击了按压================================")
      commit("SET_MOUSE_DOWN", true);
      const {x, y} = event.position;
      state.picker.pick([x, y, 0], view.view.renderer);
      const pickedPositions = state.picker.getPickedPositions();
      if (pickedPositions.length > 0) {
        const pickedPosition = pickedPositions[0];
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
              view.view.renderWindow.render();
            }
          }
        });
        const ijk = view.view.image
          .worldToIndex(pickedPosition)
          .map(Math.round);

        const trueijk = GetTureIJK({
          viewType: view.viewIndex,
          ijk,
        });
        console.log("trueijk======",ijk,trueijk)
        const imageScales = view.view.image.getPointData().getScalars();
        const pageindex =
          ijk[0] +
          ijk[1] * view.view.image.getDimensions()[0] +
          ijk[2] *
          view.view.image.getDimensions()[0] *
          view.view.image.getDimensions()[1];
        const pixelValue = imageScales.getTuple(pageindex);

        commit("SET_VIEW_DATA", {
          viewType: view.viewIndex,
          key: "hu",
          value: pixelValue[0],
        });

        trueijk.forEach((item, index) => {
          if (item !== "") {
            if (item <= 0) {
              trueijk[index] = 1; //重复执行了，怎么解
              commit("SET_VIEW_DATA", {
                viewType: index,
                key: "changedPageindex",
                value: 1,
              });
            } else if (item > state.viewMprViews[index].dimension) {
              trueijk[index] = state.viewMprViews[index].dimension;
              commit("SET_VIEW_DATA", {
                viewType: index,
                key: "changedPageindex",
                value: state.viewMprViews[index].dimension,
              });
            } else {
              commit("SET_VIEW_DATA", {
                viewType: index,
                key: "changedPageindex",
                value: item,
              });
            }
            dispatch("UpdateDisplay", {
              viewType: index,
              changedPageIndex: getters.viewsData[index].changedPageindex,
            });
          }
        });
        dispatch("throttleUpdateOtherSlice", {
          viewType: view.viewIndex,
          ijk: trueijk,
        });
      } else {
        commit("SET_VIEW_DATA", {
          viewType: view.viewIndex,
          key: "hu",
          value: "",
        });
      }
    },
    handleMouseMove({commit, state, dispatch, getters}, {event, view}) {

      const {x, y} = event.position;
      state.picker.pick([x, y, 0], view.view.renderer);
      const pickedPositions = state.picker.getPickedPositions();
      if (pickedPositions.length > 0) {
        const pickedPosition = pickedPositions[0];

        const ijk = view.view.image
          .worldToIndex(pickedPosition)
          .map(Math.round);
        const imageScales = view.view.image.getPointData().getScalars();
        const pageindex =
          ijk[0] +
          ijk[1] * view.view.image.getDimensions()[0] +
          ijk[2] *
          view.view.image.getDimensions()[0] *
          view.view.image.getDimensions()[1];
        const pixelValue = imageScales.getTuple(pageindex);
        commit("SET_VIEW_DATA", {
          viewType: view.viewIndex,
          key: "hu",
          value: pixelValue[0] ,
        });
        if (state.mouseDown) {
          const trueijk = GetTureIJK({
            viewType: view.viewIndex,
            ijk,
          });
          trueijk.forEach((item, index) => {
            if (item !== "") {
              if (item <= 0) {
                trueijk[index] = 1; //重复执行了，怎么解
                commit("SET_VIEW_DATA", {
                  viewType: index,
                  key: "changedPageindex",
                  value: 1,
                });
              } else if (item > state.viewMprViews[index].dimension) {
                trueijk[index] = state.viewMprViews[index].dimension;
                commit("SET_VIEW_DATA", {
                  viewType: index,
                  key: "changedPageindex",
                  value: state.viewMprViews[index].dimension,
                });
              } else {
                commit("SET_VIEW_DATA", {
                  viewType: index,
                  key: "changedPageindex",
                  value: item,
                });
              }

              dispatch("UpdateDisplay", {
                viewType: index,
                changedPageIndex: getters.viewsData[index].changedPageindex,
              });
            }
          });



          dispatch("throttleUpdateOtherSlice", {
            viewType: view.viewIndex,
            ijk: trueijk,
          });
        }
      } else {
        commit("SET_VIEW_DATA", {
          viewType: view.viewIndex,
          key: "hu",
          value: "",
        });
      }
    },
    handleMouseRelease(){
console.log("")
    },
    UpdateColorWindow({state, commit}, value) {
      state.viewMprViews.forEach((view, objindex) => {
        if(view.view ){

          commit("SET_VIEW_DATA", {
            viewType: view.viewIndex,
            key: "Ww",
            value: value,
          });
          view.view.sliceActor.getProperty().setColorWindow(value);
          view.view.renderWindow.render();
        }

      });
    },

    UpdateColorLevel({state, commit}, value) {
      state.viewMprViews.forEach((view, objindex) => {
        if(view.view ){
          commit("SET_VIEW_DATA", {
            viewType: view.viewIndex,
            key: "Wl",
            value: value,
          });
          view.view.sliceActor.getProperty().setColorLevel(value);
          view.view.renderWindow.render();
        }

      });
    },
    handleMouseWheel({commit, state, dispatch, getters}, {spinY, view}) {
      console.log("滚动操作")
      if (getters.viewsData[view.viewIndex].changedPageindex) {
        let newIndex;
        if (spinY > 0) {
          newIndex =
            (getters.viewsData[view.viewIndex].changedPageindex %
              view.dimension) +
            1;
          if (
            getters.viewsData[view.viewIndex].changedPageindex ===
            view.dimension
          ) {
            commit("SET_VIEW_DATA", {
              viewType: view.viewIndex,
              key: "changedPageindex",
              value: 1,
            });
            dispatch("UpdateDisplay", {
              viewType: view.viewIndex,
              changedPageIndex: 1,
            });
          } else {
            commit("SET_VIEW_DATA", {
              viewType: view.viewIndex,
              key: "changedPageindex",
              value: getters.viewsData[view.viewIndex].changedPageindex + 1,
            });
            dispatch("UpdateDisplay", {
              viewType: view.viewIndex,
              changedPageIndex:
                getters.viewsData[view.viewIndex].changedPageindex,
            });
          }
        } else {
          newIndex =
            ((getters.viewsData[view.viewIndex].changedPageindex -
              2 +
              view.dimension) %
              view.dimension) +
            1;
          if (getters.viewsData[view.viewIndex].changedPageindex === 1) {
            commit("SET_VIEW_DATA", {
              viewType: view.viewIndex,
              key: "changedPageindex",
              value: view.dimension,
            });
            dispatch("UpdateDisplay", {
              viewType: view.viewIndex,
              changedPageIndex: view.dimension,
            });
          } else {
            commit("SET_VIEW_DATA", {
              viewType: view.viewIndex,
              key: "changedPageindex",
              value: getters.viewsData[view.viewIndex].changedPageindex - 1,
            });
            dispatch("UpdateDisplay", {
              viewType: view.viewIndex,
              changedPageIndex:
                getters.viewsData[view.viewIndex].changedPageindex,
            });
          }
        }
        console.log("newIndex",newIndex)
        if(!state.isload){
          dispatch("updateSliceForView", {
            viewName: view.viewName,
            viewType: view.viewIndex,
            index: getters.viewsData[view.viewIndex].changedPageindex,
          });
        }

      }
    },
    throttleUpdateSingleSlice: throttle(
      ({dispatch}, {viewName, viewType, index}) => {
        requestAnimationFrame(() =>
           dispatch("updateSliceForView", {viewName, index, viewType}),
        );
      },
      60,
    ),
    throttleUpdateOtherSlice: throttle(({dispatch}, {viewType, ijk}) => {
      requestAnimationFrame(() => dispatch("UpdateIJK", ijk));
    }, 150),
    async GetSlice({ dispatch, state, commit }, { viewName, viewType, index }) {
      try {
        // Start loading indicator
        let loading = setInterval(() => {
          Vue.prototype.$message.destroy();
        }, 50);

        // Update the current view state
        commit("SET_VIEW_DATA", { viewType, key: "gotoPageIndex", value: index });

        // Request DICOM slice data from the server
        const res = await xhr_getSlice({
          seriesId: state.seriesInfo.seriesId,
          viewName: viewName,
          viewIndex: index,
        });

        if (res) {
          // Clear loading status once we have a response
          commit("UPDATE_LOAD_STATUS", false);
          clearInterval(loading);

          // Convert response data to a DICOM file object
          const file = new File([res.data], "image.dcm", { type: "application/dicom" });

          // Wait for the DICOM image to be read
          const result = await gdcmReadImage(file);
          const outputImage = result.image;

          // Convert the output image to vtkImageData
          const imageData = vtkITKHelper.convertItkToVtkImage(outputImage);


          return imageData;
        } else {
          console.error("Request failed: No data returned");
          return null; // Return null or some indication of failure
        }
      } catch (error) {
        console.error("Request failed:", error);
        return null; // Return null in case of error
      }
    },

    async UpdateSlice(
      {commit, dispatch, state},
      {imageData, viewType, index},
    ) {
      // const reader = vtkXMLImageDataReader.newInstance();
      // reader.parseAsArrayBuffer(arraybuffer);
      const image = imageData;
      const view = state.viewMprViews[viewType]?.view;
      if (!view) {
        console.error("没有这个页面:", viewType);
        return;
      }
      view.image = image;
      view.sliceMapper.setInputData(image);
      state.annotations.value.forEach((annotation) => {
        if (annotation.viewIndex === viewType) {
          annotation.actor.setVisibility(
            index >= annotation.boundsmin && index <= annotation.boundsmax,
          );

        }
      });

      dispatch("setupCamera", viewType);

      view.renderWindow.render();
      state.viewMprViews[viewType].pageIndex = index;
      commit("SET_VIEW_DATA", {viewType, key: "pageIndex", value: index});
    },
    setupCamera({commit, state, getters}, viewType) {
      const view = state.viewMprViews[viewType].view;
      const image = state.viewMprViews[viewType].view.image;

      const camera = view.renderer.getActiveCamera();

      camera.setParallelProjection(true);
      const bounds = image.getBounds();
      const [centerX, centerY, centerZ] = [
        (bounds[0] + bounds[1]) / 2,
        (bounds[2] + bounds[3]) / 2,
        (bounds[4] + bounds[5]) / 2,
      ];


      camera.setFocalPoint(centerX, centerY, centerZ);
        camera.setPosition(centerX, centerY, centerZ - 1);
        camera.setViewUp(0, -1, 0);


      // camera.setViewUp(0, 1, 0);
      view.renderer.resetCamera();

      const [point1, point2] = [
        view.renderer.worldToNormalizedDisplay(
          bounds[0],
          bounds[2],
          bounds[4],
          true,
        ),
        view.renderer.worldToNormalizedDisplay(
          bounds[1],
          bounds[3],
          bounds[5],
          true,
        ),
      ];
      const {width: containerWidth, height: containerHeight} = view.grw
        .getContainer()
        .getBoundingClientRect();

      const zoomrate = containerWidth * Math.abs(point1[0] - point2[0]) <
        containerHeight * Math.abs(point1[1] - point2[1])
        ? Math.max(
          1 / Math.abs(point1[0] - point2[0]),
          1 / Math.abs(point1[1] - point2[1]),
        )
        : Math.min(
          1 / Math.abs(point1[0] - point2[0]),
          1 / Math.abs(point1[1] - point2[1]),
        )
      camera.zoom(
        zoomrate
      );
      camera.roll(getters.viewsData[viewType].cameraRotate);

      view.renderWindow.render();
    },

    addRectangleAnnotation({commit, state}, {view, annotation, bboxindex}) {
      const {xmin, ymin, xmax, ymax, boundsmin, boundsmax} = annotation;
      let boundsZ = view.view.image.getBounds()[2]
      if(view.viewIndex == 2){
        boundsZ = view.view.image.getBounds()[5]
      }
      const [worldpoint1, worldpoint2] = [
        view.view.image.indexToWorld([xmin, ymin, boundsZ]),
        view.view.image.indexToWorld([xmax, ymax,boundsZ]),
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
      actor.setVisibility(false);


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
      view.view.renderer.addActor(actor);
      view.view.renderWindow.render();
    },


    // tools ===================================================================
    /**
     * 滚动条选择
     * @param {number} viewIndex -  操作页面索引
     * @param {number} pageIndex - 切换页面索引

     */
    async ChangeSlider({dispatch}, {viewIndex, pageIndex}) {
      const viewName = VIEWDATA_NAMES[viewIndex]
      commit("SET_VIEW_DATA", {
        viewType: viewIndex,
        key: "changedPageindex",
        value: pageIndex,
      });
      dispatch("throttleUpdateSingleSlice", {viewName, viewIndex, pageIndex});

      dispatch("UpdateDisplay", {
        viewType: viewIndex,
        changedPageIndex: pageIndex,
      });
    },

    /**
     * 结节标记选择
     * @param {number} bboxindex - 结节索引index
     */
    async ChooseAnnotation({state, dispatch, getters, commit},{currentim,bboxindex}) {
      dispatch("clearAllAutoplay")

      state.noduleInfo.noduleLesionList.forEach(async (nodule) => {
        const {points, id} = nodule;
        const bbox = points.split(",").map(Number)
        // console.log(currentim)
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
          getters.viewsData.forEach((viewdata, index) => {
            commit("SET_VIEW_DATA", {
              viewType: viewdata.viewIndex,
              key: "changedPageindex",
              value: ijk[viewdata.viewIndex],
            });
          });
          await dispatch("UpdateIJK", ijk);

          getters.viewsData.forEach((viewdata, index) => {

            dispatch("UpdateDisplay", {
              viewType: viewdata.viewIndex,
              changedPageIndex: viewdata.changedPageindex,
            });
          });
        }
      });
    },

    /**
     * 自动播放
     * @param {number} viewType - 操作页面索引
     * @param {number} time - 单片切换时间，单元毫秒
     */
    AutoPlay({ commit, dispatch, state, getters }, { viewType }) {
      if (!state.autoPlayStates[viewType].isAutoPlay ) {
        dispatch("clearAllAutoplay")

        const view = state.viewMprViews[viewType];

        // 定义一个变量来保存 requestAnimationFrame 的 ID

         // 创建定时器，每隔 50ms 触发
         const timer = setInterval(() => {
          let newIndex =
            (getters.viewsData[view.viewIndex].changedPageindex % view.dimension) + 1;

          if (getters.viewsData[view.viewIndex].changedPageindex === view.dimension) {
            newIndex = 1;
            commit("SET_VIEW_DATA", {
              viewType: view.viewIndex,
              key: "changedPageindex",
              value: 1,
            });
            dispatch("UpdateDisplay", {
              viewType: view.viewIndex,
              changedPageIndex: 1,
            });
          } else {
            commit("SET_VIEW_DATA", {
              viewType: view.viewIndex,
              key: "changedPageindex",
              value: getters.viewsData[view.viewIndex].changedPageindex + 1,
            });
            dispatch("UpdateDisplay", {
              viewType: view.viewIndex,
              changedPageIndex:
                getters.viewsData[view.viewIndex].changedPageindex,
            });
          }
          if(!state.isload){
            dispatch("updateSliceForView", {
              viewName: view.viewName,
              viewType: view.viewIndex,
              index: getters.viewsData[view.viewIndex].changedPageindex,
            });
          }
        }, 60);
          commit("UPDATE_AUTOPLAY_STATUS", {
            viewIndex: viewType,
           updates:{
            timerId: timer,
            isPlay: true,
           }
          });

        commit("UPDATE_AUTOPLAY_STATUS", {
          viewIndex: viewType,
         updates:{
          isAutoPlay: true,
         }
        });
      } else {
         commit("CLEAR_AUTOPLAY", viewType);
         const view = getters.viewsData[viewType];
         if(view.gotoPageIndex != view.changedPageindex){
          dispatch("updateSliceForView", {
            viewName: view.viewName,
            viewType: view.viewIndex,
            index: view.changedPageindex,
          });
         }
         commit("UPDATE_AUTOPLAY_STATUS", {
          viewIndex: viewType,
         updates:{
          isAutoPlay: false,
         }
        });
      }
    }
,

    /**
     * 页面反向
     * @param {number} viewType - 操作页面索引
     */
    ReverseWindow({commit, state, getters}, viewType) {
      const view = state.viewMprViews[viewType].view;
      const viewdata = getters.viewsData[viewType];
      const colorTransferFunction = vtkColorTransferFunction.newInstance();
      if (!viewdata.reversed) {
        colorTransferFunction.addRGBPoint(0, 1, 1, 1); // 白色
        colorTransferFunction.addRGBPoint(255, 0, 0, 0); // 黑色
      } else {
        colorTransferFunction.addRGBPoint(255, 1, 1, 1); // 白色
        colorTransferFunction.addRGBPoint(0, 0, 0, 0); // 黑色
      }
      commit("SET_VIEW_DATA", {
        viewType,
        key: "reversed",
        value: !viewdata.reversed,
      });
      view.sliceActor
        .getProperty()
        .setRGBTransferFunction(0, colorTransferFunction);
      view.interactor.render();
    },

    /**
     * 水平翻转
     * @param {number} viewType - 操作页面索引
     */
    FlipHorizontal({commit, dispatch, state, getters}, viewType) {
      const view = state.viewMprViews[viewType].view;
      const currentScale = view.sliceActor.getScale();
      const newScaleX = currentScale[0] === 1 ? -1 : 1; // 切换X轴的翻转状态

      view.sliceActor.setScale(newScaleX, currentScale[1], currentScale[2]);


      dispatch("setupCamera", viewType);
    },

    /**
     * 垂直翻转
     * @param {number} viewType - 操作页面索引
     */
    FlipVertical({commit, dispatch, state, getters}, viewType) {
      const view = state.viewMprViews[viewType].view;
      const currentScale = view.sliceActor.getScale();
      const newScaleY = currentScale[1] === 1 ? -1 : 1; // 切换Y轴的翻转状态

      view.sliceActor.setScale(currentScale[0], newScaleY, currentScale[2]);


      dispatch("setupCamera", viewType);
    },

    /**
     * 切片旋转
     * @param {number} viewType - 操作页面索引
     */
    RotateCamera({commit, dispatch, state, getters}, viewType) {
      commit("SET_VIEW_DATA", {
        viewType,
        key: "cameraRotate",
        value: (getters.viewsData[viewType].cameraRotate - 90) % 360,
      });
      dispatch("setupCamera", viewType);
      dispatch("resizeSliceViews");

    },
    // 改变平移
    ChangePan({dispatch, state, getters, commit}) {
      if(state.noduleDiagnoseState.isPan){
        state.viewMprViews.forEach((view, objindex) => {
          const interactorStyle = vtkInteractorStyleImage.newInstance();
          // interactorStyle.setInteractionMode("IMAGE_PAN");
          view.view.interactor.setInteractorStyle(interactorStyle);

          view.view.interactor.onLeftButtonPress(()=>{
            view.view.interactor.getInteractorStyle().endWindowLevel()
          })
          // 确保新的 InteractorStyle 被正确设置并激活

          dispatch("setupCamera", view.viewIndex);
          view.view.renderWindow.render()
        })
        commit("SET_NODULE_DIAGNOSE_DATA", {
          key: "isPan",
          value: false,
        });
      }else{
        state.viewMprViews.forEach((view, objindex) => {
          commit("SET_NODULE_DIAGNOSE_DATA", {
            key: "isPan",
            value: true,
          });

          const interactorStyle = vtkInteractorStyleImage.newInstance();
          // interactorStyle.setInteractionMode("IMAGE_PAN");

          // 确保新的 InteractorStyle 被正确设置并激活
          view.view.interactor.setInteractorStyle(interactorStyle);
          view.view.interactor.getInteractorStyle().modified();

          view.view.interactor.initialize();
          view.view.interactor.bindEvents(view.view.grw.getContainer());
          view.view.interactor.start();
          view.view.renderWindow.render();
        });
      }
      dispatch("resizeSliceViews")

    }
,

    /**
     * 重置视图
     */
    resizeSliceViews({dispatch, state, getters, commit}) {
      const ijk = [];
      ijk[VIEW_TYPES.AXIAL] =
        getters.viewsData[VIEW_TYPES.AXIAL].changedPageindex;
      ijk[VIEW_TYPES.CORONAL] =
        getters.viewsData[VIEW_TYPES.CORONAL].changedPageindex;
      ijk[VIEW_TYPES.SAGITTAL] =
        getters.viewsData[VIEW_TYPES.SAGITTAL].changedPageindex;

      ijk.forEach((item, index) => {
        if (item > 0) {
          dispatch("UpdateDisplay", {
            viewType: index,
            changedPageIndex: item,
          });
        }
      });
      state.viewMprViews.forEach((view) => {
        if(view.view.image){
          const container = view.view.grw.getContainer();

          const {width, height} = container.getBoundingClientRect();

       view.view.grw.resize(width, height);
       view.view.renderWindow.render();
       const point1 = [0, 0, 0];
       const point2 = [100, 0, 0];

       coordinate.setValue(...point1);
       const [point1x] = coordinate.getComputedDoubleDisplayValue(
         view.view.renderer,
       );
       coordinate.setValue(...point2);

       const [point2x] = coordinate.getComputedDoubleDisplayValue(
         view.view.renderer,
       );

       commit("SET_VIEW_DATA", {
         viewType: view.viewIndex,
         key: "scaleLength",
         value: Math.abs(point2x - point1x),
       });
        }



      });
    },
    resizeCamera({state,dispatch}){
      state.viewMprViews.forEach((view) =>{
        dispatch("setupCamera",view.viewIndex)
      })
    },
    clearAllAutoplay({state,getters,commit,dispatch}){
      console.log("clearAllAutoplay")
      getters.viewsData.forEach((viewdata) => {
        commit("CLEAR_AUTOPLAY", viewdata.viewIndex);
        commit("UPDATE_AUTOPLAY_STATUS", {
          viewIndex: viewdata.viewIndex,
         updates:{
          isAutoPlay: false,
         }
        });})
    },
    beforeViewDestory({state,commit,dispatch}){
      dispatch("clearAllAutoplay")
commit("RESET_STATE")

    }
  },
};
