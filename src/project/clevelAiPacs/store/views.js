import Vue from "vue";

import "@kitware/vtk.js/Rendering/Profiles/All";
// import {
//   readImageDicomFileSeries
// } from '@itk-wasm/dicom'
import { readImageDicomFileSeries } from "@itk-wasm/dicom";
import * as dicomW from "@itk-wasm/dicom";
import vtkITKHelper from "@kitware/vtk.js/Common/DataModel/ITKHelper";
import vtkOrientationMarkerWidget from "@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget";
import vtkAnnotatedCubeActor from "@kitware/vtk.js/Rendering/Core/AnnotatedCubeActor";
import vtkVolume from "@kitware/vtk.js/Rendering/Core/Volume";
import vtkVolumeMapper from "@kitware/vtk.js/Rendering/Core/VolumeMapper";
import vtkGenericRenderWindow from "@kitware/vtk.js/Rendering/Misc/GenericRenderWindow";
import vtkImageMapper from "@kitware/vtk.js/Rendering/Core/ImageMapper";
import vtkImageReslice from "@kitware/vtk.js/Imaging/Core/ImageReslice";
import vtkImageSlice from "@kitware/vtk.js/Rendering/Core/ImageSlice";
import vtkInteractorStyleImage from "@kitware/vtk.js/Interaction/Style/InteractorStyleImage";
import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";
import vtkWidgetManager from "@kitware/vtk.js/Widgets/Core/WidgetManager";
import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import {
  xyzToViewType,
  InteractionMethodsName,
} from "@kitware/vtk.js/Widgets/Widgets3D/ResliceCursorWidget/Constants";
import vtkPicker from "@kitware/vtk.js/Rendering/Core/Picker";

import { vec3, quat, mat4 } from "gl-matrix";
import vtkPlane from "@kitware/vtk.js/Common/DataModel/Plane";

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

const VIEW_COLORS = {
  BACKGROUND: [0, 0, 0],
};

// 你可能需要添加一个辅助函数来创建裁剪平面
function createClippingPlanesFromIJK(ijk1, ijk2, indexToWorld) {
  // 根据ijk坐标和indexToWorld转换创建裁剪平面
  // 返回裁剪平面数组
}

const getAnnotatedCube = () => {
  const cube = vtkAnnotatedCubeActor.newInstance();
  cube.setDefaultStyle({
    text: "F", // 通用前面文字
    fontStyle: "bold",
    fontFamily: "Arial",
    fontColor: "black",
    fontSizeScale: (res) => res / 2.2,
    faceRotation: 0,
    edgeThickness: 0.05,
    edgeColor: "black",
    resolution: 400,
  });
  // 设置每个面的标签，确保其与标准医学方向一致
  cube.setXPlusFaceProperty({
    text: "L",
  }); // 左（Left）
  cube.setXMinusFaceProperty({
    text: "R",
  }); // 右（Right）
  cube.setYPlusFaceProperty({
    text: "A",
  }); // 前（Anterior）
  cube.setYMinusFaceProperty({
    text: "P",
  }); // 后（Posterior）
  cube.setZPlusFaceProperty({
    text: "S",
  }); // 上（Superior）
  cube.setZMinusFaceProperty({
    text: "I",
  }); // 下（Inferior）
  return cube;
};
// actions.js
const InitWindow = ({ commit, state, rootState, dispatch }, payload) => {
  const { toolsStore } = rootState;
  const { ww, wl } = payload;
  dispatch(
    "toolsStore/UpdateColorWindow",
    {
      ww,
    },
    {
      root: true,
    },
  );
  // dispatch('toolsStore/UpdateColorLevel', {
  //   wl
  // }, {
  //   root: true
  // })

  // toolsStore.UpdateColorWindow(ww)
  // toolsStore.UpdateColorLevel(wl)
};
// actions.js
const initCrossHair = ({ commit, state, rootState, dispatch }) => {
  const { toolsStore } = rootState;
  const widgetState = toolsStore.widget.getWidgetState();
  widgetState.getCenterHandle().setScale1(true);
  widgetState.getAxisYinX().setScale3From([0.8, 0.8, 0.8]);
  widgetState.getAxisYinX().setColor3From([0, 0, 255]);
  widgetState.getAxisYinZ().setScale3From([0.8, 0.8, 0.8]);
  widgetState.getAxisYinZ().setColor3From([0, 0, 255]);
  widgetState.getAxisXinY().setScale3From([0.8, 0.8, 0.8]);
  widgetState.getAxisXinY().setColor3From([0, 0, 255]);
  widgetState.getAxisXinZ().setScale3From([0.8, 0.8, 0.8]);
  widgetState.getAxisXinZ().setColor3From([0, 0, 255]);
  widgetState.getAxisZinX().setScale3From([0.8, 0.8, 0.8]);
  widgetState.getAxisZinX().setColor3From([0, 0, 255]);
  widgetState.getAxisZinY().setScale3From([0.8, 0.8, 0.8]);
  widgetState.getAxisZinY().setColor3From([0, 0, 255]);
};

