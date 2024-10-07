import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow'
import vtkAnnotatedCubeActor from '@kitware/vtk.js/Rendering/Core/AnnotatedCubeActor'
import vtkOrientationMarkerWidget from '@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget'
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume'
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper'
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction'
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction'
import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader';
import vtkXMLImageDataReader from '@kitware/vtk.js/IO/XML/XMLImageDataReader';

import { xhr_getModel3d } from "@/api";

const VIEW_COLORS = {
  // BACKGROUND: [0.5, 0.5, 0.5]
  BACKGROUND: [0, 0, 0]
};

export default {
  namespaced: true,
  state: {
    view3D:{


    },
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    model: null,
  },
  mutations: {
    INIT_VIEW(state, scene) { state.view3D = scene; },
    SET_MAPPER(state, mapper) {
      state.view3D.mapper = mapper;
      state.view3D.actor.setMapper(state.view3D.mapper)
      state.view3D.renderer.addActor(state.view3D.actor)
      state.view3D.renderer.resetCamera()
    },
    SET_RENDERER(state, renderer) { state.renderer = renderer; },
    REMOVE_ALL_VIEW_PROPS(state, controls) {
        console.log(state.view3D)
        state.view3D.renderer.removeAllViewProps()
    },
    SET_MODEL(state, model) { state.model = model; },
  },
  actions: {
    async Init3DScene({ commit,dispatch }, container) {
      console.log("初始化场景")
      const grw = vtkGenericRenderWindow.newInstance();
      grw.setContainer(container);
      const {width, height} = container.getBoundingClientRect();
      grw.resize(width, height);
      const obj = {
        grw,
        renderWindow: grw.getRenderWindow(),
        renderer: grw.getRenderer(),
        mapper:null,
        actor:vtkVolume.newInstance()
      };
      obj.renderer.setBackground(...VIEW_COLORS.BACKGROUND);

      const oriencube = await dispatch("getAnnotatedCube");

      obj.orientationWidget = vtkOrientationMarkerWidget.newInstance({
        actor: oriencube,
        interactor: obj.renderWindow.getInteractor()
      })
      obj.orientationWidget.setEnabled(true)
      obj.orientationWidget.setViewportCorner(
        vtkOrientationMarkerWidget.Corners.BOTTOM_LEFT
      )
      //修改方向标记尺寸
      obj.orientationWidget.setViewportSize(0.1)
      obj.orientationWidget.setMinPixelSize(80)
      obj.orientationWidget.setMaxPixelSize(100)
      commit("INIT_VIEW",obj)
      const camera = obj.renderer.getActiveCamera()
      camera.setPosition(0, 1, 0) // 从 Y 轴负方向看向原点
      camera.setFocalPoint(0, 0, 0) // 设置相机焦点为原点
      camera.setViewUp(0, 0, 1) // 设置相机的上方向为 Z 轴正方向
      camera.zoom(10)
    },
    getAnnotatedCube(){
      const cube = vtkAnnotatedCubeActor.newInstance()
      cube.setDefaultStyle({
        text: 'F', // 通用前面文字
        fontStyle: 'bold',
        fontFamily: 'Arial',
        fontColor: 'black',
        fontSizeScale: (res) => res / 2.2,
        faceRotation: 180,
        edgeThickness: 0.05,
        edgeColor: 'black',
        resolution: 400
      })
      // 设置每个面的标签，确保其与标准医学方向一致
      cube.setXPlusFaceProperty({ text: 'L' }) // 左（Left）
      cube.setXMinusFaceProperty({ text: 'R' }) // 右（Right）
      cube.setYPlusFaceProperty({ text: 'A' }) // 前（Anterior）
      cube.setYMinusFaceProperty({ text: 'P' }) // 后（Posterior）
      cube.setZPlusFaceProperty({ text: 'S' }) // 上（Superior）
      cube.setZMinusFaceProperty({ text: 'I' }) // 下（Inferior）
      return cube
    },
    // Init3DView({state,commit},imageData){
    async Init3DView({state,commit,dispatch},seriesId){
      console.log(seriesId);

      commit("REMOVE_ALL_VIEW_PROPS")

      try {
        const res = await xhr_getModel3d({
          // seriesId: "1843172988066783234",
          seriesId:seriesId
        });

        if (res) {
          const arraybuffer = res.data;
          if (arraybuffer) {
            const vtiReader = vtkXMLImageDataReader.newInstance();
            vtiReader.parseAsArrayBuffer(arraybuffer);

            const imageData = vtiReader.getOutputData(0);
            console.log("imageData",imageData)
            const mapper = vtkVolumeMapper.newInstance()
            mapper.setInputData(imageData)

            state.view3D.actor.setMapper(mapper)
            const sampleDistance =
              0.7 *
              Math.sqrt(
                imageData
                  .getSpacing()
                  .map((v) => v * v)
                  .reduce((a, b) => a + b, 0)
              )
              console.log(sampleDistance/5);

            mapper.setSampleDistance(sampleDistance)
            commit("SET_MAPPER",mapper)
            dispatch("updateEdgeGradient",imageData)
            dispatch("resize3DView")
          }
          this.onWindowResize()

        } else {
          console.error("Request failed: No data returned");
        }
      } catch (error) {
        console.error("Request failed:", error);
      }

      // fetch('/img/rib.vti')
      // .then(response => response.arrayBuffer())
      // .then(buffer => {
      //   const vtiReader = vtkXMLImageDataReader.newInstance();
      //   vtiReader.parseAsArrayBuffer(buffer);

      //   const imageData = vtiReader.getOutputData(0);
      //   console.log("imageData",imageData)
      //   const mapper = vtkVolumeMapper.newInstance()
      //   mapper.setInputData(imageData)

      //   state.view3D.actor.setMapper(mapper)
      //   const sampleDistance =
      //     0.7 *
      //     Math.sqrt(
      //       imageData
      //         .getSpacing()
      //         .map((v) => v * v)
      //         .reduce((a, b) => a + b, 0)
      //     )
      //     console.log(sampleDistance/5);

      //   mapper.setSampleDistance(sampleDistance)
      //   commit("SET_MAPPER",mapper)
      //   dispatch("updateEdgeGradient",imageData)
      //   dispatch("resize3DView")

      // })

    },

   updateEdgeGradient({state},imageData){
      const renderWindow = state.view3D.renderWindow
      const actor = state.view3D.actor


      const lookupTable = vtkColorTransferFunction.newInstance()

      lookupTable.addRGBPoint(-2048, 0,0,0)
      lookupTable.addRGBPoint(128, 0.0, 0.0, 0.0)
      lookupTable.addRGBPoint(130,0.62, 0.00, 0.02)
      lookupTable.addRGBPoint(173, 0.91, 0.45, 0.00)

      lookupTable.addRGBPoint(255, 0.89, 0.89, 0.89)
      lookupTable.addRGBPoint(585, 0.97, 0.97, 0.97)
      lookupTable.addRGBPoint(3000,1,1,1)

      const piecewiseFunction = vtkPiecewiseFunction.newInstance()

      piecewiseFunction.addPoint(-2048, 0.0)
      piecewiseFunction.addPoint(0, 0.0)

      piecewiseFunction.addPoint(100, 0.85)
      piecewiseFunction.addPoint(173, 0.9)
      piecewiseFunction.addPoint(255, 0.95)
      piecewiseFunction.addPoint(584, 1)
      piecewiseFunction.addPoint(3000, 1.0)

      const volumeProperty = actor.getProperty();
      volumeProperty.setInterpolationTypeToLinear();

      volumeProperty.setRGBTransferFunction(0, lookupTable)
      volumeProperty.setScalarOpacity(0, piecewiseFunction)
      volumeProperty.setAmbient(0.12)
      volumeProperty.setDiffuse(1.0)
      renderWindow.render()
    }

  },
  // setupCamera({commit, state, getters}) {
  //   const view = state.view3D;

  //   const camera = view.renderer.getActiveCamera();

  //   camera.setParallelProjection(true);
  //   const bounds = image.getBounds();
  //   const [centerX, centerY, centerZ] = [
  //     (bounds[0] + bounds[1]) / 2,
  //     (bounds[2] + bounds[3]) / 2,
  //     (bounds[4] + bounds[5]) / 2,
  //   ];
  //   camera.setFocalPoint(centerX, centerY, centerZ);
  //   camera.setPosition(centerX, centerY, centerZ - 1);
  //   camera.setViewUp(0, -1, 0);
  //   view.renderer.resetCamera();

  //   const [point1, point2] = [
  //     view.renderer.worldToNormalizedDisplay(
  //       bounds[0],
  //       bounds[2],
  //       bounds[4],
  //       true,
  //     ),
  //     view.renderer.worldToNormalizedDisplay(
  //       bounds[1],
  //       bounds[3],
  //       bounds[5],
  //       true,
  //     ),
  //   ];
  //   const {width: containerWidth, height: containerHeight} = view.grw
  //     .getContainer()
  //     .getBoundingClientRect();

  //   const zoomrate = containerWidth * Math.abs(point1[0] - point2[0]) <
  //     containerHeight * Math.abs(point1[1] - point2[1])
  //     ? Math.max(
  //       1 / Math.abs(point1[0] - point2[0]),
  //       1 / Math.abs(point1[1] - point2[1]),
  //     )
  //     : Math.min(
  //       1 / Math.abs(point1[0] - point2[0]),
  //       1 / Math.abs(point1[1] - point2[1]),
  //     )
  //   camera.zoom(
  //     zoomrate
  //   );
  //   camera.roll(getters.viewsData[viewType].cameraRotate);



  //   view.renderWindow.render();
  // },
  resize3DView({dispatch, state, getters, commit}) {
    const view = state.view3D
    const container = view.grw.getContainer();

    const {width, height} = container.getBoundingClientRect();

    view.grw.resize(width, height);
    view.renderWindow.render();
  },

};





