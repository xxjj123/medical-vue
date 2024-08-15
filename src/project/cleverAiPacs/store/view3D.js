import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkOrientationMarkerWidget from "@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget";
import vtkAnnotatedCubeActor from "@kitware/vtk.js/Rendering/Core/AnnotatedCubeActor";

const VIEW_COLORS = {
  BACKGROUND: [0, 0, 0],
};

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

export default {
  namespaced: true,
  state: {
    view3D: {},
  },
  getters: {},
  mutations: {
    INIT_3D_VIEW(state, payload) {
      const { fullw } = payload;
      // debugger;
      const renderWindow = fullw.getRenderWindow();
      const renderer = fullw.getRenderer();
      // 使用Vue.set来确保新属性是响应式的
      state.view3D.renderWindow = renderWindow;
      state.view3D.renderer = renderer;

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
      state.view3D.orientationWidget = orientationWidget;
    },
  },
  actions: {
    async Init3DView({ commit ,dispatch }, container) {
      const fullw = vtkFullScreenRenderWindow.newInstance({
        container: container,
        background: VIEW_COLORS.BACKGROUND,
      });

      // console.log("fullw___", fullw);
      // debugger;

      // 调用mutation更新state
      commit("INIT_3D_VIEW", {
        fullw,
      });
      dispatch("resize3DViews") ;
    },
    resize3DViews({ dispatch, state, getters, commit }) {
      const container = state.view3D.fullw.getContainer();
      const { width, height } = container.getBoundingClientRect();

      state.view3D.fullw.resize(width, height);
      state.view3D.renderWindow.render();
    },
  },
};
