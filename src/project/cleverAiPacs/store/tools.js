import Vue from "vue";
import vtkResliceCursorWidget from "@kitware/vtk.js/Widgets/Widgets3D/ResliceCursorWidget";
import vtkImageMapper from "@kitware/vtk.js/Rendering/Core/ImageMapper";
import { xyzToViewType } from "@kitware/vtk.js/Widgets/Widgets3D/ResliceCursorWidget/Constants";
import vtkCubeSource from "@kitware/vtk.js/Filters/Sources/CubeSource";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkProperty from "@kitware/vtk.js/Rendering/Core/Property";
import { SlabTypes } from "@kitware/vtk.js/Rendering/Core/ImageResliceMapper/Constants";

import { vec3, quat, mat4 } from "gl-matrix";
import vtkPlane from "@kitware/vtk.js/Common/DataModel/Plane";

const Direction_Angle = {
  Top: 0,
  Bottom: 180,
  Left: 90,
  Right: 270,
};

export default {
  namespaced: true,
  state: {
    helloTools: "helloTools",

    widget: vtkResliceCursorWidget.newInstance(),
    crosshair: "lazy",
    intermode: "crosshair",
    cubes: {
      value: [],
      positions: new Set(),
    },
    autoPlayTimer: null,
  },
  mutations: {
    // 同步更新state的方法
    SET_WIDGET(state, widget) {
      state.widget = widget;
    },
    SET_CROSSHAIR(state, crosshair) {
      state.crosshair = crosshair;
    },
    SET_INTERMODE(state, intermode) {
      state.intermode = intermode;
    },
    SET_WIDGET_VISIBILITY(state, visible) {
      state.widget.setVisibility(visible);
    },
    SET_WINDOW_WIDTH(state, value) {
      state.windowWidth = value;
    },

    SET_WINDOW_LEVEL(state, value) {
      state.windowLevel = value;
    },
    // 其他mutations...
    // 假设我们需要一个mutation来重置工具状态
    RESET_TOOLS_STATE(state) {
      // 重置state的特定部分
      // 例如，重置窗口宽度和级别
      state.windowWidth = defaultWindowWidth;
      state.windowLevel = defaultWindowLevel;
      // 重置其他相关状态...
    },
  },
  actions: {
    setImage({ commit, state }, image) {
      // debugger
      state.widget.setImage(image);
    },
    // 异步操作或需要提交mutation的方法
    updateReslice({ commit, state }, interactionContext) {
      // console.log(
      //   "interactionContext---",
      //   interactionContext,
      //   "state",
      //   state,
      //   "state.widget.get",
      //   state.widget.get(),
      // );
      const { obj, viewType, reslice, actor, renderer } = interactionContext;

      const wgtPlanes = state.widget.getWidgetState().getPlanes()[
        xyzToViewType[viewType]
      ]; //new add
      // console.log("wgtPlanes==", wgtPlanes);
      // 假设widget是state中的一部分，并且有一个updateReslicePlane方法
      const modified = state.widget.updateReslicePlane(
        reslice,
        xyzToViewType[viewType],
      );

      if (modified) {
        // 更新actor的用户矩阵
        const resliceAxes = reslice.getResliceAxes();
        actor.setUserMatrix(resliceAxes);
      }

      // 更新相机点
      state.widget.updateCameraPoints(
        renderer,
        xyzToViewType[viewType],
        interactionContext.resetFocalPoint,
        interactionContext.computeFocalPointOffset,
      );

      // 特定于视图的相机位置调整
      if (viewType == 1) {
        const camera = interactionContext.renderer.getActiveCamera();

        const preposition = camera.getPosition();
        const focalpoint = camera.getFocalPoint();
        camera.setPosition(
          preposition[0],
          focalpoint[1] * 2 - preposition[1],
          preposition[2],
        );
      }

      // // 重置相机以更新视图
      // renderer.resetCamera();
      // const camera = renderer.getActiveCamera();
      // camera.zoom(1.3);

      // 渲染交互器
      // obj.interactor.render();
      const camera = renderer.getActiveCamera();
      if (interactionContext.resetFocalPoint) {
        renderer.resetCamera();
        const bounds = interactionContext.actor.getBounds();

        // console.log(interactionContext.renderer);
        const point1 = interactionContext.renderer.worldToNormalizedDisplay(
          bounds[0],
          bounds[2],
          bounds[4],
          true,
        );
        const point2 = interactionContext.renderer.worldToNormalizedDisplay(
          bounds[1],
          bounds[3],
          bounds[5],
          true,
        );
        // console.log(obj);
        const container = obj.grw.getContainer();
        const { width: containerWidth, height: containerHeight } =
          container.getBoundingClientRect();
        // console.log(containerWidth, containerHeight);
        const scalex = 1 / Math.abs(point1[0] - point2[0]);
        const scaley = 1 / Math.abs(point1[1] - point2[1]);
        // console.log(scalex, scaley);
        // console.log(
        //   Math.abs(point1[0] - point2[0]) * containerWidth,
        //   Math.abs(point1[1] - point2[1]) * containerHeight,
        // );
        let zoomFactor = Math.min(scalex, scaley);

        if (
          containerWidth * Math.abs(point1[0] - point2[0]) >
          containerHeight * Math.abs(point1[1] - point2[1])
        ) {
          zoomFactor = Math.max(scalex, scaley);
        }
        camera.zoom(zoomFactor);
      }
      if (viewType === 1) {
        camera.roll(Direction_Angle.Right);
      }
    },

    AutoPlay(viewType) {
      let i;
      let j;
      let k;
      let playPanelDimensions;
      viewsStore.viewsData.forEach((view) => {
        if (view.value.viewType === viewType) {
          playPanelDimensions = view.value.dimensions;
        }
        if (view.value.viewType == 1) {
          j = view.value.sliceIndex;
        } else if (view.value.viewType == 2) {
          k = view.value.sliceIndex;
        } else if (view.value.viewType == 0) {
          i = view.value.sliceIndex;
        }
      });
      // console.log([i, j, k])
      if (state.autoPlayTimer === null) {
        state.autoPlayTimer = setInterval(() => {
          if (viewType === 1) {
            // console.log([i, j++ % playPanelDimensions, k])
            ChangeImagePage([i, j++ % playPanelDimensions, k]);
          } else if (viewType === 2) {
            // console.log(i, j, k++ % playPanelDimensions)
            ChangeImagePage([i, j, k++ % playPanelDimensions]);
          } else if (viewType === 0) {
            // console.log(i)
            i = i++ % playPanelDimensions;
            // console.log(i)
            ChangeImagePage([i++ % playPanelDimensions, j, k]);
          }
        }, 100); // 每秒打印一次
      } else {
        clearInterval(autoPlayTimer);
        state.autoPlayTimer = null;
      }
    },
    ReverseWindow(reversed) {
      // 创建颜色传输函数以实现负片效果
      viewsStore.viewMprViews.forEach((obj) => {
        const colorTransferFunction = vtkColorTransferFunction.newInstance();
        // 定义关键点，插值映射
        if (reversed) {
          colorTransferFunction.addRGBPoint(0, 1, 1, 1); // 白色
          colorTransferFunction.addRGBPoint(255, 0, 0, 0); // 黑色
        } else {
          colorTransferFunction.addRGBPoint(255, 1, 1, 1); // 白色
          colorTransferFunction.addRGBPoint(0, 0, 0, 0); // 黑色
        }
        obj.resliceActor
          .getProperty()
          .setRGBTransferFunction(0, colorTransferFunction);
        obj.interactor.render();
      });
    },

    toggleUpdateStartPan({ commit, state, rootState, dispatch }, payload) {
      const { viewsStore } = rootState;
      const v_state = viewsStore;
      // console.log("toggleUpdateStartPan", payload);
      if (payload) {
        commit("SET_INTERMODE", "pan");
        commit("SET_WIDGET_VISIBILITY", false);
      } else {
        commit("SET_INTERMODE", "pan-off");
        commit("SET_WIDGET_VISIBILITY", false);
      }
      // 更新reslice和相机点
      v_state.viewMprViews.forEach((obj, objindex) => {
        // 调用updateReslice action
        commit("updateReslice", {
          obj,
          objindex,
          viewType: obj.viewType,
          reslice: obj.reslice,
          actor: obj.resliceActor,
          renderer: obj.renderer,
          resetFocalPoint: true,
          computeFocalPointOffset: true,
        });
        obj.interactor.render();
      });
    },
    StartPan({ commit }) {
      // 改变交互模式为平移
      commit("SET_INTERMODE", "pan");
      // 隐藏十字线
      commit("SET_CROSSHAIR", "hidden");
      // 显示widget
      commit("SET_WIDGET_VISIBILITY", true);
    },
    toggleUpdateCrossHair({ commit, state, rootState, dispatch }, payload) {
      const { viewsStore } = rootState;
      const v_state = viewsStore;
      // console.log("toggleUpdateCrossHair", payload);
      // 十字线初始的交互不做更改
      if (payload) {
        // 显示十字线
        commit("SET_CROSSHAIR", "visible");
        // 显示widget
        commit("SET_WIDGET_VISIBILITY", true);
      } else {
        // 隐藏十字线
        commit("SET_CROSSHAIR", "hidden");
        // 显示widget
        commit("SET_WIDGET_VISIBILITY", false);
      }
      // 更新reslice和相机点
      v_state.viewMprViews.forEach((obj, objindex) => {
        // 调用updateReslice action
        commit("updateReslice", {
          obj,
          objindex,
          viewType: obj.viewType,
          reslice: obj.reslice,
          actor: obj.resliceActor,
          renderer: obj.renderer,
          resetFocalPoint: true,
          computeFocalPointOffset: true,
        });
        obj.interactor.render();
      });
    },
    UpdateDirection({}) {},

    CrossHair({ commit, state, rootState, dispatch }) {
      const { viewsStore } = rootState;
      const v_state = viewsStore;
      // 改变交互模式为十字线
      commit("SET_INTERMODE", "crosshair");
      // 显示十字线
      commit("SET_CROSSHAIR", "visible");
      // 隐藏widget
      commit("SET_WIDGET_VISIBILITY", false);
      // 更新reslice和相机点
      v_state.viewMprViews.forEach((obj, objindex) => {
        // 调用updateReslice action
        commit("updateReslice", {
          obj,
          objindex,
          viewType: obj.viewType,
          reslice: obj.reslice,
          actor: obj.resliceActor,
          renderer: obj.renderer,
          resetFocalPoint: true,
          computeFocalPointOffset: true,
        });
        obj.interactor.render();
      });
    },
    /*start--- test action */
    actRun({ dispatch, commit, getters }, payload) {
      // console.log("dispatch=", dispatch);
      // console.log("commit=", commit);
      // console.log("getters=", getters.getmod_viewsStore);
      // console.log("payload=", payload);
    },

    updateActRun({ commit, state, rootState }, value) {
      // console.log("~:commit=", commit);
      // console.log("~:state=", state);
      // console.log("~:value=", value);
      // console.log("~:rootState=", rootState);
      // rootState.viewsStore.view3D = {
      //   a: 1
      // };
    },
    /*end--- test action */

    UpdateColorWindow({ commit, state, rootState, dispatch }, value) {
      // const {
      //   viewsStore
      // } = rootState;
      // const v_state = viewsStore;
      // debugger;
      dispatch("viewsStore/UpdateColorWindow_self", value, {
        root: true,
      });
      // state.viewsStore
      /*  v_state.viewMprViews.forEach((obj, objindex) => {
         // const viewData = v_state.viewsData[objindex];
         // viewData.Ww = value; // 假设Ww是视图数据的一部分

         dispatch('viewsStore/updateViewData', {
           objindex, // 你要更新的对象在 viewsData 中的索引
           attributes: { // 要设置的属性值
             Ww: value,
             // 更多的属性可以添加到这里
           }
         }, {
           root: true
         });

         obj.resliceActor.getProperty().setColorWindow(value);
         obj.interactor.render();
       }); */
    },

    UpdateColorLevel({ commit, state, rootState, dispatch }, value) {
      // debugger
      dispatch("viewsStore/UpdateColorLevel_self", value, {
        root: true,
      });
      /*     const {
            viewsStore
          } = rootState;
          const v_state = viewsStore;
          // state.viewsStore.
          v_state.viewMprViews.forEach((obj, objindex) => {
            // const viewData = state.viewsStore.viewsData[objindex];
            // viewData.Wl = value; // 假设Wl是视图数据的一部分
            dispatch('viewsStore/updateViewData', {
              objindex, // 你要更新的对象在 viewsData 中的索引
              attributes: { // 要设置的属性值
                Wl: value,
                // 更多的属性可以添加到这里
              }
            }, {
              root: true
            });

            obj.resliceActor.getProperty().setColorLevel(value);
            obj.interactor.render();
          }); */
    },
    ChangeSlabMode({ commit, state, rootState, dispatch }, mode) {
      const { viewsStore } = rootState;
      const v_state = viewsStore;

      v_state.viewMprViews.forEach((obj) => {
        if (mode === "min") {
          obj.reslice.setSlabMode(SlabTypes.MIN);
          obj.reslice.setSlabNumberOfSlices(25); // 例子中的值
          obj.reslice.setSlabSliceSpacingFraction(1.0); // 例子中的值
          obj.reslice.setSlabTrapezoidIntegration(true);
        } else if (mode === "max") {
          obj.reslice.setSlabMode(SlabTypes.MAX);
        }
        obj.interactor.render();
      });
    },
    ChangeImagePage({ commit, state, rootState, dispatch }, ijk) {
      const { viewsStore } = rootState;
      const v_state = viewsStore;

      const imageData = v_state.imageData;
      const { origin, spacing, dimensions } = imageData;

      const newCenter = ijk.map((coordinate, index) => {
        return origin[index] + coordinate * spacing[index];
      });

      state.widget.setCenter(newCenter);

      v_state.viewMprViews.forEach((obj, objindex) => {
        commit("updateReslice", {
          obj,
          objindex,
          viewType: obj.viewType,
          reslice: obj.reslice,
          actor: obj.resliceActor,
          renderer: obj.renderer,
          resetFocalPoint: true,
          computeFocalPointOffset: true,
        });
        obj.interactor.render();
      });
    },

    GetImagePage({ commit, state, rootState, dispatch }, obj) {
      const { v, objindex } = obj;
      const { viewsStore } = rootState;
      const v_state = viewsStore;

      const widgetState = state.widget.getWidgetState();
      const center = widgetState.getCenter(); // 获取当前的中心点
      const ijkCoords = v_state.imageData.worldToIndex(center); // 将世界坐标转换为图像坐标
      const ijk = ijkCoords.map((coord) => Math.round(coord));

      const dirProj = widgetState.getPlanes()[xyzToViewType[v.viewType]].normal;
      let sliceIndex = 0;
      dirProj.forEach((item, index) => {
        if (item !== 0) {
          sliceIndex = ijk[index];
        }
      });

      // 根据视图模式设置sliceIndex
      if (v.viewMode === vtkImageMapper.SlicingMode.K) {
        // v_state.viewsData[obj.objindex].sliceIndex =
        //   v_state.imageData.getDimensions()[0] - sliceIndex;

        dispatch(
          "viewsStore/updateViewData",
          {
            objindex, // 你要更新的对象在 viewsData 中的索引
            attributes: {
              // 要设置的属性值
              sliceIndex: v_state.imageData.getDimensions()[0] - sliceIndex,
              // 更多的属性可以添加到这里
            },
          },
          {
            root: true,
          },
        );
      } else {
        // v_state.viewsData[obj.objindex].sliceIndex = sliceIndex;

        dispatch(
          "viewsStore/updateViewData",
          {
            objindex, // 你要更新的对象在 viewsData 中的索引
            attributes: {
              // 要设置的属性值
              sliceIndex,
              // 更多的属性可以添加到这里
            },
          },
          {
            root: true,
          },
        );
      }

      // 可以提交一个mutation来更新state，如果需要的话
      // commit('SET_SLICE_INDEX', { index: sliceIndex, viewType: obj.viewType });
    },
    // 其他actions...
    AddCube({ commit, state, rootState, dispatch }, { size, position }) {
      const { viewsStore } = rootState;
      const v_state = viewsStore.state;

      // const {
      //   viewsStore,
      //   widget
      // } = state;
      const { widget } = state;

      const { origin, spacing, dimensions } = viewsStore.imageData;

      const newCenter = position.map((coordinate, index) => {
        return (
          origin[index] +
          (coordinate * spacing[index] -
            (dimensions[index] * spacing[index]) / 2)
        );
      });

      const cubeSource = vtkCubeSource.newInstance({
        xLength: size[0] * spacing[0],
        yLength: size[1] * spacing[1],
        zLength: size[2] * spacing[2],
      });
      cubeSource.setCenter(...newCenter);

      const cubeMapper = vtkMapper.newInstance();
      cubeMapper.setInputConnection(cubeSource.getOutputPort());

      const cubeActor = vtkActor.newInstance();
      const property = vtkProperty.newInstance();
      property.setColor(1, 1, 0); // 黄色
      property.setOpacity(0.5);

      cubeActor.setProperty(property);
      cubeActor.setMapper(cubeMapper);

      // 添加到3D视图的渲染器
      viewsStore.view3D.renderer.addActor(cubeActor);
      viewsStore.view3D.renderWindow.render();

      // 确保立方体也出现在MPR视图中
      viewsStore.viewMprViews.forEach((view) => {
        view.renderer.addActor(cubeActor);
        view.renderWindow.render();
      });

      // 更新立方体集合
      const positionKey = position.toString();
      if (!state.cubes.positions.has(positionKey)) {
        state.cubes.positions.add(positionKey);
        state.cubes.value.push({
          actor: cubeActor,
          position: position,
        });
      }
    },

    // 假设我们有一个初始化方法
    initTools({ commit, state }) {
      // 执行初始化逻辑
      // 可能涉及到设置初始状态或执行其他actions
    },

    // 假设我们有一个重置方法
    resetTools({ commit, state }) {
      // 执行重置逻辑
      // 可能涉及到重置state或执行其他actions
    },
  },
  getters: {
    combinedState(state, getters, rootState) {
      console.log("rootState==", rootState);
      // viewsStore
      return "combinedState";
    },
    getmod_viewsStore(state, getters, rootState) {
      return rootState.viewsStore;
    },
  },
};
