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

import { xhr_getSlice } from "@/api";
const coordinate = vtkCoordinate.newInstance();

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
  BACKGROUND: [0.5, 0.5, 0.5],
};

const BBOX_COLORS = {
  DEFAULT: [0.29, 0.56, 0.89],
  SELECTED: [1.0, 1.0, 0.0],
};
function GetTureIJK({ viewType, ijk }) {
  const newijkMap = {
    [VIEW_TYPES.AXIAL]: [ijk[0], ijk[1], ""],
    [VIEW_TYPES.SAGITTAL]: ["", ijk[0], ijk[1]],
    [VIEW_TYPES.CORONAL]: [ijk[0], "", ijk[1]],
  };
  return newijkMap[viewType];
}
export default {
  namespaced: true,
  state: {
    seriesInfo: {
      seriesId: "",
      axialCount: "",
      coronalCount: "",
      sagittalCount: "",
      imageCount: "",
    },
    viewMprViews: Array.from({ length: 3 }, () => ({
      viewIndex: null,
      viewName: null,
      view: null,
      pageIndex: null,
      dimension: null,
    })),
    CoronalData: {
      viewIndex: null,
      viewName: null,
      pageIndex: null,
      dimension: null,
      changedPageindex: null,
      displayX: null,
      displayY: null,
      scaleLength: null,
      reversed: false,
      cameraRotate: 0,
      hu: "",
    },
    AxialData: {
      viewIndex: null,
      viewName: null,
      pageIndex: null,
      dimension: null,
      changedPageindex: null,
      displayX: null,
      displayY: null,
      scaleLength: null,
      reversed: false,
      cameraRotate: 0,
      hu: "",
    },
    SagittalData: {
      viewIndex: null,
      viewName: null,
      pageIndex: null,
      dimension: null,
      changedPageindex: null,
      displayX: null,
      displayY: null,
      scaleLength: null,
      reversed: false,
      cameraRotate: 0,
      hu: "",
    },
    noduleInfo: {},

    annotations: { value: [], index: new Set() },
    picker: vtkPicker.newInstance(),
    mouseDown: false,
    autoPlayTimers: Array.from({ length: 3 }, () => ({
      viewIndex: null,
      autoPlayTimer: null,
    })),
  },
  getters: {
    viewsData: (state) => [
      state.SagittalData,
      state.CoronalData,
      state.AxialData,
    ],
  },
  mutations: {
    SET_SERIES_INFO(state, seriesInfo) {
      state.seriesInfo = seriesInfo;
    },
    SET_NODULE_INFO(state, noduleInfo) {
      state.noduleInfo = noduleInfo;
    },

    INIT_VIEW_MPR_VIEW(state, { viewType, data }) {
      state.viewMprViews[viewType] = data;
    },
    SET_VIEW_MPR_VIEW(state, { viewType, key, value }) {
      state.viewMprViews[viewType][key] = value;
    },
    SET_VIEW_DATA(state, { viewType, key, value }) {
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
    UPDATE_AUTO_PLAY_TIMER(state, { viewType, timer }) {
      if (!state.autoPlayTimers) {
        state.autoPlayTimers = {};
      }
      state.autoPlayTimers[viewType] = timer;
    },
    CLEAR_AUTO_PLAY_TIMER(state, viewType) {
      if (state.autoPlayTimers[viewType]?.autoPlayTimer) {
        clearInterval(state.autoPlayTimers[viewType].autoPlayTimer);
      }
      state.autoPlayTimers[viewType] = {
        viewIndex: null,
        autoPlayTimer: null,
      };
    },
  },
  actions: {
    async InitView(
      { dispatch, commit, state },
      { container, viewName, viewType, slicingMode },
    ) {
      const data = await dispatch("InitMprView", {
        container,
        slicingMode,
      });

      commit("INIT_VIEW_MPR_VIEW", {
        viewType,
        data: {
          viewIndex: viewType,
          viewName,
          view: data,
        },
      });
      data.sliceActor.getProperty().setColorWindow(1500);
      data.sliceActor.getProperty().setColorLevel(500);
      commit("SET_VIEW_DATA", { viewType, key: "viewName", value: viewName });
      commit("SET_VIEW_DATA", { viewType, key: "viewIndex", value: viewType });
    },
    async InitMprView({ dispatch, commit }, { container, mode }) {
      const grw = vtkGenericRenderWindow.newInstance();
      grw.setContainer(container);
      const { width, height } = container.getBoundingClientRect();
      grw.resize(width, height);

      const interactorstyle = vtkInteractorStyleImage.newInstance();
      interactorstyle.setInteractionMode("IMAGE_SLICING");

      const obj = {
        grw,
        viewMode: mode,
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
      obj.sliceActor.setMapper(obj.sliceMapper);
      obj.renderer.addActor(obj.sliceActor);

      return obj;
    },

    async InitAxialView({ dispatch }, container) {
      await dispatch("InitView", {
        container,
        viewName: VIEW_NAMES.AXIAL,
        viewType: VIEW_TYPES.AXIAL,
        slicingMode: vtkImageMapper.SlicingMode.K,
      });
    },
    async InitCoronalView({ dispatch }, container) {
      await dispatch("InitView", {
        container,
        viewName: VIEW_NAMES.CORONAL,
        viewType: VIEW_TYPES.CORONAL,
        slicingMode: vtkImageMapper.SlicingMode.I,
      });
    },
    async InitSagittalView({ dispatch }, container) {
      await dispatch("InitView", {
        container,
        viewName: VIEW_NAMES.SAGITTAL,
        viewType: VIEW_TYPES.SAGITTAL,
        slicingMode: vtkImageMapper.SlicingMode.J,
      });
    },

    async InitSlice({ dispatch, state, getters, commit }) {
      const dimensions = new Array(3);
      dimensions[VIEW_TYPES.SAGITTAL] = state.seriesInfo.sagittalCount;
      dimensions[VIEW_TYPES.CORONAL] = state.seriesInfo.coronalCount;
      dimensions[VIEW_TYPES.AXIAL] = state.seriesInfo.axialCount;
      console.log(dimensions);

      const ijk = dimensions.map((d) => Math.round(d / 2) + 1);
      console.log(ijk);
      console.log(state.viewMprViews[0]);
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
        console.log("changedPageindex", item);
        commit("SET_VIEW_DATA", {
          viewType: index,
          key: "changedPageindex",
          value: item,
        });
        console.log(getters.viewsData);
      });
      try {
        await dispatch("UpdateIJK", ijk);
        state.viewMprViews.forEach((view, index) => {
          dispatch("setupInteractor", { view, dimensions });
          state.noduleInfo.focalDetailList.forEach(async (nodule) => {
            const annotation = await dispatch("getAnnotationForView", {
              nodule,
              viewType: view.viewIndex,
            });
            console.log(annotation);
            requestAnimationFrame(() =>
              dispatch("addRectangleAnnotation", {
                view,
                annotation,
                bboxindex: nodule.boxIndex,
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
          console.log(getters.viewsData);
        });
        await dispatch("UpdateIJK", ijk);

        console.log(ijk);
        ijk.forEach((item, index) => {
          dispatch("UpdateDisplay", {
            viewType: index,
            changedPageIndex: item,
          });
        });
      } catch (err) {
        console.log(err);
      }
      console.log(state.viewMprViews);
      console.log(getters.viewsData);
    },
    getAnnotationForView({ state }, { nodule, viewType }) {
      const { bbox } = nodule;
      const [xmin, xmax, ymin, ymax, zmin, zmax] = bbox;
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
    UpdateDisplay({ commit, state, dispatch }, { viewType, changedPageIndex }) {
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
    UpdateDisplayValue({ commit, state }, { changedViewType, pagex, pagey }) {
      const view = state.viewMprViews[changedViewType].view;

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
    },
    async UpdateIJK({ dispatch }, ijk) {
      console.log("updateijk");
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
    async updateSliceForView({ dispatch }, { viewName, index, viewType }) {
      if (index === "") return;
      const arraybuffer = await dispatch("GetSlice", { viewName, index });

      if (arraybuffer) {
        await dispatch("UpdateSlice", { arraybuffer, viewType, index });
      }
    },
    setupInteractor({ dispatch, state, commit }, { view, dimensions }) {
      const dimension = dimensions[view.viewIndex];
      commit("SET_VIEW_DATA", {
        viewType: view.viewIndex,
        key: "dimension",
        value: dimension,
      });

      view.view.interactor.onLeftButtonPress((event) => {
        dispatch("handleMousePress", { event, view });
      });
      view.view.interactor.onMouseMove((event) =>
        dispatch("handleMouseMove", { event, view }),
      );
      view.view.interactor.onLeftButtonRelease(() =>
        commit("SET_MOUSE_DOWN", false),
      );
      view.view.interactor.onMouseWheel((event) =>
        dispatch("handleMouseWheel", { spinY: event.spinY, view }),
      );

      view.view.interactor.onStartMouseWheel(() => {
        state.autoPlayTimers.forEach((timer) => {
          clearInterval(timer.autoPlayTimer);
          timer.autoPlayTimer = null;
        });
      });
    },
    async handleMousePress(
      { dispatch, commit, state, getters },
      { event, view },
    ) {
      state.autoPlayTimers.forEach((timer) => {
        clearInterval(timer.autoPlayTimer);
        timer.autoPlayTimer = null;
      });
      view.view.interactor.getInteractorStyle().endWindowLevel();

      commit("SET_MOUSE_DOWN", true);
      const { x, y } = event.position;
      state.picker.pick([x, y, 0], view.view.renderer);
      const pickedPositions = state.picker.getPickedPositions();
      if (pickedPositions.length > 0) {
        const pickedPosition = pickedPositions[0];
        const pickedX = pickedPosition[0];
        const pickedY = pickedPosition[1];

        state.annotations.value.forEach((annotation) => {
          if (annotation.viewIndex === view.viewIndex) {
            if (
              view.pageIndex > annotation.boundsmin &&
              view.pageIndex < annotation.boundsmax &&
              annotation.worldpoint1[0] < pickedX &&
              annotation.worldpoint2[0] > pickedX &&
              annotation.worldpoint1[1] < pickedY &&
              annotation.worldpoint2[1] > pickedY
            ) {
              const selectedAnnotation = annotation.bboxIndex;
              state.annotations.value.forEach((anno) => {
                anno.actor
                  .getProperty()
                  .setColor(
                    ...(anno.bboxIndex === selectedAnnotation
                      ? BBOX_COLORS.SELECTED
                      : BBOX_COLORS.DEFAULT),
                  );
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
          value: pixelValue[0] - 1024,
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
    handleMouseMove({ commit, state, dispatch, getters }, { event, view }) {
      const { x, y } = event.position;
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
          value: pixelValue[0] - 1024,
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
    handleMouseWheel({ commit, state, dispatch, getters }, { spinY, view }) {
      console.log("handleMouseWheel");

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
        dispatch("throttleUpdateSingleSlice", {
          viewName: view.viewName,
          viewType: view.viewIndex,
          index: newIndex,
        });
      }
    },
    throttleUpdateSingleSlice: throttle(
      ({ dispatch }, { viewName, viewType, index }) => {
        requestAnimationFrame(() =>
          dispatch("updateSliceForView", { viewName, index, viewType }),
        );
      },
      200,
    ),
    throttleUpdateOtherSlice: throttle(({ dispatch }, { viewType, ijk }) => {
      requestAnimationFrame(() => dispatch("UpdateIJK", ijk));
    }, 200),
    async GetSlice({ dispatch, state }, { viewName, index }) {
      try {
        const res = await xhr_getSlice({
          seriesId: state.seriesInfo.seriesId,
          viewName: viewName,
          viewIndex: index,
        });

        if (res) {
          return res.data;
        } else {
          console.error("Request failed: No data returned");
        }
      } catch (error) {
        console.error("Request failed:", error);
      }
    },
    async UpdateSlice(
      { commit, dispatch, state },
      { arraybuffer, viewType, index },
    ) {
      const reader = vtkXMLImageDataReader.newInstance();
      reader.parseAsArrayBuffer(arraybuffer);
      const image = reader.getOutputData();
      const view = state.viewMprViews[viewType]?.view;
      if (!view) {
        console.error("View is not initialized for viewType:", viewType);
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
      commit("SET_VIEW_DATA", { viewType, key: "pageIndex", value: index });
    },
    setupCamera({ commit, state, getters }, viewType) {
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
      const { width: containerWidth, height: containerHeight } = view.grw
        .getContainer()
        .getBoundingClientRect();
      const zoomFactor = Math.min(
        1 / Math.abs(point1[0] - point2[0]),
        1 / Math.abs(point1[1] - point2[1]),
      );
      camera.zoom(
        containerWidth * Math.abs(point1[0] - point2[0]) >
          containerHeight * Math.abs(point1[1] - point2[1])
          ? Math.max(
              1 / Math.abs(point1[0] - point2[0]),
              1 / Math.abs(point1[1] - point2[1]),
            )
          : zoomFactor,
      );
      camera.roll(getters.viewsData[viewType].cameraRotate);
      view.renderWindow.render();
    },
    addRectangleAnnotation({ commit, state }, { view, annotation, bboxindex }) {
      const { xmin, ymin, xmax, ymax, boundsmin, boundsmax } = annotation;
      const [worldpoint1, worldpoint2] = [
        view.view.image.indexToWorld([xmin, ymin, 0]),
        view.view.image.indexToWorld([xmax, ymax, 0]),
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
    async ChooseAnnotation({ state, dispatch, getters }, bboxindex) {
      console.log("ChooseAnnotation");
      console.log(getters.viewsData);
      console.log(bboxindex);
      state.noduleInfo.focalDetailList.forEach(async (nodule) => {
        const { bbox, boxIndex } = nodule;
        if (boxIndex === bboxindex) {
          const ijk = [
            Math.round((bbox[0] + bbox[1]) / 2),
            Math.round((bbox[2] + bbox[3]) / 2),
            Math.round((bbox[4] + bbox[5]) / 2),
          ];
          state.annotations.value.forEach((anno) => {
            anno.actor
              .getProperty()
              .setColor(
                ...(anno.bboxIndex === boxIndex
                  ? BBOX_COLORS.SELECTED
                  : BBOX_COLORS.DEFAULT),
              );
          });
          await dispatch("UpdateIJK", ijk);
        }
      });
    },

    async ChangeSlider({ dispatch }, { viewName, viewIndex, pageIndex }) {
      dispatch("throttleUpdateSingleSlice", { viewName, viewIndex, pageIndex });

      commit("SET_VIEW_DATA", {
        viewType: viewIndex,
        key: "changedPageindex",
        value: pageIndex,
      });

      dispatch("UpdateDisplay", {
        viewType: viewIndex,
        changedPageIndex: pageIndex,
      });
    },
    AutoPlay({ commit, dispatch, state }, { viewType, time }) {
      if (state.autoPlayTimers[viewType].autoPlayTimer === null) {
        state.autoPlayTimers.forEach((timer) => {
          clearInterval(timer.autoPlayTimer);
          timer.autoPlayTimer = null;
        });

        const view = state.viewMprViews[viewType];
        commit("SET_VIEW_DATA", {
          viewType: view.viewIndex,
          key: "changedPageindex",
          value: view.pageIndex,
        });
        dispatch("UpdateDisplay", {
          viewType: view.viewIndex,
          changedPageIndex: view.pageIndex,
        });

        const timer = setInterval(() => {
          const newIndex =
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
          dispatch("throttleUpdateSingleSlice", {
            viewName: view.viewName,
            viewType: view.viewIndex,
            newIndex,
          });
        }, time); // 每秒打印一次

        commit("UPDATE_AUTO_PLAY_TIMER", { viewType, timer });
      } else {
        commit("CLEAR_AUTO_PLAY_TIMER", viewType);
      }
    },
    ReverseWindow({ commit, state }, viewType) {
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
    RotateCamera({ commit, dispatch, state }, viewType) {
      commit("SET_VIEW_DATA", {
        viewType,
        key: "cameraRotate",
        value: (getters.viewsData[viewType].cameraRotate - 90) % 360,
      });
      dispatch("setupCamera", viewType);
    },
    resizeViews({ dispatch, state, getters, commit }) {
      console.log("resizeViews");
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
        const container = view.view.grw.getContainer();
        const { width, height } = container.getBoundingClientRect();

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
      });
    },
  },
};