// actions.js
const handleendMouseWheel = ({ commit, state, rootState, dispatch }) => {
  const { toolsStore } = rootState;
  state.viewMprViews.forEach((v, objindex) => {
    dispatch(
      "toolsStore/GetImagePage",
      {
        v,
        objindex,
      },
      {
        root: true,
      },
    );
  });
};
// actions.js
const handleMouseMove = ({ commit, state, rootState, dispatch }, payload) => {
  const { toolsStore } = rootState;
  const { event, obj, picker, image, viewsData, index } = payload;

  const { mouseDown } = state;

  if (mouseDown == true && toolsStore.intermode == "crosshair") {
    const { x, y } = event.position;
    picker.pick([x, y, 0], obj.renderer);

    if (picker.getPickedPositions().length > 0) {
      const pickedPosition = picker.getPickedPositions()[0];
      toolsStore.widget.setCenter(pickedPosition);
      obj.widgetInstance.invokeInteractionEvent(
        obj.widgetInstance.getActiveInteraction(),
      );
      state.viewMprViews.forEach((v, objindex) => {
        dispatch(
          "toolsStore/updateReslice",
          {
            obj,
            objindex: objindex,
            viewType: obj.viewType,
            reslice: obj.reslice,
            actor: obj.resliceActor,
            renderer: obj.renderer,
            resetFocalPoint: true,
            computeFocalPointOffset: true,
          },
          {
            root: true,
          },
        );

        v.interactor.render();

        dispatch(
          "toolsStore/GetImagePage",
          {
            v,
            objindex,
          },
          {
            root: true,
          },
        );
      });
    } else {
      console.log("No point picked.");
    }
  }
  const { x, y } = event.position;
  picker.pick([x, y, 0], obj.renderer);

  if (picker.getPickedPositions().length > 0) {
    const pickedPosition = picker.getPickedPositions()[0];
    const worldCoords = pickedPosition;
    const ijkCoords = image.worldToIndex(worldCoords);
    const ijk = ijkCoords.map(Math.round);
    const imageScales = image.getPointData().getScalars();
    const pageindex =
      ijk[0] +
      ijk[1] * image.getDimensions()[0] +
      ijk[2] * image.getDimensions()[0] * image.getDimensions()[1];
    const pixelValue = imageScales.getTuple(pageindex);
    // viewsData[index].value.hu = pixelValue[0]
    commit("UPDATE_HU_VALUE", {
      index,
      hu: pixelValue[0],
    });
  } else {
    console.log("No point picked.");
  }
};

// actions.js
const handleMouseUp = ({ commit, state, rootState, dispatch }, payload) => {
  const { toolsStore } = rootState;
  const { obj } = payload;
  commit("UPDATE_MOUSE_DOWN", false);
  if (toolsStore.intermode == "pan") {
    obj.interactor.getInteractorStyle().startCameraPose();
    obj.interactor.getInteractorStyle().endPan();
  }
};

// actions.js
const handleLeftButtonPress = (
  { commit, state, rootState, dispatch },
  payload,
) => {
  const { toolsStore } = rootState;
  const { event, obj, picker } = payload;

  commit("UPDATE_MOUSE_DOWN", true); // 假设 mouseDown 是一个响应式状态

  if (toolsStore.intermode == "crosshair") {
    const { x, y } = event.position;
    picker.pick([x, y, 0], obj.renderer);

    if (picker.getPickedPositions().length > 0) {
      const pickedPosition = picker.getPickedPositions()[0];
      toolsStore.widget.setCenter(pickedPosition);
      obj.widgetInstance.invokeInteractionEvent(
        obj.widgetInstance.getActiveInteraction(),
      );
      state.viewMprViews.forEach((v, objindex) => {
        dispatch(
          "toolsStore/updateReslice",
          {
            obj,
            objindex: objindex,
            viewType: obj.viewType,
            reslice: obj.reslice,
            actor: obj.resliceActor,
            renderer: obj.renderer,
            resetFocalPoint: true,
            computeFocalPointOffset: true,
          },
          {
            root: true,
          },
        );

        v.interactor.render();
        dispatch(
          "toolsStore/GetImagePage",
          {
            v,
            objindex,
          },
          {
            root: true,
          },
        );
      });
    } else {
      console.log("No point picked.");
    }
  } else if (toolsStore.intermode == "pan") {
    obj.interactor.getInteractorStyle().endCameraPose();
    obj.interactor.getInteractorStyle().startPan();
  }
};

