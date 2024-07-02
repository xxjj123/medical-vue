import Vue from 'vue'

import '@kitware/vtk.js/Rendering/Profiles/All'
// import {
//   readImageDicomFileSeries
// } from '@itk-wasm/dicom'
import {
  readImageDicomFileSeries
} from '@itk-wasm/dicom';
import * as dicomW from '@itk-wasm/dicom';
import vtkITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper'
import vtkOrientationMarkerWidget from '@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget'
import vtkAnnotatedCubeActor from '@kitware/vtk.js/Rendering/Core/AnnotatedCubeActor'
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume'
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper'
import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow'
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper'
import vtkImageReslice from '@kitware/vtk.js/Imaging/Core/ImageReslice'
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice'
import vtkInteractorStyleImage from '@kitware/vtk.js/Interaction/Style/InteractorStyleImage'
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction'
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction'
import vtkWidgetManager from '@kitware/vtk.js/Widgets/Core/WidgetManager'
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow'
import {
  xyzToViewType,
  InteractionMethodsName
} from '@kitware/vtk.js/Widgets/Widgets3D/ResliceCursorWidget/Constants'
import vtkPicker from '@kitware/vtk.js/Rendering/Core/Picker'

import {
  vec3,
  quat,
  mat4
} from 'gl-matrix'
import vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane'



const VIEW_TYPES = {
  CORONAL: 1,
  AXIAL: 2,
  SAGITTAL: 0
}

const VIEW_NAMES = {
  CORONAL: 'coronal',
  AXIAL: 'axial',
  SAGITTAL: 'sagittal'
}

const VIEW_COLORS = {
  BACKGROUND: [0, 0, 0]
}


