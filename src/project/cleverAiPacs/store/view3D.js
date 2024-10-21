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
import vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane'
import { mat4, vec3, quat } from 'gl-matrix'

import vtkITKHelper from "@kitware/vtk.js/Common/DataModel/ITKHelper";
import { niftiReadImage} from "@itk-wasm/image-io"
import vtkCubeSource from '@kitware/vtk.js/Filters/Sources/CubeSource'
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper'
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor'
import vtkProperty from '@kitware/vtk.js/Rendering/Core/Property'

import { xhr_getModel3d } from "@/api";

const VIEW_COLORS = {
  // BACKGROUND: [0.5, 0.5, 0.5]
  // BACKGROUND: [0, 0, 0]
  BACKGROUND: [1,1,1]

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
    SET_VIEW_ITEM(state, { key, value}) {
      state.view3D[key] = value;
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
      // camera.setPosition(0, 1, 0) // 从 Y 轴负方向看向原点
      // camera.setFocalPoint(0, 0, 0) // 设置相机焦点为原点
      // camera.setViewUp(0, 0, 1) // 设置相机的上方向为 Z 轴正方向
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

      const fileReader = new FileReader();
      try {
        const res = await xhr_getModel3d({
          seriesId: seriesId,
        });

        if (res) {
          const blob = res.data;

          if (blob) {
            const segpart = 'lung'
        console.log("blob=====================",blob)
        const file = new File([blob], "example.nii.gz");
        niftiReadImage(file).then((res)=>{
          const outputImage = res.image;
          const imageData = vtkITKHelper.convertItkToVtkImage(outputImage);
          console.log("imageData", imageData);
          const newDirection = [
            1,  0,  0,  // 第一行
            0,  0, -1,  // 第二行
            0,  1,  0   // 第三行
          ]

          // const newDirection = [
          //   1,  0,  0,  // 第一行
          //   0,  0, 1,  // 第二行
          //   0,  1,  0   // 第三行
          // ]
          // // 应用新的方向矩阵
          imageData.setDirection(newDirection);

          const mapper = vtkVolumeMapper.newInstance();

          mapper.setInputData(imageData);
          commit("SET_VIEW_ITEM", { key: "image", value: imageData });
          state.view3D.actor.setMapper(mapper);
          commit("SET_MAPPER", mapper);
          dispatch("updateEdgeGradient",segpart)

          // Calculate the center of the model
          const bounds = imageData.getBounds(); // [xmin, xmax, ymin, ymax, zmin, zmax]
          console.log(imageData.getDimensions())
          const centerX = (bounds[0] + bounds[1]) / 2;
          const centerY = (bounds[2] + bounds[3]) / 2;
          const centerZ = (bounds[4] + bounds[5]) / 2;

          // Set the camera to focus on the model center
          const renderer = state.view3D.renderer;
          const camera = renderer.getActiveCamera();
          console.log(camera)
          // camera.setFocalPoint(centerX, centerY, centerZ);
          // camera.setPosition(centerX, centerY, bounds[5] + (bounds[5] - bounds[4]) * 2);
          // camera.setViewUp(0, 1, 0);
          // camera.setClippingRange(0.1, 1000);

          // Optional: Adjust sample distance if needed
          // mapper.setSampleDistance(sampleDistance);

          // Render the scene
          const renderWindow = state.view3D.renderWindow;
          renderWindow.render();


          dispatch("AddCube")
        })
          }
          // this.onWindowResize()

        } else {
          console.error("Request failed: No data returned");
        }
      } catch (error) {
        console.error("Request failed:", error);
      }


    },

   updateEdgeGradient({state},segpart){
      const renderWindow = state.view3D.renderWindow
      const actor = state.view3D.actor
      const color = vtkColorTransferFunction.newInstance()
      const opacity = vtkPiecewiseFunction.newInstance()
      const gradientOpacity = vtkPiecewiseFunction.newInstance()
      const volumeProperty = actor.getProperty();
      console.log(segpart)
      if(segpart == 'lung'){
        color.addRGBPoint(-1000, 0.302, 0.302, 1.0)
            color.addRGBPoint(-900, 0.0, 0.0, 1.0)
            color.addRGBPoint(-800, 0.133, 0.78, 0.071)
            color.addRGBPoint(-560, 0.929, 1.0, 0.110)
            color.addRGBPoint(-300, 0.890, 0.255, 0.024)
            color.addRGBPoint(2952, 1.0, 0.302, 0.302)
            color.addRGBPoint(-100, 0.6, 1.0, 0.8)
            color.addRGBPoint(110, 0.3, 1.0, 0.5);

            opacity.addPoint(-1000.0, 0.0);
            opacity.addPoint(-300.0, 0.2);
            opacity.addPoint(-500.0, 0.6);
            opacity.addPoint(0.0, 0.5);
            opacity.addPoint(500.0, 0.8);

            volumeProperty.setGradientOpacityMinimumValue(0, 1);
            volumeProperty.setGradientOpacityMinimumOpacity(0, 0.0);
            volumeProperty.setGradientOpacityMaximumValue(0, 600);
            volumeProperty.setGradientOpacityMaximumOpacity(0, 1.0);
            volumeProperty.setScalarOpacityUnitDistance(0, 8.0);


      }else if(segpart == 'rib'){
        color.addRGBPoint(-2048, 0,0,0)
        color.addRGBPoint(128, 0.0, 0.0, 0.0)
        color.addRGBPoint(160,0.62, 0.00, 0.02)
        color.addRGBPoint(173, 0.91, 0.45, 0.00)
        color.addRGBPoint(255, 0.89, 0.89, 0.89)
        color.addRGBPoint(585, 0.97, 0.97, 0.97)

        opacity.addPoint(-3048, 0.0)
        opacity.addPoint(0, 0.0)
        opacity.addPoint(50, 0.8)
        opacity.addPoint(200, 0.95)
        opacity.addPoint(400, 1)
        opacity.addPoint(3000, 1.0)
        volumeProperty.setScalarOpacityUnitDistance(0, 8.0);
      }

      volumeProperty.setRGBTransferFunction(0, color);
      volumeProperty.setScalarOpacity(0, opacity);
      volumeProperty.setInterpolationTypeToLinear();
      volumeProperty.setUseGradientOpacity(0, true);
      volumeProperty.setShade(true);
      volumeProperty.setAmbient(0.2);
      volumeProperty.setDiffuse(0.7);
      volumeProperty.setSpecular(0.3);
      volumeProperty.setSpecularPower(8.0);

    },
    AddCube({commit,dispatch,state}){
      const view = state.view3D
      const imageData = view.image
      const dimensions = imageData.getDimensions()
      const ijk1 = [dimensions[0] - 157,dimensions[1] - 178, dimensions[2] - 32]
      const ijk2 =[dimensions[0] - 180,dimensions[1] -  202, dimensions[2] - 46]
      // 157,180,178,202,32,46

      const iMin = Math.min(ijk1[0], ijk2[0])
      const iMax = Math.max(ijk1[0], ijk2[0])
      const jMin = Math.min(ijk1[1], ijk2[1])
      const jMax = Math.max(ijk1[1], ijk2[1])
      const kMin = Math.min(ijk1[2], ijk2[2])
      const kMax = Math.max(ijk1[2], ijk2[2])

      const origin = imageData.indexToWorld([iMin, jMin, kMin])
      const corner = imageData.indexToWorld([iMax, jMax, kMax])

      const newCenter = [
        (origin[0] + corner[0]) / 2,
        (origin[1] + corner[1]) / 2,
        (origin[2] + corner[2]) / 2,
      ]
      const cubeSource = vtkCubeSource.newInstance({
        xLength: Math.abs(corner[0]-origin[0]),
        yLength: Math.abs(corner[1]-origin[1]),
        zLength: Math.abs(corner[2]-origin[2]),
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
      view.renderer.addActor(cubeActor);
      view.renderWindow.render();
    },
    Back({commit,dispatch,state}){
      const view = state.view3D
      view.mapper.removeAllClippingPlanes()
      view.renderWindow.render();
    },

    CubeClip({commit,dispatch,state}){
      // dispatch("AddCube")


      const view = state.view3D
      const imageData = view.image

      const dimensions = imageData.getDimensions()

      // const ijk1 =  [157, 178, dimensions[2] - 100]
      // const ijk2 = [300, 350, dimensions[2] - 20]

      const ijk1 = [157, 250, dimensions[2] - 32]
      const ijk2 =[180, 280, dimensions[2] - 66]


      // 确定裁剪平面的范围
      const iMin = Math.min(ijk1[0], ijk2[0])
      const iMax = Math.max(ijk1[0], ijk2[0])
      const jMin = Math.min(ijk1[1], ijk2[1])
      const jMax = Math.max(ijk1[1], ijk2[1])
      const kMin = Math.min(ijk1[2], ijk2[2])
      const kMax = Math.max(ijk1[2], ijk2[2])
      const origin = imageData.indexToWorld([iMin, jMin, kMin])
      const corner = imageData.indexToWorld([iMax, jMax, kMax])

      // 获取旋转变换
      const rotation = quat.create()
      mat4.getRotation(rotation, imageData.getIndexToWorld())

      // 旋转向量
      const rotateVec = (vec) => {
        const out = [0, 0, 0]
        vec3.transformQuat(out, vec, rotation)
        return out
      }

      // 确定原点和角点

      console.log('Origin:', origin);
      console.log('Corner:', corner);


      // 创建裁剪平面
      const clippingPlanes = [
        vtkPlane.newInstance({ normal: rotateVec([1, 0, 0]), origin }),
        vtkPlane.newInstance({ normal: rotateVec([-1, 0, 0]), origin: corner }),
        vtkPlane.newInstance({ normal: rotateVec([0, 1, 0]), origin }),
        vtkPlane.newInstance({ normal: rotateVec([0, -1, 0]), origin: corner }),
        vtkPlane.newInstance({ normal: rotateVec([0, 0, 1]), origin }),
        vtkPlane.newInstance({ normal: rotateVec([0, 0, -1]), origin: corner })
      ]
      clippingPlanes.forEach((plane, index) => {
        console.log(`Clipping plane ${index}:`, plane.getNormal());
      });

      // 移除现有的裁剪平面并添加新的裁剪平面
      view.mapper.removeAllClippingPlanes()

      view.mapper.addClippingPlane(clippingPlanes[0])
      view.mapper.addClippingPlane(clippingPlanes[1])


      view.mapper.addClippingPlane(clippingPlanes[2])
      view.mapper.addClippingPlane(clippingPlanes[3])


      view.mapper.addClippingPlane(clippingPlanes[4])
      view.mapper.addClippingPlane(clippingPlanes[5])



      // clippingPlanes.forEach((plane) => {
      //   view.mapper.addClippingPlane(plane)
      //   console.log(plane.get())
      // })

      // 更新并渲染视图
      view.renderWindow.render();
      console.log('Clipping applied and rendering updated');

    }
,

    setupCamera({commit, state, getters}) {
      console.log("更新相机")
      const view = state.view3D;
      const image = view.image

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



      view.renderWindow.render();
    },


    resize3DView({dispatch, state, getters, commit}) {
      const view = state.view3D
      const container = view.grw.getContainer();

      const {width, height} = container.getBoundingClientRect();

      view.grw.resize(width, height);
      view.renderWindow.render();
    },

  },


};





