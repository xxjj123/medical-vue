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
import vtkAngleWidget from '@kitware/vtk.js/Widgets/Widgets3D/AngleWidget';

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
    UpdateColorWindow({state, commit,rootState,dispatch}, value) {
      console.log("UpdateColorWindow");

      const { spineViewStore } = rootState;
      const view = spineViewStore.view
      if(view.sliceActor){
         view.sliceActor.getProperty().setColorWindow(value );
         if(view.image ){
          view.interactor.render();
         }
      dispatch("spineViewStore/SetAllViewData",{
        key: "colorWindow",
        value
      },{root:true})


      }
    },

    UpdateColorLevel({state, commit,rootState,dispatch}, value) {
      console.log("UpdateColorLevel");

      const { spineViewStore } = rootState;
      const view = spineViewStore.view
      if(view.sliceActor){
        view.sliceActor.getProperty().setColorLevel(value );
        if(view.image ){
          view.interactor.render();
         }
      dispatch("spineViewStore/SetAllViewData",{
        key: "colorLevel",
        value
      },{root:true})

      }
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
     * 页面反向
     * @param {number} viewIndex - 操作页面索引
     */
    ReverseWindow({commit, state,rootState,rootGetters,dispatch}, viewIndex) {
      const {spineViewStore} = rootState
      // const view = rootState[spineViewStore.viewMprViews[viewIndex]];
      const view = rootState[spineViewStore.activeModule].viewMprViews[viewIndex];

      const viewdata = rootGetters['spineViewStore/viewsData'][viewIndex];

      const colorTransferFunction = vtkColorTransferFunction.newInstance();
      if (!viewdata.reversed) {
        colorTransferFunction.addRGBPoint(0, 1, 1, 1); // 白色
        colorTransferFunction.addRGBPoint(255, 0, 0, 0); // 黑色
      } else {
        colorTransferFunction.addRGBPoint(255, 1, 1, 1); // 白色
        colorTransferFunction.addRGBPoint(0, 0, 0, 0); // 黑色
      }
      dispatch("spineViewStore/SetViewData", {
        viewIndex,
        key: "reversed",
        value: !viewdata.reversed,
      },{
        root: true,
      },);

      view.sliceActor
        .getProperty()
        .setRGBTransferFunction(0, colorTransferFunction);
      dispatch("spineViewStore/freshView",null,{root:true})

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
      const viewsData = rootGetters['spineViewStore/viewsData']
      dispatch("spineViewStore/SetViewData", {
        viewIndex,
        key: "cameraRotate",
        value: (viewsData[viewIndex].cameraRotate - 90) % 360,
      },{
        root: true,
      },);
      dispatch("setupCamera", viewIndex);
      dispatch("resizeSliceView");

    },
 // 改变平移
 ChangePan({dispatch, state, commit,rootState }) {
  const { spineViewStore } = rootState;

  const v_state = spineViewStore;
  if(v_state.allViewData.isPan){
    const view = v_state.view
    const interactorStyle = vtkInteractorStyleImage.newInstance();
    interactorStyle.setInteractionMode("IMAGE_PAN");
    view.interactor.setInteractorStyle(interactorStyle);

    view.interactor.onLeftButtonPress(()=>{
      view.interactor.getInteractorStyle().endWindowLevel()
    })
    // 确保新的 InteractorStyle 被正确设置并激活

    dispatch("setupCamera", view.viewIndex,);
    view.renderWindow.render()


    dispatch("spineViewStore/SetAllViewData",{
        key: "isPan",
        value: false,
      },{root:true})


  }else{
    dispatch("spineViewStore/SetAllViewData",{
      key: "isPan",
      value: true,
    },{root:true})
  }

  dispatch("resizeSliceView")

}

,


addAngleWidget({state,rootState,commit,dispatch}){
  const {spineViewStore} = rootState
  if(spineViewStore.view.angleWidget){
    spineViewStore.view.angleWidget?.setVisibility(true)
    dispatch("spineViewStore/freshView",null,{root:true})

  }else{
      const widget = vtkAngleWidget.newInstance();
      spineViewStore.widgetManager.addWidget(widget);
      spineViewStore.widgetManager.enablePicking();
      spineViewStore.widgetManager.grabFocus(widget); //启动
      console.log(widget);


      widget.getWidgetState().getMoveHandle().setScale1(10);
      widget.getWidgetState().getMoveHandle().setColor([0,0, 0]);


      widget.getWidgetState().onModified(() => {
        const angle = widget.getAngle() * (180 / Math.PI);
        commit("spineViewStore/SET_ALL_VIEW_STATE",{
        key:"cobb",
        value:angle
        },{root:true})
      });
      commit("spineViewStore/SET_VIEW_ITEM",{key:"angleWidget",value:widget},{root:true})

  }

},
hiddenAngle({rootState,dispatch}){
  const {spineViewStore} = rootState
  console.log(spineViewStore.view);

  if(spineViewStore.view.angleWidget){
    console.log("修改可见性");

    spineViewStore.view.angleWidget.setVisibility(false)
    dispatch("spineViewStore/freshView",null,{root:true})


  }

},


setupCamera({commit, state,rootState,rootGetters,dispatch}, viewIndex){
  dispatch("spineViewStore/setupCamera",viewIndex,{root:true})
},
    /**
     * 重置视图
     */
    resizeSliceView({dispatch, state, getters, commit,rootState}) {
      const {spineViewStore} = rootState
      const view = spineViewStore.view
      if(view.image){
        const container = view.grw.getContainer();
        const {width, height} = container.getBoundingClientRect();

        view.grw.resize(width, height);
        view.renderWindow.render();

      }
    },
    resizeCamera({state,dispatch,rootGetters}){
      const viewsData = rootGetters['spineViewStore/viewsData']
      viewsData.forEach((view) =>{
        dispatch("setupCamera",view.viewIndex)
      })
    },
    beforeViewDestory({state,commit,dispatch}){
      dispatch("clearAllAutoplay")
      commit("RESET_STATE")

    }
  },
};