// 你可能需要添加一个辅助函数来创建裁剪平面
function createClippingPlanesFromIJK(ijk1, ijk2, indexToWorld) {
  // 根据ijk坐标和indexToWorld转换创建裁剪平面
  // 返回裁剪平面数组
}


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
    //更新viewsData的某个对象
    put_jsonOb_viewsData(state, payload) {
      const {
        index,
        newData
      } = payload;

      Object.assign(state.viewsData[index], newData);
    },
    SET_HELLOVIEWS(state, container) {
      state.helloViews = container;
    },
    INIT_3D_VIEW(state, container) {
      // 根据Pinia中的Init3DView方法逻辑更新state
    },
    INIT_CORONAL_VIEW(state, container) {
      // 根据Pinia中的InitCoronalView方法逻辑更新state
    },
    INIT_AXIAL_VIEW(state, container) {
      // 根据Pinia中的InitAxialView方法逻辑更新state
    },
    INIT_SAGITTAL_VIEW(state, container) {
      // 根据Pinia中的InitSagittalView方法逻辑更新state
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
      Vue.set(state, 'imageData', {
        ...state.imageData
      });
    },
    INIT_MPR_VIEW(state, {
      container,
      view,
      mode
    }) {
      // 根据Pinia中的InitMprView方法逻辑初始化MPR视图并更新state
      // 这里需要根据具体的逻辑来更新state
    },
    INIT_VIEWS(state) {
      // 根据state中的imageData初始化所有必要的视图
      // 这里需要根据具体的逻辑来更新state
      // 例如，初始化Axial, Sagittal, Coronal视图
    },


    /*   SET_WINDOW_LEVEL(state, {
        ww,
        wl
      }) {
        // 更新window width和level
        // 这里需要根据实际的state结构来设置
      }, */

    // 可能需要的其他mutations，例如设置窗口级别、裁剪平面等
    /* SET_WINDOW_LEVEL(state, windowLevel) {
      state.windowLevel = windowLevel;
    }, */
    SET_CLIPPING_PLANES(state, clippingPlanes) {
      state.clippingPlanes = clippingPlanes;
    },

    // 设置窗口级别
    SET_WINDOW_LEVEL(state, {
      ww,
      wl
    }) {
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
        ...view3DData
      };
    },


    // 移除所有裁剪平面
    REMOVE_ALL_CLIPPING_PLANES(state) {
      state.view3D.mapper.removeAllClippingPlanes();
    },




  },
  actions: {
    async init3DView({
      commit
    }, container) {
      // 调用mutation更新state
      commit('INIT_3D_VIEW', container);
    },
    async initCoronalView({
      commit
    }, container) {
      // 调用mutation更新state
      commit('INIT_CORONAL_VIEW', container);
    },
    async initAxialView({
      commit
    }, container) {
      // 调用mutation更新state
      commit('INIT_AXIAL_VIEW', container);
    },
    async initSagittalView({
      commit
    }, container) {
      // 调用mutation更新state
      commit('INIT_SAGITTAL_VIEW', container);
    },
    // 其他actions..
    // 例如，一个action来初始化Coronal视图
    initCoronalView({
      commit,
      state
    }, container) {
      // 执行初始化逻辑，然后提交mutations更新state
      commit('SET_CORONAL_SPACING', someSpacingValue);
      commit('SET_CORONAL_THICKNESS', someThicknessValue);
      // 其他初始化逻辑...
    },
    // 为Axial和Sagittal添加类似的actions
    // ...
    // ...（之前定义的actions）

    readDicomFileSeries({
      commit,
      state
    }, files) {
      // debugger
      console.log("files", files);
      console.log("dicomW==", dicomW);
      // console.log("readImageDicomFileSeries=", readImageDicomFileSeries);
      return readImageDicomFileSeries({
          inputImages: files,
          // singleSortedSeries: true,
        }).then((res) => {
          // debugger;
          const {
            outputImage
          } = res
          const image = vtkITKHelper.convertItkToVtkImage(outputImage)
          // Object.assign(imageData, image)
          console.log("image-----------", image);
          commit('SET_IMAGE_DATA', image);
          return image;
        })
        .catch((err) => {
          console.error('Error reading DICOM file series:', err)
          throw err
        });
    },
    // 其他actions...
    async initMprView({
      commit
    }, {
      container,
      viewName,
      viewType,
      slicingMode
    }) {
      try {
        const view = {
          viewName,
          viewType,
          // 其他属性...
        };
        commit('INIT_MPR_VIEW', {
          container,
          view,
          mode: slicingMode
        });
        // 其他逻辑...
      } catch (error) {
        console.error('Error initializing MPR view:', error);
      }
    },

    async getSlice({
      commit,
      state
    }, file) {
      try {
        // const image = await this.readDicomFileSeries(file);
        this.readDicomFileSeries(file).then(res => {
          console.log("res---readDicomFileSeries", res);
        }).catch(err => {
          throw new Error(err);
        });
        // commit('SET_IMAGE_DATA', image);
        // 调用其他必要的actions来初始化视图
        commit('INIT_VIEWS'); // 假设我们有一个初始化所有视图的mutation
      } catch (err) {
        console.error('Error processing DICOM file series:', err);
      }
    },


    async initWindow({
      commit
    }, {
      ww,
      wl
    }) {
      commit('SET_WINDOW_LEVEL', {
        ww,
        wl
      });
    },

    // 根据Pinia中的ReadFile方法创建action
    async readFile({
      commit,
      dispatch
    }, file) {
      // debugger
      try {
        const image = await dispatch('readDicomFileSeries', file);
        // dispatch('readDicomFileSeries', file).then(res => {
        //   console.log("re---", res);
        // }).catch(err => {
        //   console.error("eeeeee", err);
        //   throw err
        // });
        console.log("image========readFile", image);
        dispatch('init3DView', image); // someContainer需要根据实际情况传入
        // dispatch('initCoronalView', image);
        // dispatch('initAxialView', image);
        // dispatch('initSagittalView', image);
      } catch (err) {
        console.error('Error processing DICOM file series:', err);
      }
    },

    // 读取DICOM文件系列并处理图像数据
    async processDicomFiles({
      commit
    }, files) {
      try {
        const dicomData = await readImageDicomFileSeries({
          inputImages: files
        });
        const vtkImage = vtkITKHelper.convertItkToVtkImage(dicomData.outputImage);
        commit('SET_IMAGE_DATA', vtkImage);
        // 处理完图像数据后，可能需要初始化视图或执行其他操作
        // 例如：this.initViews();
      } catch (error) {
        console.error('Error processing DICOM files:', error);
      }
    },

    // 初始化图像窗口和级别
    async initWindow({
      commit
    }, {
      ww,
      wl
    }) {
      commit('SET_WINDOW_LEVEL', {
        ww,
        wl
      });
      // 可能需要执行其他操作，例如更新图像的显示方式
    },


    // 更新边缘渐变
    async updateEdgeGradient({
      state,
      commit
    }) {
      // 假设state中包含必要的renderWindow和actor
      const {
        renderWindow,
        actor
      } = state.view3D;
      // 根据Pinia中的逻辑更新边缘渐变
      // 这里需要根据实际逻辑来设置颜色转换函数和不透明度函数
      const dataRange = state.imageData.getPointData().getScalars().getRange();
      const lookupTable = vtkColorTransferFunction.newInstance();
      lookupTable.addRGBPoint(dataRange[0], 0.0, 0.0, 0.0);
      lookupTable.addRGBPoint((dataRange[0] + dataRange[1]) / 2, 1.0, 1.0, 1.0);
      lookupTable.addRGBPoint(dataRange[1], 1.0, 1.0, 1.0);

      const piecewiseFunction = vtkPiecewiseFunction.newInstance();
      // 设置不透明度函数的点
      actor.getProperty().setRGBTransferFunction(0, lookupTable);
      actor.getProperty().setScalarOpacity(0, piecewiseFunction);
      renderWindow.render();
    },

    // 应用裁剪平面
    async applyClipping({
      commit,
      state
    }, {
      ijk1,
      ijk2
    }) {
      const {
        imageData,
        view3D
      } = state;
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
    async resetClippingPlanes({
      commit,
      state
    }) {
      commit('REMOVE_ALL_CLIPPING_PLANES');
      // 可能需要执行其他操作，例如重新渲染视图
      state.view3D.renderWindow.render();
    },



    // 应用裁剪平面
    applyClipping({
      commit,
      state
    }, payload) {
      // payload 应包含必要的参数，例如 point1 和 point2
      const {
        imageData,
        view3D
      } = state;
      const {
        point1,
        point2
      } = payload;
      const dimensions = imageData.getDimensions();
      const ijk1 = [point1.x, point1.y, dimensions[2] - point1.z];
      const ijk2 = [point2.x, point2.y, dimensions[2] - point2.z];

      // 根据Pinia中的CubeClip方法逻辑创建裁剪平面并应用
      const clippingPlanes = createClippingPlanesFromIJK(ijk1, ijk2, imageData.getIndexToWorld());

      view3D.mapper.removeAllClippingPlanes();
      clippingPlanes.forEach((plane) => {
        view3D.mapper.addClippingPlane(plane);
      });
      view3D.renderWindow.render();
    },



  },
  getters: {

  }
}
