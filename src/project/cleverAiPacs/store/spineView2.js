import "@kitware/vtk.js/Rendering/Profiles/All";
import {
  readDicomTags,
  readImageDicomFileSeriesWorkerFunction,
} from "@itk-wasm/dicom";
import vtkXMLImageDataReader from "@kitware/vtk.js/IO/XML/XMLImageDataReader";
import vtkITKImageReader from "@kitware/vtk.js/IO/Misc/ITKImageReader";
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
import vtkAppendPolyData from "@kitware/vtk.js/Filters/General/AppendPolyData";

import vtkWidgetManager from "@kitware/vtk.js/Widgets/Core/WidgetManager";

import throttle from "lodash/throttle";
import Vue from "vue";
import {AllViewData} from './data';


import { gdcmReadImage} from "@itk-wasm/image-io"
import vtkITKHelper from "@kitware/vtk.js/Common/DataModel/ITKHelper";

import {xhr_getSlice,xhr_getSingleImage} from "@/api";
import {
  ButtonNames
} from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";

const VIEW_COLORS = {
  BACKGROUND: [0, 0, 0]
};

const basicViewData = new AllViewData()


const sortPoints = (pointsArray) => {

  const center = pointsArray.reduce(
    (acc, [x, y]) => [acc[0] + x, acc[1] + y],
    [0, 0]
  ).map((sum) => sum / pointsArray.length);

  pointsArray.sort(([x1, y1], [x2, y2]) => {
    const angle1 = Math.atan2(y1 - center[1], x1 - center[0]);
    const angle2 = Math.atan2(y2 - center[1], x2 - center[0]);
    return angle1 - angle2; // 顺时针排序
  });

  return pointsArray;
};


