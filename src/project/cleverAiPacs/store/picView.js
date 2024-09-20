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

import {xhr_getSlice} from "@/api";


const VIEW_COLORS = {
  BACKGROUND: [0, 0, 0]
};


export default {
  namespaced: true,
  state: {
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
    view:{

    },

    viewData: {
      displayX: null,
      displayY: null,
      scaleLength: null,
      Ww: null,
      Wl: null,
      reversed: false,
      cameraRotate: 0,
      hu: "",
    },

  },

  mutations: {
    SET_STUDIES_SELECTED(state, payload) {
      state.studies_selected = payload;
    },
    SET_SERIES_MAP_DICOM(state, payload) {
      state.series_map_dicom = payload;
    },
    SET_SERIES_INFO(state, seriesInfo) {
      state.seriesInfo = seriesInfo;
    },
    SET_VIEW(state,view){
      state.view = view;
    },
    SET_VIEW_DATA(state,viewData){
      state.viewData = viewData;
    },
    SET_VIEW_DATA(state, {viewType, key, value}) {
      const viewName = VIEWDATA_NAMES[viewType];
      if (!state[viewName]) {
        state[viewName] = {};
      }

      state[viewName][key] = value;
    },

  },
  actions: {
    async InitView(
      {dispatch, commit, state},
      container
    ) {


      const grw = vtkGenericRenderWindow.newInstance();
      grw.setContainer(container);
      const {width, height} = container.getBoundingClientRect();
      grw.resize(width, height);

      const interactorstyle = vtkInteractorStyleImage.newInstance();
      interactorstyle.setInteractionMode("IMAGE_SLICING");

      const obj = {
        grw,
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
      console.log(obj.sliceMapper)
      commit("SET_VIEW",obj)

      await dispatch("GetSlice");

    },



    async GetSlice({dispatch, state}) {
      console.log("getslice")
      try {
        let loading = setInterval(() => {
          Vue.prototype.$message.destroy();

        }, 50)
        const res = await xhr_getSlice({
          seriesId: "1836683063363411969",
          viewName: "axial",
          viewIndex: "67",
        });

        if (res) {
          console.log(res.data)
          clearInterval(loading)
          // return res.data;
          const arraybuffer = res.data;
          const reader = vtkXMLImageDataReader.newInstance();
          reader.parseAsArrayBuffer(arraybuffer);
          const image = reader.getOutputData();
          const view = state.view;

          view.image = image;
          console.log(image)
          console.log(view)
          console.log(view.sliceMapper)

          view.sliceMapper.setInputData(image);
          dispatch("setupCamera");

          view.renderWindow.render();
        } else {
          console.error("Request failed: No data returned");
        }
      } catch (error) {
        console.error("Request failed:", error);
      }
    },

    setupCamera({commit, state, getters}) {
      const view = state.view
      const image = view.image;
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
      const {width: containerWidth, height: containerHeight} = view.grw
        .getContainer()
        .getBoundingClientRect();

      camera.zoom(
        containerWidth * Math.abs(point1[0] - point2[0]) <
          containerHeight * Math.abs(point1[1] - point2[1])
          ? Math.max(
            1 / Math.abs(point1[0] - point2[0]),
            1 / Math.abs(point1[1] - point2[1]),
          )
          : Math.min(
            1 / Math.abs(point1[0] - point2[0]),
            1 / Math.abs(point1[1] - point2[1]),
          ),
      );

      view.renderWindow.render();
    },


    /**
     *窗宽
     * @param {number} value - 改变的值
     */
    UpdateColorWindow({state, commit}, value) {
      const view = state.view
      view.sliceActor.getProperty().setColorWindow(value );
      view.interactor.render();

    },
    /**
     *窗位
     * @param {number} value - 改变的值
     */
    UpdateColorLevel({state, commit}, value) {
      const view = state.view

      view.sliceActor.getProperty().setColorLevel(value );
      view.interactor.render();
    },

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

      console.log("currentScale=", currentScale);

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

      console.log("currentScale=", currentScale);

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
      if (state.noduleDiagnoseState.isPan) {
        state.viewMprViews.forEach((view, objindex) => {
          console.log(view)
          dispatch("setupCamera");
          view.view.renderWindow.render()
        })
        commit("SET_NODULE_DIAGNOSE_DATA", {
          key: "isPan",
          value: false,
        });
      } else {
        state.viewMprViews.forEach((view, objindex) => {
          commit("SET_NODULE_DIAGNOSE_DATA", {
            key: "isPan",
            value: true,
          });

          const interactorStyle = vtkInteractorStyleImage.newInstance();
          interactorStyle.setInteractionMode("IMAGE_PAN");

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

      const view = state.view
      const container = view.grw.getContainer();
      const {width, height} = container.getBoundingClientRect();

      view.grw.resize(width, height);
      view.renderWindow.render();

    },


  },
};
