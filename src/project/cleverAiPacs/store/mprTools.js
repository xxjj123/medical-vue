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
import vtkITKHelper from "@kitware/vtk.js/Common/DataModel/ITKHelper";

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
import {
  ButtonNames,
  suffix_name,
  suffix_show,
  LayoutIcons,
} from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";
const VIEWDATA_NAMES = ["SagittalData", "CoronalData", "AxialData"];

export default {
  namespaced: true,
  actions: {
    UpdateWindowWidth({state, commit,rootState,dispatch}, value) {
      const { mprViewStore } = rootState;
      const v_state =  rootState[mprViewStore.activeModule];

      v_state.viewMprViews.forEach((view, objindex) => {
        if(view){

          view.sliceActor.getProperty().setColorWindow(value);
          dispatch("mprViewStore/freshView",view.viewIndex,{root:true})
        }

      });
      dispatch("mprViewStore/SetAllViewData", {
        key: "colorWindow",
        value: value,
      },{root:true});
    },

    UpdateWindowCenter({state, commit,rootState,dispatch}, value) {
      const { mprViewStore } = rootState;
      const v_state =  rootState[mprViewStore.activeModule];
      v_state.viewMprViews.forEach((view, objindex) => {
        if(view ){

          view.sliceActor.getProperty().setColorLevel(value);
          dispatch("mprViewStore/freshView",view.viewIndex,{root:true})

        }

      });
      dispatch("mprViewStore/SetAllViewData", {
        key: "colorLevel",
        value: value,
      },{root:true});
    },
    /**
     * 滚动条选择
     * @param {number} viewIndex -  操作页面索引
     * @param {number} pageIndex - 切换页面索引

     */
    async ChangeSlider({dispatch}, {viewIndex, pageIndex}) {
      const viewName = VIEWDATA_NAMES[viewIndex]
      commit("SET_VIEW_DATA", {
        viewIndex: viewIndex,
        key: "changedPageIndex",
        value: pageIndex,
      });
      dispatch("throttleUpdateSingleSlice", {viewName, viewIndex, pageIndex});

      dispatch("UpdateDisplay", {
        viewIndex: viewIndex,
        changedPageIndex: pageIndex,
      });
    },


    /**
     * 自动播放
     * @param {number} viewIndex - 操作页面索引
     * @param {number} time - 单片切换时间，单元毫秒
     */
    AutoPlay({ commit, dispatch, state ,rootState,rootGetters }, { viewIndex }) {
      const { mprViewStore } = rootState;
      const v_state = mprViewStore;
      if(v_state.allViewData.isPan){
        dispatch("toolBarStore/activeButtonState",ButtonNames.Pyms,{root:true})

      }
      dispatch("mprViewStore/AutoPlay",{ viewIndex },{root:true})
    }
,

    /**
     * 页面反向
     * @param {number} viewIndex - 操作页面索引
     */
    ReverseWindow({commit, state,rootState,rootGetters,dispatch}, viewIndex) {
      const {mprViewStore} = rootState
      // const view = rootState[mprViewStore.viewMprViews[viewIndex]];
      const view = rootState[mprViewStore.activeModule].viewMprViews[viewIndex];

      const viewdata = rootGetters['mprViewStore/viewsData'][viewIndex];

      const colorTransferFunction = vtkColorTransferFunction.newInstance();
      if (!viewdata.reversed) {
        colorTransferFunction.addRGBPoint(0, 1, 1, 1); // 白色
        colorTransferFunction.addRGBPoint(255, 0, 0, 0); // 黑色
      } else {
        colorTransferFunction.addRGBPoint(255, 1, 1, 1); // 白色
        colorTransferFunction.addRGBPoint(0, 0, 0, 0); // 黑色
      }
      dispatch("mprViewStore/SetViewData", {
        viewIndex,
        key: "reversed",
        value: !viewdata.reversed,
      },{
        root: true,
      },);

      view.sliceActor
        .getProperty()
        .setRGBTransferFunction(0, colorTransferFunction);
      dispatch("mprViewStore/freshView",view.viewIndex,{root:true})

      // view.interactor.render();
    },

    /**
     * 水平翻转
     * @param {number} viewIndex - 操作页面索引
     */
    FlipHorizontal({commit, dispatch, state}, viewIndex) {
      const view = state.viewMprViews[viewIndex];
      const currentScale = view.sliceActor.getScale();
      const newScaleX = currentScale[0] === 1 ? -1 : 1; // 切换X轴的翻转状态

      view.sliceActor.setScale(newScaleX, currentScale[1], currentScale[2]);


      dispatch("setupCamera", viewIndex);
    },

    /**
     * 垂直翻转
     * @param {number} viewIndex - 操作页面索引
     */
    FlipVertical({commit, dispatch, state}, viewIndex) {
      const view = state.viewMprViews[viewIndex];
      const currentScale = view.sliceActor.getScale();
      const newScaleY = currentScale[1] === 1 ? -1 : 1; // 切换Y轴的翻转状态

      view.sliceActor.setScale(currentScale[0], newScaleY, currentScale[2]);

      dispatch("setupCamera", viewIndex);
    },

    /**
     * 切片旋转
     * @param {number} viewIndex - 操作页面索引
     */
    RotateCamera({commit, dispatch, state, rootGetters}, viewIndex) {
      const viewsData = rootGetters['mprViewStore/viewsData']
      dispatch("mprViewStore/SetViewData", {
        viewIndex,
        key: "cameraRotate",
        value: (viewsData[viewIndex].cameraRotate - 90) % 360,
      },{
        root: true,
      },);
      dispatch("setupCamera", viewIndex);
      dispatch("resizeSliceViews");

    },
    zoomView(){




    },
    // 改变平移
    ChangePan({dispatch, state, commit,rootState }) {
      const { mprViewStore } = rootState;
      const v_state = mprViewStore;
      if(v_state.allViewData.isPan){
        v_state.viewMprViews.forEach((view, objindex) => {
          const interactorStyle = vtkInteractorStyleImage.newInstance();
          interactorStyle.setInteractionMode("IMAGE_PAN");
          view.interactor.setInteractorStyle(interactorStyle);

          view.interactor.onLeftButtonPress(()=>{
            view.interactor.getInteractorStyle().endWindowLevel()
          })
          // 确保新的 InteractorStyle 被正确设置并激活

          dispatch("setupCamera", view.viewIndex,);
          view.renderWindow.render()
        })
        dispatch("mprViewStore/SetAllViewData",{
            key: "isPan",
            value: false,
          },{root:true})


      }else{
        v_state.viewMprViews.forEach((view, objindex) => {
          dispatch("mprViewStore/SetAllViewData",{
            key: "isPan",
            value: true,
          },{root:true})

        });
      }

      dispatch("resizeSliceViews")

    }
,

setupCamera({commit, state,rootState,rootGetters,dispatch}, viewIndex){
  dispatch("mprViewStore/setupCamera",viewIndex,{root:true})
},
    /**
     * 重置视图
     */
    resizeSliceViews({dispatch, state,   commit,rootState,rootGetters}) {
      const {mprViewStore} = rootState
      const viewsData = rootGetters['mprViewStore/viewsData']
      const ijk = [];
      ijk[VIEW_TYPES.AXIAL] =
        viewsData[VIEW_TYPES.AXIAL].changedPageIndex;
      ijk[VIEW_TYPES.CORONAL] =
        viewsData[VIEW_TYPES.CORONAL].changedPageIndex;
      ijk[VIEW_TYPES.SAGITTAL] =
        viewsData[VIEW_TYPES.SAGITTAL].changedPageIndex;

      ijk.forEach((item, index) => {
        if (item > 0) {
          dispatch("mprViewStore/UpdateDisplay", {
            viewIndex: index,
            changedPageIndex: item,
          },{root:true});
        }
      });

      const v_state =  rootState[mprViewStore.activeModule];
      mprViewStore.viewMprViews.forEach((view,index) => {
        const v_view = v_state.viewMprViews[index]
        if(v_view.image){
          const container = view.grw.getContainer();

          const {width, height} = container.getBoundingClientRect();

          view.grw.resize(width, height);
          view.renderWindow.render();
          const point1 = [0, 0, 0];
          const point2 = [100, 0, 0];

          coordinate.setValue(...point1);
          const [point1x] = coordinate.getComputedDoubleDisplayValue(
            v_view.renderer,
          );
          coordinate.setValue(...point2);

          const [point2x] = coordinate.getComputedDoubleDisplayValue(
            v_view.renderer,
          );

          dispatch("mprViewStore/SetViewData", {
            viewIndex: view.viewIndex,
            key: "scaleLength",
            value: Math.abs(point2x - point1x),
          },{root:true});
        }



      });
    },
    resizeCamera({state,dispatch,rootGetters}){
      const viewsData = rootGetters['mprViewStore/viewsData']
      viewsData.forEach((view) =>{
        dispatch("setupCamera",view.viewIndex)
      })
    },
    beforeViewDestory({state,commit,dispatch}){
      console.log("11");
      dispatch("clearAllAutoplay")
      commit("RESET_STATE")

    }
  },
};