export default {
  namespaced: true,
  state: {
    widgetManager: vtkWidgetManager.newInstance(),
    // 选中行study信息，用于提取tags相关信息用
    studies_selected: {},
    picker: vtkPicker.newInstance(),
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

    allViewData: { hu:'',reversed:false,cameraRotate:0 ,scaleLength: null,cobb:0},

  },

  mutations: {
    SET_SERIES_INFO(state, seriesInfo) {
      state.seriesInfo = seriesInfo;
    },
    SET_VIEW(state,view){
      state.view = view;
    },
    SET_VIEW_ITEM(state, { key, value}) {
      state.view[key] = value;
    },

    SET_ALL_VIEW_STATE(state, { key, value}) {
      state.allViewData[key] = value;

    },
    INIT_NODULE_ALL_VIEW_DATA(state){
      const originalData = new AllViewData();
      originalData.colorWindow = 4096;
      originalData.colorLevel = 1024;
      originalData.isPan = true;
      originalData.layOut = null;
      originalData.buttons = [ButtonNames.Ckcw, ButtonNames.Jbinfo,  ButtonNames.Pyms];
      originalData.activeButtons = [ButtonNames.Jbinfo , ButtonNames.Pyms ]
      state.allViewData = {...state.allViewData,...originalData}
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
      console.log(interactorstyle)
      interactorstyle.setInteractionMode("IMAGE2D");

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
      obj.interactor.getInteractorStyle().modified();
      obj.interactor.onLeftButtonPress(()=>{
        obj.interactor.getInteractorStyle().endWindowLevel()
      })
      obj.sliceActor.setMapper(obj.sliceMapper);
      obj.renderer.addActor(obj.sliceActor);

     obj.interactor.onMouseMove((event) => {
      const view = state.view
      if(view && view.image){
        const {x, y} = event.position;
        state.picker.pick([x, y, 0], view.renderer);
        const pickedPositions = state.picker.getPickedPositions();
        if (pickedPositions.length > 0) {
          const pickedPosition = pickedPositions[0];

          const ijk = view.image
            .worldToIndex(pickedPosition)
            .map(Math.round);
          const imageScales = view.image.getPointData().getScalars();
          const pageindex =
            ijk[0] +
            ijk[1] * view.image.getDimensions()[0] +
            ijk[2] *
            view.image.getDimensions()[0] *
            view.image.getDimensions()[1];
          const pixelValue = imageScales.getTuple(pageindex);
          commit("SET_ALL_VIEW_STATE", {
            key: "hu",
            value: pixelValue[0] ,
          });
        }else{
          commit("SET_ALL_VIEW_STATE", {
            key: "hu",
            value: '' ,
          });
        }
      }

      });

      obj.interactor.onLeftButtonPress((event) => {
        if (state.allViewData.isPan) {
          obj.interactor.getInteractorStyle().startPan()

        }else{

        }
      });

      commit("SET_VIEW",obj)

      // state.widgetManager.setRenderer(state.view.renderer);

      // await dispatch("GetSlice");
      // dispatch("spineToolsStore/resizeSliceView",null,{root:true})

    },
    InitViewData({state,dispatch,commit}){

      commit("INIT_NODULE_ALL_VIEW_DATA")
      const { allViewData } = state
      dispatch("spineToolsStore/UpdateColorWindow",allViewData.colorWindow,{root:true})
      dispatch("spineToolsStore/UpdateColorLevel",allViewData.colorLevel,{root:true})

      dispatch("toolBarStore/initButtonState",{showButtons: allViewData.buttons ,activeButtons:allViewData.activeButtons} ,{root:true})

    },

    async GetSlice({dispatch, state,commit}) {
      console.log("getslice")
      try {
        let loading = setInterval(() => {
          Vue.prototype.$message.destroy();

        }, 50)
        const res2 = await xhr_getSingleImage({
          studyid: "1838512078533521409",

        });

        if (res2) {
          const file = new File([res2.data], "image.dcm", { type: "application/dicom" });
          const result = await gdcmReadImage(file);
          const outputImage = result.image;
          const imageData = vtkITKHelper.convertItkToVtkImage(outputImage);
          commit("SET_VIEW_ITEM",{key:"image",value:imageData})
          const view = state.view;
          view.sliceMapper.setInputData(imageData);
          dispatch("setupCamera");


        } else {
          console.error("Request failed: No data returned");
        }

      } catch (error) {
        console.error("Request failed:", error);
      }
    },




    async UpdateSlice({dispatch, state,commit},{file}) {
      console.log("UpdateSlice")
      try {
        // const file = new File([image], "image.dcm", { type: "application/dicom" });
          const result = await gdcmReadImage(file);
          const outputImage = result.image;
          const imageData = vtkITKHelper.convertItkToVtkImage(outputImage);
          commit("SET_VIEW_ITEM",{key:"image",value:imageData})
          const view = state.view;
          view.sliceMapper.setInputData(imageData);
          dispatch("setupCamera");
           dispatch("spineToolsStore/resizeSliceView",null,{root:true})


      state.widgetManager.setRenderer(state.view.renderer);





      } catch (error) {
        console.error("Request failed:", error);
      }
    },


    SetAllViewData({commit},{ key,value }){
      commit("SET_ALL_VIEW_STATE",{ key,value })
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
        containerWidth * Math.abs(point1[0] - point2[0]) >
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

    async drawLine({ state, dispatch }, { points, color = [1, 0, 0], lineWidth = 1 }){
      const { view } = state;

      if (points.length !== 2) {
        console.error('You must provide exactly two points to draw a line.');
        return;
      }

      const boundsZ = Math.min(view.image.getBounds()[2], view.image.getBounds()[5]);

      const vtkPointsInstance = vtkPoints.newInstance();

      // 将输入的两个点转换为世界坐标并插入到 vtkPoints 中
      points.forEach(([xIndex, yIndex]) => {
        const worldPoint = view.image.indexToWorld([xIndex, yIndex, boundsZ]);
        vtkPointsInstance.insertNextPoint(...worldPoint);
      });

      // 定义线段的拓扑结构
      const lines = vtkCellArray.newInstance();
      lines.insertNextCell([0, 1]); // 连接第一个点和第二个点

      // 创建 PolyData 并设置点和线段
      const polyData = vtkPolyData.newInstance();
      polyData.setPoints(vtkPointsInstance);
      polyData.setLines(lines);

      // 创建 Mapper 和 Actor
      const mapper = vtkMapper.newInstance();
      mapper.setInputData(polyData);

      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);
      actor.getProperty().setColor(...color);
      actor.getProperty().setLineWidth(lineWidth);
      actor.setVisibility(true);

      // 将 Actor 添加到渲染器中
      view.renderer.addActor(actor);
    },

   async  drawVerticalLine({ state, dispatch }, { points, color = [1, 0, 0], lineWidth = 1 }){

      const result = await dispatch("calculatePerpendicularLine",points)
      dispatch("drawLine",{ points:result})
    },


    calculatePerpendicularLine({state},points) {
      console.log(points);

      const length = 1000
      const [pointbegin, pointend] = points

      const [x1, y1] = pointbegin;
      const [x2, y2] = pointend;

      // 计算中点
      const midpoint = [(x1 + x2) / 2, (y1 + y2) / 2];

      // 计算连线方向向量
      const dx = x2 - x1;
      const dy = y2 - y1;

      // 计算垂直方向向量（单位化）
      const magnitude = Math.sqrt(dx * dx + dy * dy);
      const perpVector = [-dy / magnitude, dx / magnitude];

      // 计算垂直线段的两个端点
      const halfLength = length / 2;
      const point1 = [
        midpoint[0] + halfLength * perpVector[0],
        midpoint[1] + halfLength * perpVector[1]
      ];
      const point2 = [
        midpoint[0] - halfLength * perpVector[0],
        midpoint[1] - halfLength * perpVector[1]
      ];

      return [point1, point2];
    },



    async drawShape({ state,dispatch }, { contours, color = [1, 0, 0], lineWidth = 1 }) {
      const { view } = state;
      const boundsZ = Math.min(view.image.getBounds()[2], view.image.getBounds()[5]);

      contours.forEach((boundsArray) => {
        const points = vtkPoints.newInstance();

        boundsArray.forEach(([xIndex, yIndex]) => {
          const worldPoint = view.image.indexToWorld([xIndex, yIndex, boundsZ]);
          points.insertNextPoint(...worldPoint);
        });

        const numPoints = points.getNumberOfPoints();
        const lines = vtkCellArray.newInstance();
        const lineIndices = Array.from({ length: numPoints }, (_, i) => i);
        lines.insertNextCell([...lineIndices, lineIndices[0]]); // 确保闭合

        const polyData = vtkPolyData.newInstance();
        polyData.setPoints(points);
        polyData.setLines(lines);

        const mapper = vtkMapper.newInstance();
        mapper.setInputData(polyData);

        const actor = vtkActor.newInstance();
        actor.setMapper(mapper);
        actor.getProperty().setColor(...color);
        actor.getProperty().setLineWidth(lineWidth);
        actor.setVisibility(true);

        view.renderer.addActor(actor);
      });
    },
    async addBoxes ({ state, rootState, dispatch, commit }, { contours })  {
      const { view } = state;

      // 将每个矩形的对角点转化为四个顶点并排序
      const formattedContours = contours.map(([x1, y1, x2, y2]) =>
        sortPoints([
          [x1, y1],
          [x2, y1],
          [x2, y2],
          [x1, y2],
        ])
      );

      // 调用绘制逻辑
      await dispatch("drawShape", { contours: formattedContours });

      // 调整摄像机和视图大小
      await dispatch("setupCamera");
      await dispatch("spineToolsStore/resizeSliceView", null, { root: true });
    },
    async addKeyPoints  ({ state, rootState, dispatch, commit }, { contours })  {
      const { view } = state;

      const sortedContours = contours.map(sortPoints);

      await dispatch("drawShape", { contours: sortedContours });

      await dispatch("setupCamera");
      await dispatch("spineToolsStore/resizeSliceView", null, { root: true });
    }










,
async freshView({dispatch}){

  await dispatch("setupCamera");
  await dispatch("spineToolsStore/resizeSliceView", null, { root: true });
},
    beforeViewDestory({state,commit,dispatch}){
      // commit("toolBarStore/INIT_BUTTON_SHOW_STATE",[],{root:true})
      // commit("toolBarStore/INIT_BUTTON_ACTIVE_STATE",[],{root:true})

    },









  },
};