// actions.js 更新边缘渐变
const updateEdgeGradient = (store, { renderWindow, actor }) => {
  const { commit, state, rootState, dispatch } = store;
  const { imageData } = state;
  // const volumeMapper = vtkVolumeMapper.newInstance()
  // volumeMapper.setInputData(imageData)

  // const volume = vtkVolume.newInstance()
  // volume.setMapper(volumeMapper)

  const dataRange = imageData.getPointData().getScalars().getRange();
  const lookupTable = vtkColorTransferFunction.newInstance();
  lookupTable.addRGBPoint(dataRange[0], 0.0, 0.0, 0.0);
  lookupTable.addRGBPoint((dataRange[0] + dataRange[1]) / 2, 1.0, 1.0, 1.0);
  lookupTable.addRGBPoint(dataRange[1], 1.0, 1.0, 1.0);

  const piecewiseFunction = vtkPiecewiseFunction.newInstance();
  piecewiseFunction.addPoint(-600, 0.0);
  piecewiseFunction.addPoint(300, 0.0);
  piecewiseFunction.addPoint(800, 1);
  piecewiseFunction.addPoint(2000, 1);
  actor.getProperty().setRGBTransferFunction(0, lookupTable);
  actor.getProperty().setScalarOpacity(0, piecewiseFunction);

  renderWindow.render();
};

