import "@kitware/vtk.js/Rendering/Profiles/All";
import {
  readDicomTags,
  readImageDicomFileSeriesWorkerFunction,
} from "@itk-wasm/dicom";
import vtkXMLImageDataReader from "@kitware/vtk.js/IO/XML/XMLImageDataReader";
import vtkGenericRenderWindow from "@kitware/vtk.js/Rendering/Misc/GenericRenderWindow";
import vtkImageMapper from "@kitware/vtk.js/Rendering/Core/ImageMapper";
import vtkImageSlice from "@kitware/vtk.js/Rendering/Core/ImageSlice";
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
import {ViewData,AllViewData,ViewRenderer} from './data';
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";

import {
  ButtonNames,
  LayoutIcons
} from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";

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

const contours = {
  "107":[[
    313,
    358.5,
    312,
    358.5,
    311,
    358.5,
    310,
    358.5,
    309,
    358.5,
    308,
    358.5,
    307,
    358.5,
    306.5,
    358,
    306,
    357.5,
    305.5,
    357,
    305.5,
    356,
    305.5,
    355,
    305.5,
    354,
    306,
    353.5,
    306.5,
    353,
    307,
    352.5,
    308,
    352.5,
    309,
    352.5,
    310,
    352.5,
    310.5,
    352,
    311,
    351.5,
    312,
    351.5,
    312.5,
    351,
    313,
    350.5,
    313.5,
    350,
    314,
    349.5,
    314.5,
    349,
    315,
    348.5,
    315.5,
    348,
    316,
    347.5,
    317,
    347.5,
    317.5,
    347,
    318,
    346.5,
    318.5,
    346,
    318.5,
    345,
    318.5,
    344,
    319,
    343.5,
    319.5,
    343,
    319.5,
    342,
    319.5,
    341,
    319.5,
    340,
    320,
    339.5,
    321,
    339.5,
    322,
    339.5,
    323,
    339.5,
    324,
    339.5,
    325,
    339.5,
    326,
    339.5,
    327,
    339.5,
    327.5,
    340,
    327.5,
    341,
    327.5,
    342,
    327.5,
    343,
    327.5,
    344,
    327.5,
    345,
    327,
    345.5,
    326,
    345.5,
    325.5,
    346,
    325,
    346.5,
    324.5,
    347,
    324,
    347.5,
    323.5,
    348,
    323,
    348.5,
    322.5,
    349,
    322.5,
    350,
    322.5,
    351,
    322.5,
    352,
    322,
    352.5,
    321.5,
    353,
    321,
    353.5,
    320,
    353.5,
    319.5,
    354,
    319,
    354.5,
    318.5,
    355,
    318,
    355.5,
    317.5,
    356,
    317.5,
    357,
    317,
    357.5,
    316,
    357.5,
    315,
    357.5,
    314,
    357.5,
    313.5,
    358,
    313,
    358.5
  ]]
  ,"109": [
					[
						312,
						360.5,
						311,
						360.5,
						310,
						360.5,
						309.5,
						360,
						309,
						359.5,
						308,
						359.5,
						307,
						359.5,
						306.5,
						359,
						306,
						358.5,
						305.5,
						358,
						305,
						357.5,
						304.5,
						357,
						304.5,
						356,
						304.5,
						355,
						305,
						354.5,
						305.5,
						354,
						305.5,
						353,
						306,
						352.5,
						307,
						352.5,
						308,
						352.5,
						308.5,
						352,
						309,
						351.5,
						310,
						351.5,
						310.5,
						351,
						310.5,
						350,
						311,
						349.5,
						311.5,
						349,
						312,
						348.5,
						313,
						348.5,
						313.5,
						348,
						314,
						347.5,
						315,
						347.5,
						315.5,
						347,
						316,
						346.5,
						316.5,
						346,
						316.5,
						345,
						316.5,
						344,
						317,
						343.5,
						317.5,
						343,
						318,
						342.5,
						318.5,
						342,
						318.5,
						341,
						318.5,
						340,
						319,
						339.5,
						319.5,
						339,
						320,
						338.5,
						321,
						338.5,
						321.5,
						338,
						321.5,
						337,
						322,
						336.5,
						323,
						336.5,
						324,
						336.5,
						325,
						336.5,
						326,
						336.5,
						327,
						336.5,
						328,
						336.5,
						329,
						336.5,
						330,
						336.5,
						330.5,
						337,
						330.5,
						338,
						330.5,
						339,
						331,
						339.5,
						331.5,
						340,
						331.5,
						341,
						331,
						341.5,
						330.5,
						342,
						330.5,
						343,
						330.5,
						344,
						330.5,
						345,
						330,
						345.5,
						329.5,
						346,
						329,
						346.5,
						328.5,
						347,
						328.5,
						348,
						328,
						348.5,
						327.5,
						349,
						327,
						349.5,
						326,
						349.5,
						325.5,
						350,
						325.5,
						351,
						325,
						351.5,
						324.5,
						352,
						324,
						352.5,
						323.5,
						353,
						323,
						353.5,
						322.5,
						354,
						322,
						354.5,
						321.5,
						355,
						321,
						355.5,
						320,
						355.5,
						319.5,
						356,
						319.5,
						357,
						319,
						357.5,
						318,
						357.5,
						317.5,
						358,
						317,
						358.5,
						316,
						358.5,
						315.5,
						359,
						315,
						359.5,
						314,
						359.5,
						313,
						359.5,
						312.5,
						360,
						312,
						360.5
					]
				],
				"110": [
					[
						315,
						361.5,
						314,
						361.5,
						313,
						361.5,
						312,
						361.5,
						311,
						361.5,
						310,
						361.5,
						309.5,
						361,
						309,
						360.5,
						308.5,
						360,
						308,
						359.5,
						307,
						359.5,
						306.5,
						359,
						306.5,
						358,
						306,
						357.5,
						305.5,
						357,
						305.5,
						356,
						305.5,
						355,
						305.5,
						354,
						306,
						353.5,
						306.5,
						353,
						306.5,
						352,
						307,
						351.5,
						308,
						351.5,
						309,
						351.5,
						309.5,
						351,
						309.5,
						350,
						310,
						349.5,
						310.5,
						349,
						311,
						348.5,
						312,
						348.5,
						312.5,
						348,
						313,
						347.5,
						313.5,
						347,
						314,
						346.5,
						315,
						346.5,
						315.5,
						346,
						315.5,
						345,
						315.5,
						344,
						316,
						343.5,
						316.5,
						343,
						316.5,
						342,
						317,
						341.5,
						317.5,
						341,
						318,
						340.5,
						318.5,
						340,
						318.5,
						339,
						319,
						338.5,
						319.5,
						338,
						319.5,
						337,
						320,
						336.5,
						321,
						336.5,
						321.5,
						336,
						322,
						335.5,
						322.5,
						335,
						323,
						334.5,
						324,
						334.5,
						325,
						334.5,
						326,
						334.5,
						327,
						334.5,
						328,
						334.5,
						329,
						334.5,
						330,
						334.5,
						330.5,
						335,
						331,
						335.5,
						332,
						335.5,
						332.5,
						336,
						333,
						336.5,
						334,
						336.5,
						334.5,
						337,
						334.5,
						338,
						335,
						338.5,
						335.5,
						339,
						335.5,
						340,
						335.5,
						341,
						336,
						341.5,
						336.5,
						342,
						336.5,
						343,
						337,
						343.5,
						337.5,
						344,
						337.5,
						345,
						337,
						345.5,
						336.5,
						346,
						336,
						346.5,
						335.5,
						347,
						335,
						347.5,
						334,
						347.5,
						333,
						347.5,
						332.5,
						348,
						332,
						348.5,
						331,
						348.5,
						330.5,
						349,
						330,
						349.5,
						329.5,
						350,
						329.5,
						351,
						329,
						351.5,
						328.5,
						352,
						328,
						352.5,
						327.5,
						353,
						327,
						353.5,
						326,
						353.5,
						325.5,
						354,
						325,
						354.5,
						324.5,
						355,
						324,
						355.5,
						323,
						355.5,
						322.5,
						356,
						322.5,
						357,
						322,
						357.5,
						321.5,
						358,
						321,
						358.5,
						320,
						358.5,
						319,
						358.5,
						318.5,
						359,
						318,
						359.5,
						317.5,
						360,
						317,
						360.5,
						316,
						360.5,
						315.5,
						361,
						315,
						361.5
					]
				],}



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

    viewMprViews: Array.from({length: 3}, () => (new ViewRenderer)),

    CoronalData: new ViewData,
    AxialData: new ViewData,
    SagittalData: new ViewData,
    pneumoniaInfo: {},

    CoronalContours:[],
    AxialContours: [],
    SagittalContours: [],


    annotations: {value: [], index: new Set()},
    picker: vtkPicker.newInstance(),


    animationIds: Array.from({length: 3}, () => ({
      viewIndex: null,
      animationId: null,
    })),


    allViewData:new AllViewData,
    selectedPneumoniaId:null


  },
  getters: {
    viewsData: (state) => [
      state.SagittalData,
      state.CoronalData,
      state.AxialData,
    ],
    pneumoniaContours:(state)=>[
      state.CoronalContours,
      state.AxialContours,
      state.SagittalContours]

  },
  mutations: {
    SET_PNEUMONIA_INFO(state, pneumoniaInfo) {
      state.pneumoniaInfo = pneumoniaInfo;
      // state.pneumoniaInfo.focalDetailList = []

    },

    INIT_PNEUMONIA_RENDER_VIEW(state,v_state){
      const indexs = [0,1,2]

      state.viewMprViews.forEach((view,index) => {
        const originalView = new ViewRenderer();
        originalView.viewIndex = indexs[index]
        originalView.renderer = vtkRenderer.newInstance();
        originalView.image = null
        originalView.sliceMapper = vtkImageMapper.newInstance()
        originalView.sliceActor = vtkImageSlice.newInstance()
        originalView.sliceActor.setMapper(originalView.sliceMapper);
        originalView.renderer.addActor(originalView.sliceActor);
        originalView.renderer.setBackground(...VIEW_COLORS.BACKGROUND);
        view.copyFrom(originalView)
        // v_state.viewMprViews[index].renderWindow.addRenderer(view.renderer)
      });
    },
    SET_VIEW_MPR_VIEW(state, {viewIndex, key, value}) {
      state.viewMprViews[viewIndex][key] = value;
    },

    INIT_PNEUMONIA_ALL_VIEW_DATA(state){
      const originalData = new AllViewData();
      originalData.colorWindow = 1500;
      originalData.colorLevel = 300;
      originalData.isPan = false;
      originalData.layOut = LayoutIcons.MPR;
      originalData.buttons = [ButtonNames.Layout, ButtonNames.Ckcw, ButtonNames.Jbinfo, ButtonNames.Szckx, ButtonNames.Pyms ];
      originalData.activeButtons = [ButtonNames.Jbinfo, ButtonNames.Szckx ]
      state.allViewData.copyFrom(originalData)
    },
    INIT_PNEUMONIA_VIEW_DATA(state, seriesInfo){
      const originalAxialData = new ViewData();
      originalAxialData.viewIndex = VIEW_TYPES.AXIAL
      originalAxialData.viewName = VIEW_NAMES.AXIAL
      originalAxialData.dimension = seriesInfo.axialCount
      originalAxialData.changedPageIndex = Math.round(seriesInfo.axialCount / 2) + 1
      state.AxialData.copyFrom(originalAxialData)

      const originalCoronalData = new ViewData();
      originalCoronalData.viewIndex = VIEW_TYPES.CORONAL
      originalCoronalData.viewName = VIEW_NAMES.CORONAL
      originalCoronalData.dimension = seriesInfo.coronalCount
      originalCoronalData.changedPageIndex = Math.round(seriesInfo.coronalCount / 2) + 1
      state.CoronalData.copyFrom(originalCoronalData)

      const originalSagittalData = new ViewData();
      originalSagittalData.viewIndex = VIEW_TYPES.SAGITTAL
      originalSagittalData.viewName = VIEW_NAMES.SAGITTAL
      originalSagittalData.dimension = seriesInfo.sagittalCount
      originalSagittalData.changedPageIndex = Math.round(seriesInfo.sagittalCount / 2) + 1
      state.SagittalData.copyFrom(originalSagittalData)

    },
    SET_STATE(state,v_state){
      console.log("保存下来",v_state.allViewData)
      state.allViewData.copyFrom(v_state.allViewData)
      state.CoronalData.copyFrom(v_state.CoronalData)
      state.SagittalData.copyFrom(v_state.SagittalData)
      state.AxialData.copyFrom(v_state.AxialData)

      state.CoronalData.changedPageIndex = state.CoronalData.pageIndex
      state.SagittalData.changedPageIndex = state.SagittalData.pageIndex
      state.AxialData.changedPageIndex = state.AxialData.pageIndex
    }

  },
  actions: {
    async InitPneumoniaState({state,commit,rootState,dispatch},seriesInfo){
      await dispatch("mprViewStore/clearAllAutoplay",null,{root:true} )

      const {mprViewStore} = rootState
      commit("INIT_PNEUMONIA_ALL_VIEW_DATA")
      commit("INIT_PNEUMONIA_VIEW_DATA",seriesInfo)

      commit("INIT_PNEUMONIA_RENDER_VIEW",mprViewStore)

    },
    async ActivePneumoniaState({dispatch,state,rootState,commit}){
      const {mprViewStore} = rootState

      await dispatch("mprViewStore/clearAllAutoplay",null,{root:true} )

      if(mprViewStore.activedModules.includes("pneumoniaInfoStore")){
        await dispatch("mprViewStore/ActiveModule","pneumoniaInfoStore",{root:true})
      }else{
        await dispatch("mprViewStore/InitModuleView","pneumoniaInfoStore",{root:true})
        dispatch("InitContours",{view:state.viewMprViews[2]})

      }
      // if(state.viewMprViews[0].image){
      //   await dispatch("mprViewStore/ActiveModule","pneumoniaInfoStore",{root:true})


      // }else{
      //   await dispatch("mprViewStore/InitModuleView","pneumoniaInfoStore",{root:true})
      // // const {mprViewStore} = rootState
      // dispatch("InitContours",{view:state.viewMprViews[2]})
      // }

    },

    async handleMousePress(
      {dispatch, commit, state, getters,rootState},
      {pickedPosition,view},
    ) {

      const {mprViewStore} = rootState
      const pickedX = pickedPosition[0];
      const pickedY = pickedPosition[1];


    },



    async UpdateSlice(
      {commit, dispatch, state,getters},
      {viewIndex, index},
    ) {
      const pneuContours = getters.pneumoniaContours[viewIndex]
      if(pneuContours[index]){

      }

    },

    async InitContours({state,rootState,dispatch},{view}){
      const { mprViewStore } = rootState;
      let boundsZ = view.image.getBounds()[2];
      if (view.viewIndex == 2) {
        boundsZ = view.image.getBounds()[5];
      }

      // 假设 pointsArray 是一个包含二维点 [x1, y1, x2, y2, ...] 的数组
      const pointsArrays =  contours["110"]

      pointsArrays.forEach((pointsArray, contourIndex) => {
        console.log(`Processing contour ${contourIndex}:`, pointsArray);

        const transformedData = {};
        for (let i = 0; i < pointsArray.length; i += 2) {
          const x = pointsArray[i];
          const y = pointsArray[i + 1];
          const z = i / 2; // z 值为索引除以 2，可以是小数
          // 初始化 x 键的对象
          if (!transformedData[x]) {
            transformedData[x] = {};
          }
          // 设置 z 和 y 的对应关系
          transformedData[x][z] = y;
        }
        console.log("Transformed Data:", transformedData);

        // 创建 vtkPoints 实例并动态设置点
        const points = vtkPoints.newInstance();
        points.setNumberOfPoints(pointsArray.length / 2);

        for (let i = 0; i < pointsArray.length; i += 2) {
          const [x, y] = [pointsArray[i], pointsArray[i + 1]];
          const worldPoint = view.image.indexToWorld([x, y, boundsZ]);
          points.setPoint(i / 2, worldPoint[0], worldPoint[1], worldPoint[2]);
        }

        // 创建线的连接
        const lines = vtkCellArray.newInstance();
        const pointIndices = Array.from({ length: pointsArray.length / 2 }, (_, i) => i);
        lines.insertNextCell([pointsArray.length / 2, ...pointIndices]);

        // 设置 polyData 和 mapper
        const polyData = vtkPolyData.newInstance();
        polyData.setPoints(points);
        polyData.setLines(lines);

        const mapper = vtkMapper.newInstance();
        mapper.setInputData(polyData);

        // 创建 actor，设置可见性和其他属性
        const actor = vtkActor.newInstance();
        actor.setVisibility(true); // 根据需要设置可见性条件
        actor.setMapper(mapper);
        actor.getProperty().setColor(1, 0, 0); // 设置颜色
        actor.getProperty().setLineWidth(1); // 设置线宽

        console.log("Actor for contour:", contourIndex, actor);
        view.renderer.addActor(actor); // 添加 actor 到渲染器
      });

      // 刷新视图
      dispatch("mprViewStore/freshView", view.viewIndex, { root: true });

      // console.log(pointsArray)
      // const transformedData = {};

      // for (let i = 0; i < pointsArray.length; i += 2) {
      //   const x = pointsArray[i];
      //   const y = pointsArray[i + 1];
      //   const z = i / 2; // z 值为索引除以 2，可以是小数

      //   // 初始化 x 键的对象
      //   if (!transformedData[x]) {
      //     transformedData[x] = {};
      //   }
      //   // 设置 z 和 y 的对应关系
      //   transformedData[x][z] = y;
      // }

      // console.log(transformedData);
      // // 创建 vtkPoints 实例并动态设置点
      // const points = vtkPoints.newInstance();
      // points.setNumberOfPoints(pointsArray.length / 2);

      // for (let i = 0; i < pointsArray.length; i += 2) {
      //   const [x, y] = [pointsArray[i], pointsArray[i + 1]];
      //   const worldPoint = view.image.indexToWorld([x, y, boundsZ]);
      //   points.setPoint(i / 2, worldPoint[0], worldPoint[1], worldPoint[2]);
      // }

      // // 创建线的连接
      // const lines = vtkCellArray.newInstance();
      // const pointIndices = Array.from({ length: pointsArray.length / 2 }, (_, i) => i);
      // lines.insertNextCell([pointsArray.length / 2, ...pointIndices]);

      // // 设置 polyData 和 mapper
      // const polyData = vtkPolyData.newInstance();
      // polyData.setPoints(points);
      // polyData.setLines(lines);

      // const mapper = vtkMapper.newInstance();
      // mapper.setInputData(polyData);

      // // 创建 actor，设置可见性和其他属性
      // const actor = vtkActor.newInstance();
      // actor.setVisibility(true);
      // actor.setMapper(mapper);
      // actor.getProperty().setColor(1,0,0);
      // actor.getProperty().setLineWidth(1);
      // console.log(actor)
      // view.renderer.addActor(actor);
      // dispatch("mprViewStore/freshView",view.viewIndex,{root:true})
    }




  },
};
