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

export default {
  namespaced: true,
  state: {
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

    allViewData: { hu:'',reversed:false,cameraRotate:0 ,scaleLength: null,},

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

      await dispatch("GetSlice");
      dispatch("spineToolsStore/resizeSliceView",null,{root:true})

    },
    InitViewData({state,dispatch,commit}){

      commit("INIT_NODULE_ALL_VIEW_DATA")
      const { allViewData } = state
      dispatch("spineToolsStore/UpdateColorWindow",allViewData.colorWindow,{root:true})
      dispatch("spineToolsStore/UpdateColorLevel",allViewData.colorLevel,{root:true})
      commit("toolBarStore/INIT_BUTTON_SHOW_STATE",allViewData.buttons,{root:true})
      commit("toolBarStore/INIT_BUTTON_ACTIVE_STATE",allViewData.activeButtons,{root:true})
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









  },
};