export default {
  namespaced: true,
  state: {
    helloViews: "helloViews-helloViews",

    view3D: {},
    viewMprViews: [],
    viewsData: [
      // 初始时为空数组，后续将填充Coronal、Axial、Sagittal视图的数据
    ],
    imageData: {},

    mouseDown: false,

    Coronal: {
      // 初始状态根据需要定义，例如：
      spacing: 0, // 间距
      thickness: 0, // 厚度
      // 其他状态...
    },
    Axial: {
      spacing: 0,
      thickness: 0,
      // 其他状态...
    },
    Sagittal: {
      spacing: 0,
      thickness: 0,
      // 其他状态...
    },
    // 其他状态...
  },
  mutations: {
    UPDATE_VIEW_DATA(state, payload) {
      const { objindex, attributes } = payload;
      const viewData = state.viewsData[objindex];
      // debugger
      if (viewData) {
        // 遍历要设置的属性值
        for (const key in attributes) {
          Vue.set(viewData, key, attributes[key]);
        }
      }
    },
    UPDATE_HU_VALUE(state, payload) {
      const { index, hu } = payload;
      Vue.set(state.viewsData[index], "hu", hu);
    },
    UPDATE_MOUSE_DOWN(state, payload) {
      state.mouseDown = payload;
    },
    UPDATE_VIEWS_DATA(state, { index, newViewsData }) {
      Vue.set(state.viewsData, index, newViewsData);
    },
    // 更新 Coronal 的 spacing
    UPDATE_CORONAL_SPACING(state, payload) {
      state.Coronal.spacing = payload;
    },
    // 更新 Coronal 的 thickness
    UPDATE_CORONAL_THICKNESS(state, payload) {
      state.Coronal.thickness = payload;
    },
    // 更新 Axial 的 spacing
    UPDATE_AXIAL_SPACING(state, payload) {
      state.Axial.spacing = payload;
    },
    // 更新 Axial 的 thickness
    UPDATE_AXIAL_THICKNESS(state, payload) {
      state.Axial.thickness = payload;
    },
    // 更新 Sagittal 的 spacing
    UPDATE_SAGITTAL_SPACING(state, payload) {
      state.Sagittal.spacing = payload;
    },
    // 更新 Sagittal 的 thickness
    UPDATE_SAGITTAL_THICKNESS(state, payload) {
      state.Sagittal.thickness = payload;
    },
    UPDATE_MPR_VIEW(state, payload) {
      // debugger
      const {
        viewName,
        viewType,
        mode,
        renderWindow,
        renderer,
        interactor,
        widgetManager,
        widgetInstance,
        reslice,
        resliceMapper,
        resliceActor,
        grw,
      } = payload;
      const view = {
        grw,
        viewName,
        viewType,
        viewMode: mode,
        renderWindow,
        renderer,
        interactor,
        widgetManager,
        widgetInstance,
        reslice,
        resliceMapper,
        resliceActor,
      };
      state.viewMprViews.push(view);
      console.log("state.viewMprViews--current:", state.viewMprViews);
    },
    //更新viewsData的某个对象
    put_jsonOb_viewsData(state, payload) {
      const { index, newData } = payload;

      Object.assign(state.viewsData[index], newData);
    },
    SET_HELLOVIEWS(state, container) {
      state.helloViews = container;
    },
    INIT_3D_VIEW(state, payload) {
      const { fullw } = payload;
      // debugger;
      const renderWindow = fullw.getRenderWindow();
      const renderer = fullw.getRenderer();
      // 使用Vue.set来确保新属性是响应式的
      Vue.set(state.view3D, "renderWindow", renderWindow);
      Vue.set(state.view3D, "renderer", renderer);

      state.view3D.fullw = fullw;
      const oriencube = getAnnotatedCube();
      const interactor = state.view3D.renderWindow.getInteractor();
      const orientationWidget = vtkOrientationMarkerWidget.newInstance({
        actor: oriencube,
        interactor,
      });
      orientationWidget.setEnabled(true);
      orientationWidget.setViewportCorner(
        vtkOrientationMarkerWidget.Corners.BOTTOM_LEFT,
      );
      orientationWidget.setViewportSize(0.1);
      orientationWidget.setMinPixelSize(80);
      orientationWidget.setMaxPixelSize(100);

      const camera = state.view3D.renderer.getActiveCamera();
      camera.setPosition(0, -1, 0);
      camera.setFocalPoint(0, 0, 0);
      camera.setViewUp(0, 0, 1);
      camera.zoom(1.5);

      // 将orientationWidget添加到state.view3D中
      Vue.set(state.view3D, "orientationWidget", orientationWidget);
    },

    UPDATE_VIEW(state, payload) {
      const { viewType, data } = payload;
      // debugger;
      switch (viewType) {
        case VIEW_TYPES.CORONAL:
          state.Coronal = data;

          break;
        case VIEW_TYPES.AXIAL:
          state.Axial = data;

          break;
        case VIEW_TYPES.SAGITTAL:
          state.Sagittal = data;

          break;
        default:
          return void 0;
      }

      // 更新viewsData数组
      state.viewsData = [state.Coronal, state.Axial, state.Sagittal].filter(
        (view) => Object.keys(view).length > 0,
      );
    },

    // 其他mutations...
    // 例如，设置Coronal视图的间距和厚度
    SET_CORONAL_SPACING(state, spacing) {
      state.Coronal.spacing = spacing;
    },
    SET_CORONAL_THICKNESS(state, thickness) {
      state.Coronal.thickness = thickness;
    },
    // 为Axial和Sagittal添加类似的mutations
    // ...
    SET_IMAGE_DATA(state, image) {
      // 使用 Object.assign 将 image 对象的属性复制到 state.imageData
      Object.assign(state.imageData, image);

      // 这可以通过先删除原对象，然后创建一个新的对象来实现
      Vue.set(state, "imageData", {
        ...state.imageData,
      });
    },
    INIT_MPR_VIEW(state, { container, view, mode }) {
      // 根据Pinia中的InitMprView方法逻辑初始化MPR视图并更新state
      // 这里需要根据具体的逻辑来更新state
    },
    INIT_VIEWS(state) {
      // 根据state中的imageData初始化所有必要的视图
      // 这里需要根据具体的逻辑来更新state
      // 例如，初始化Axial, Sagittal, Coronal视图
    },

    SET_CLIPPING_PLANES(state, clippingPlanes) {
      state.clippingPlanes = clippingPlanes;
    },

    // 设置窗口级别
    SET_WINDOW_LEVEL(state, { ww, wl }) {
      state.windowWidth = ww;
      state.windowLevel = wl;
    },

    // 更新边缘渐变的mutations可能不需要，因为这是副作用，应该在actions中处理

    // 应用裁剪平面
    APPLY_CLIPPING(state, clippingPlanes) {
      state.clippingPlanes = clippingPlanes;
    },

    // 根据Pinia中的方法更新view3D状态
    UPDATE_3D_VIEW(state, view3DData) {
      state.view3D = {
        ...state.view3D,
        ...view3DData,
      };
    },

    // 移除所有裁剪平面
    REMOVE_ALL_CLIPPING_PLANES(state) {
      state.view3D.mapper.removeAllClippingPlanes();
    },
  },
  actions: {
    async UpdateColorWindow_self(
      { commit, state, rootState, dispatch },
      value,
    ) {
      const { ww } = value;

      state.viewMprViews.forEach((obj, objindex) => {
        // const viewData = state.viewsStore.viewsData[objindex];
        // viewData.Wl = value; // 假设Wl是视图数据的一部分
        //  dispatch('updateViewData', {
        //    objindex, // 你要更新的对象在 viewsData 中的索引
        //    attributes: { // 要设置的属性值
        //      Ww: ww,
        //      // 更多的属性可以添加到这里
        //    }
        //  });

        obj.resliceActor.getProperty().setColorWindow(ww);
        obj.interactor.render();
      });
      console.log(value, "vvvvvvvvvvvvvvvvvvvvvvvv");

      // console.log(state.viewMprViews[0].resliceActor.getProperty().get())
      // state.viewMprViews[0].resliceActor.getProperty().setColorWindow(ww);
      // state.viewMprViews[0].renderWindow.render();
      // state.viewMprViews[1].resliceActor.getProperty().setColorWindow(ww);
      // state.viewMprViews[1].renderWindow.render();
      // state.viewMprViews[2].resliceActor.getProperty().setColorWindow(ww);
      // state.viewMprViews[2].renderWindow.render();
    },
    async UpdateColorLevel_self({ commit, state, rootState, dispatch }, value) {
      const { wl } = value;

      state.viewMprViews.forEach((obj, objindex) => {
        // const viewData = state.viewsStore.viewsData[objindex];
        // viewData.Wl = value; // 假设Wl是视图数据的一部分
        // dispatch('updateViewData', {
        //   objindex, // 你要更新的对象在 viewsData 中的索引
        //   attributes: { // 要设置的属性值
        //     Wl: value,
        //     // 更多的属性可以添加到这里
        //   }
        // });

        obj.resliceActor.getProperty().setColorLevel(wl);
        obj.interactor.render();
      });

      // state.viewMprViews[0].resliceActor.getProperty().setColorLevel(wl);
      // state.viewMprViews[0].interactor.render();
      // state.viewMprViews[1].resliceActor.getProperty().setColorLevel(wl);
      // state.viewMprViews[1].interactor.render();
      // state.viewMprViews[2].resliceActor.getProperty().setColorLevel(wl);
      // state.viewMprViews[2].interactor.render();
    },
    async updateViewData({ commit }, payload) {
      commit("UPDATE_VIEW_DATA", payload);
      // 这个有问题，设置会导致黑屏
    },
    async initViewAction({ commit, dispatch }, payload) {
      const { container, viewName, viewType, slicingMode } = payload;
      const view = {
        viewName: viewName,
        viewColor: VIEW_COLORS.BACKGROUND,
        viewType: viewType,
      };

      // 假设InitMprView是一个返回Promise的异步方法
      // const data = await InitMprView(container, view, slicingMode);
      const data = await dispatch("InitMprView", {
        container,
        view,
        slicingMode,
      });
      console.log("data===initViewAction=MPR", data);
      // 提交mutation来更新状态
      commit("UPDATE_VIEW", {
        viewType,
        data,
      });
    },
    async init3DView({ commit }, container) {
      const fullw = vtkFullScreenRenderWindow.newInstance({
        container: container,
        background: VIEW_COLORS.BACKGROUND,
      });

      console.log("fullw___", fullw);
      // debugger;

      // 调用mutation更新state
      commit("INIT_3D_VIEW", {
        fullw,
      });
    },
    async initCoronalView({ commit, dispatch }, container) {
      //更新冠状面数据源
      await dispatch("initViewAction", {
        container,
        viewName: VIEW_NAMES.CORONAL,
        viewType: VIEW_TYPES.CORONAL,
        slicingMode: vtkImageMapper.SlicingMode.I,
      });
    },
    async initAxialView({ commit, dispatch }, container) {
      // 更新轴数据
      await dispatch("initViewAction", {
        container,
        viewName: VIEW_NAMES.AXIAL,
        viewType: VIEW_TYPES.AXIAL,
        slicingMode: vtkImageMapper.SlicingMode.K,
      });
    },
    async initSagittalView({ commit, dispatch }, container) {
      // 更新矢状面数据
      await dispatch("initViewAction", {
        container,
        viewName: VIEW_NAMES.SAGITTAL,
        viewType: VIEW_TYPES.SAGITTAL,
        slicingMode: vtkImageMapper.SlicingMode.J,
      });
    },

    readDicomFileSeries({ commit, state }, files) {
      // debugger
      console.log("files", files);
      console.log("dicomW==", dicomW);
      // console.log("readImageDicomFileSeries=", readImageDicomFileSeries);
      return readImageDicomFileSeries({
        inputImages: files,
        // singleSortedSeries: true,
      })
        .then((res) => {
          // debugger;
          const { outputImage } = res;
          const image = vtkITKHelper.convertItkToVtkImage(outputImage);
          // Object.assign(imageData, image)
          console.log("image-----------", image);
          commit("SET_IMAGE_DATA", image);
          return image;
        })
        .catch((err) => {
          console.error("Error reading DICOM file series:", err);
          throw err;
        });
    },
    // 其他actions...
    async InitMprView({ commit, rootState }, payload) {
      const { toolsStore } = rootState;
      const { container, view, slicingMode: mode } = payload;
      // debugger;
      const grw = vtkGenericRenderWindow.newInstance();
      grw.setContainer(container);
      grw.resize();
      let renderer = grw.getRenderer(),
        renderWindow = grw.getRenderWindow(),
        interactor = grw.getInteractor(),
        widgetManager = vtkWidgetManager.newInstance();

      let obj = {
        grw: grw,
        viewName: view.viewName,
        viewType: xyzToViewType[view.viewType],
        viewMode: mode,
        renderWindow,
        renderer,
        interactor,
        widgetManager,
        orientationWidget: null,
      };

      obj.renderer.getActiveCamera().setParallelProjection(true);
      obj.renderer.setBackground(...view.viewColor);
      obj.renderWindow.addRenderer(obj.renderer);
      obj.renderWindow.setInteractor(obj.interactor);
      obj.interactor.initialize();
      obj.interactor.bindEvents(container);

      const interactorstyle = vtkInteractorStyleImage.newInstance();
      obj.interactor.setInteractorStyle(interactorstyle);

      obj.widgetManager.setRenderer(obj.renderer);

      console.log("widgetManager", obj.widgetManager);
      console.log("rootState==", rootState, "toolsStore", toolsStore);
      console.log("toolsStore.widget", toolsStore.widget);
      console.log("view.viewType====", view.viewType);
      console.log(xyzToViewType[view.viewType]);

      const widgetInstance = obj.widgetManager.addWidget(
        toolsStore.widget,
        xyzToViewType[view.viewType],
      );
      console.log("widgetInstance====", widgetInstance);
      obj.widgetInstance = widgetInstance;
      console.log("widgetInstance=", obj.widgetInstance);
      obj.widgetManager.enablePicking();

      obj.reslice = vtkImageReslice.newInstance();
      obj.resliceMapper = vtkImageMapper.newInstance();
      obj.resliceMapper.setInputConnection(obj.reslice.getOutputPort());
      obj.resliceActor = vtkImageSlice.newInstance();
      obj.resliceActor.setMapper(obj.resliceMapper);
      console.log("UPDATE_MPR_VIEW---obj", obj, "mode--", mode);
      commit("UPDATE_MPR_VIEW", {
        ...obj,
        viewName: view.viewName,
        viewType: view.viewType,
        mode: mode,
        widgetInstance: obj.widgetInstance,
        renderer: obj.renderer,
        renderWindow: obj.renderWindow,
      });

      // 返回视图数据
      return {
        Ww: "",
        Wl: "",
        hu: "",
        sliceIndex: "",
        dimensions: "",
      };
    },

    async get3DView(store, payload) {
      const { commit, state, rootState, dispatch } = store;
      // const {
      //   imageData
      // } = payload;
      //this into payload is image func obj;
      const { view3D, imageData } = state;

      console.log("get3DView---imageData", imageData);

      view3D.renderer.removeAllViewProps();
      const mapper = vtkVolumeMapper.newInstance();
      mapper.setInputData(imageData);

      const actor = vtkVolume.newInstance();
      actor.setMapper(mapper);
      const sampleDistance =
        0.7 *
        Math.sqrt(
          imageData
            .getSpacing()
            .map((v) => v * v)
            .reduce((a, b) => a + b, 0),
        );
      mapper.setSampleDistance(sampleDistance);
      view3D.mapper = mapper;
      view3D.renderer.addActor(actor);
      view3D.renderer.resetCamera();

      updateEdgeGradient(store, {
        renderWindow: view3D.renderWindow,
        actor,
      });
    },

    async getSlice(store, payload) {
      console.log("store==getSlice", store);
      const { commit, state, rootState, dispatch } = store;
      const { viewsData } = state;
      const { toolsStore } = rootState;
      const image = payload;
      const dimensions = image.getDimensions();
      const spacing = image.getSpacing();
      // debugger;

      // 更新 Coronal、Axial、Sagittal 的 spacing 和 thickness
      commit("UPDATE_CORONAL_SPACING", spacing[0]);
      commit("UPDATE_CORONAL_THICKNESS", spacing[0]);
      commit("UPDATE_AXIAL_SPACING", spacing[2]);
      commit("UPDATE_AXIAL_THICKNESS", spacing[2]);
      commit("UPDATE_SAGITTAL_SPACING", spacing[1]);
      commit("UPDATE_SAGITTAL_THICKNESS", spacing[1]);

      // 设置 toolsStore.widget 的 image
      dispatch("toolsStore/setImage", image, {
        root: true,
      });
      // debugger;

      // 设置 picker
      const picker = vtkPicker.newInstance();

      // 遍历 viewMprViews 对象并更新状态
      state.viewMprViews.forEach((obj, index) => {
        // debugger;
        console.log("obj===viewMprViews", obj);
        // 更新 obj.dimensions
        obj.dimensions = image.getDimensions()[obj.viewMode];
        // state.viewsData[index].dimensions = image.getDimensions()[obj.viewMode];
        // Vue.set(state.viewsData[index], 'dimensions', image.getDimensions()[obj.viewMode]);
        const newViewsData = {
          ...state.viewsData[index],
        };
        newViewsData.dimensions = image.getDimensions()[obj.viewMode];
        commit("UPDATE_VIEWS_DATA", {
          index,
          newViewsData,
        });
        // 更新 obj.reslice
        obj.reslice.setInputData(image);

        // 添加 obj.resliceActor 到 renderer
        obj.renderer.addActor(obj.resliceActor);

        // 处理 coronalPlane 的 reversedNormal
        // if (obj.viewType === 1) {
        //    console.log("toolsStore__obj.viewType === 1", toolsStore);
        //    const coronalPlane = toolsStore.widget.getWidgetState().getPlanes()[xyzToViewType[obj.viewType]];
        //    const reversedNormal = coronalPlane['normal'].map((n) => -n);
        //    toolsStore.widget.getWidgetState().getPlanes()[xyzToViewType[obj.viewType]]['normal'] = [0];
        //  }

        if (obj.viewType == 1) {
          toolsStore.widget.getWidgetState().getPlanes()[
            xyzToViewType[obj.viewType]
          ]["normal"] = [0, 1, 0];
        }

        // 更新 interactor 的 interstyle
        const interstyle = obj.interactor.getInteractorStyle();
        interstyle.startCameraPose();

        // 绑定交互事件
        obj.interactor.onLeftButtonPress((event) =>
          handleLeftButtonPress(store, {
            event,
            obj,
            picker,
          }),
        );

        obj.interactor.onLeftButtonRelease(() =>
          handleMouseUp(store, {
            obj,
          }),
        );

        obj.interactor.onMouseMove((event) =>
          handleMouseMove(store, {
            event,
            obj,
            picker,
            toolsStore,
            image,
            viewsData,
            index,
          }),
        );

        obj.interactor.onEndMouseWheel(() => {
          handleendMouseWheel(store);
        });

        // 更新 viewMprViews 的 interactor 事件
        state.viewMprViews.forEach((v, index2) => {
          console.log("v.widgetInstance", v.widgetInstance, v);
          v.widgetInstance.onStartInteractionEvent(() => {
            dispatch(
              "toolsStore/updateReslice",
              {
                obj,
                objindex: index2,
                viewType: obj.viewType,
                reslice: obj.reslice,
                actor: obj.resliceActor,
                renderer: obj.renderer,
                resetFocalPoint: false,
                computeFocalPointOffset: true,
              },
              {
                root: true,
              },
            );
          });

          v.widgetInstance.onInteractionEvent((interactionMethodName) => {
            const canUpdateFocalPoint =
              interactionMethodName === InteractionMethodsName.RotateLine;
            const activeViewType = toolsStore.widget
              .getWidgetState()
              .getActiveViewType();
            const computeFocalPointOffset =
              activeViewType === obj.viewType || !canUpdateFocalPoint;
            dispatch(
              "toolsStore/updateReslice",
              {
                obj,
                objindex: index2,
                viewType: obj.viewType,
                reslice: obj.reslice,
                actor: obj.resliceActor,
                renderer: obj.renderer,
                resetFocalPoint: false,
                computeFocalPointOffset,
              },
              {
                root: true,
              },
            );
          });
        });

        // 更新 viewMprViews 的 interactor 事件
        dispatch(
          "toolsStore/updateReslice",
          {
            obj,
            objindex: index,
            viewType: obj.viewType,
            reslice: obj.reslice,
            actor: obj.resliceActor,
            renderer: obj.renderer,
            resetFocalPoint: true,
            computeFocalPointOffset: true,
          },
          {
            root: true,
          },
        );
      });

      // 初始化十字线
      initCrossHair(store);

      // 更新 widgetState 的 rotation 状态
      toolsStore.widget
        .getWidgetState()
        .getStatesWithLabel("rotation")
        .forEach((handle) => handle.setVisible(false));

      // 初始化窗口
      InitWindow(store, {
        ww: 1500,
        wl: -500,
      });

      console.log("store--store-store", store);

      // 更新 viewMprViews 的 interactor 事件
      state.viewMprViews.forEach((v, objindex) => {
        dispatch(
          "toolsStore/GetImagePage",
          {
            v,
            objindex,
          },
          {
            root: true,
          },
        );
      });
    },

    async initWindow({ commit }, { ww, wl }) {
      commit("SET_WINDOW_LEVEL", {
        ww,
        wl,
      });
    },

    // 根据Pinia中的ReadFile方法创建action
    async readFile({ commit, dispatch }, file) {
      // debugger
      try {
        // const image = await dispatch('readDicomFileSeries', file);
        // console.log("image========readFile", image);
        dispatch("readDicomFileSeries", file).then((image) => {
          console.log("get3DView-before-image", image);
          dispatch("get3DView", image); // 3d
          dispatch("getSlice", image);
        });

        // dispatch('initCoronalView', image);
        // dispatch('initAxialView', image);
        // dispatch('initSagittalView', image);
      } catch (err) {
        console.error("Error processing DICOM file series:", err);
      }
    },

    // 读取DICOM文件系列并处理图像数据
    async processDicomFiles({ commit }, files) {
      try {
        const dicomData = await readImageDicomFileSeries({
          inputImages: files,
        });
        const vtkImage = vtkITKHelper.convertItkToVtkImage(
          dicomData.outputImage,
        );
        commit("SET_IMAGE_DATA", vtkImage);
        // 处理完图像数据后，可能需要初始化视图或执行其他操作
        // 例如：this.initViews();
        console.log("vtkImage----", vtkImage, vtkImage.toJSON());
      } catch (error) {
        console.error("Error processing DICOM files:", error);
      }
    },

    // 初始化图像窗口和级别
    async initWindow({ commit }, { ww, wl }) {
      commit("SET_WINDOW_LEVEL", {
        ww,
        wl,
      });
      // 可能需要执行其他操作，例如更新图像的显示方式
    },

    // 应用裁剪平面
    async applyClipping({ commit, state }, { ijk1, ijk2 }) {
      const { imageData, view3D } = state;
      const dimensions = imageData.getDimensions();
      const clippingPlanes = [
        // 创建裁剪平面的逻辑
      ];

      view3D.mapper.removeAllClippingPlanes();
      clippingPlanes.forEach((plane) => {
        view3D.mapper.addClippingPlane(plane);
      });
      view3D.renderWindow.render();
    },

    // 重置裁剪平面
    async resetClippingPlanes({ commit, state }) {
      commit("REMOVE_ALL_CLIPPING_PLANES");
      // 可能需要执行其他操作，例如重新渲染视图
      state.view3D.renderWindow.render();
    },

    // 应用裁剪平面
    applyClipping({ commit, state }, payload) {
      // payload 应包含必要的参数，例如 point1 和 point2
      const { imageData, view3D } = state;
      const { point1, point2 } = payload;
      const dimensions = imageData.getDimensions();
      const ijk1 = [point1.x, point1.y, dimensions[2] - point1.z];
      const ijk2 = [point2.x, point2.y, dimensions[2] - point2.z];

      // 根据Pinia中的CubeClip方法逻辑创建裁剪平面并应用
      const clippingPlanes = createClippingPlanesFromIJK(
        ijk1,
        ijk2,
        imageData.getIndexToWorld(),
      );

      view3D.mapper.removeAllClippingPlanes();
      clippingPlanes.forEach((plane) => {
        view3D.mapper.addClippingPlane(plane);
      });
      view3D.renderWindow.render();
    },
  },
  getters: {},
};
