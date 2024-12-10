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
import {ViewData,AllViewData, ViewRenderer} from './data';

import {xhr_getSlice,xhr_getDcmSlice} from "@/api";
const coordinate = vtkCoordinate.newInstance();

import { gdcmReadImage} from "@itk-wasm/image-io"
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";

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
function GetTureIJK({viewIndex, ijk}) {
  const newijkMap = {
    [VIEW_TYPES.AXIAL]: [ijk[0], ijk[1], ""],
    [VIEW_TYPES.SAGITTAL]: ["", ijk[0], ijk[1]],
    [VIEW_TYPES.CORONAL]: [ijk[0], "", ijk[1]],
  };
  return newijkMap[viewIndex];
}

const getDefaultState = () => ({
  isload: false,
  isIjkLoad:false,
  studies_selected: {},

  seriesInfo: {
    seriesId: "",
    axialCount: "",
    coronalCount: "",
    sagittalCount: "",
    imageCount: "",
  },

  viewMprViews: Array.from({ length: 3 }, () => ({
    viewIndex: null,
    viewName: null,
    grw: null,
    interactor: null,
    renderWindow: null,
  })),

  CoronalData: new ViewData(),
  AxialData: new ViewData(),
  SagittalData: new ViewData(),
  noduleInfo: {},

  annotations: { value: [], index: new Set() },
  picker: vtkPicker.newInstance(),
  mouseDown: false,
  autoPlayStates: Array.from({ length: 3 }, () => ({
    isPlay: false,
    isAutoPlay: false,
    viewIndex: null,
    timerId: null,
    animationId: null,
  })),
  animationIds: Array.from({ length: 3 }, () => ({
    viewIndex: null,
    animationId: null,
  })),
  activeModule: null,
  activedModules: [],

  allViewData: new AllViewData(),
  selectedNoduleId: null,
});

export default {
  namespaced: true,
  state: getDefaultState(),
  getters: {
    viewsData: (state) => [
      state.SagittalData,
      state.CoronalData,
      state.AxialData,
    ],
  },
  mutations: {
    RESET_STATE(state){
      Object.assign(state, getDefaultState())
    },
    ADD_MODULE(state,module){
      state.activedModules.push(module);
    },
    UPDATE_DIAGNOSE_STATE(state,{store,v_state}){
      console.log("UPDATE_DIAGNOSE_STATE",v_state.AxialData)
      state.activeModule = store
      state.allViewData.copyFrom(v_state.allViewData)
      state.CoronalData.copyFrom(v_state.CoronalData)
      state.SagittalData.copyFrom(v_state.SagittalData)
      state.AxialData.copyFrom(v_state.AxialData)
      console.log("state.AxialData",state.AxialData)

    },
    UPDATE_AUTOPLAY_STATUS(state, { viewIndex, updates}){
      const autoPlayState = state.autoPlayStates[viewIndex];
        Object.keys(updates).forEach(key => {
          autoPlayState[key] = updates[key];
        });
    },
    CLEAR_AUTOPLAY(state, viewIndex) {
      const autoPlayState = state.autoPlayStates[viewIndex];

      if (autoPlayState && autoPlayState.isAutoPlay) {
        // 清除定时器和动画帧
        if (autoPlayState.timerId) {
          clearInterval(autoPlayState.timerId);
          autoPlayState.timerId = null;
        }
        if (autoPlayState.animationId) {
          cancelAnimationFrame(autoPlayState.animationId);
          autoPlayState.animationId = null;
        }

        // 更新状态
        autoPlayState.isAutoPlay = false;

      }
    }
,
    UPDATE_LOAD_STATUS(state,statu) {
      state.isload = statu;
    },
    UPDATE_IJKLOAD_STATUS(state,statu) {
      state.isIjkLoad = statu;
    },
    SET_STUDIES_SELECTED(state, payload) {
      state.studies_selected = payload;
    },
    SET_SERIES_INFO(state, seriesInfo) {
      state.seriesInfo = seriesInfo;
    },

    INIT_VIEW_MPR_VIEW(state, {viewIndex, data}) {
      state.viewMprViews[viewIndex] = data;
    },
    SET_VIEW_MPR_VIEW(state, {viewIndex, key, value}) {
      state.viewMprViews[viewIndex][key] = value;
    },
    SET_VIEW_DATA(state, {viewIndex, key, value}) {
      const viewName = VIEWDATA_NAMES[viewIndex];
      if (!state[viewName]) {
        state[viewName] = {};
      }
      state[viewName][key] = value;
    },

    SET_MOUSE_DOWN(state, value) {
      state.mouseDown = value;
    },

    SET_ALL_VIEW_STATE(state, { key, value}) {
      state.allViewData[key] = value;
    },


  },
  actions: {
    async InitAxialView({dispatch}, container) {
      await dispatch("InitView", {
        container,
        viewName: VIEW_NAMES.AXIAL,
        viewIndex: VIEW_TYPES.AXIAL,
      });
    },
    async InitCoronalView({dispatch}, container) {
      await dispatch("InitView", {
        container,
        viewName: VIEW_NAMES.CORONAL,
        viewIndex: VIEW_TYPES.CORONAL,
      });
    },
    async InitSagittalView({dispatch}, container) {
      await dispatch("InitView", {
        container,
        viewName: VIEW_NAMES.SAGITTAL,
        viewIndex: VIEW_TYPES.SAGITTAL,
      });
    },

    async InitView(
      {dispatch, commit, state},
      {container, viewName, viewIndex},
    ) {
      const data = await dispatch("InitMprView", {
        container,
      });

      commit("INIT_VIEW_MPR_VIEW", {
        viewIndex,
        data: {
          viewIndex: viewIndex,
          viewName,
          ...data,
        },
      });

      commit("SET_VIEW_DATA", {viewIndex, key: "viewName", value: viewName});
      commit("SET_VIEW_DATA", {viewIndex, key: "viewIndex", value: viewIndex});
    },
    async InitMprView({dispatch, commit}, {container, mode}) {
      const grw = vtkGenericRenderWindow.newInstance();
      grw.setContainer(container);
      const {width, height} = container.getBoundingClientRect();
      grw.resize(width, height);

      const interactorstyle = vtkInteractorStyleImage.newInstance();
      interactorstyle.setInteractionMode("IMAGE2D");
        const obj = {
          grw,
          renderWindow: grw.getRenderWindow(),
          interactor: grw.getInteractor(),

        };
        obj.interactor.initialize();
        obj.interactor.bindEvents(container);
        obj.interactor.setInteractorStyle(interactorstyle);
        obj.interactor.getInteractorStyle().modified();
        obj.interactor.onLeftButtonPress(()=>{
        obj.interactor.getInteractorStyle().endWindowLevel()
        })
        obj.renderWindow.setInteractor(obj.interactor);



        return obj;
    },
    async InitAllSlice({dispatch,state,rootState,commit},seriesInfo){
      const modules = ["noduleInfoStore", "fracInfoStore", "pneumoniaInfoStore"];

      await Promise.all(modules.map(module => dispatch(module + "/InitModuleState", seriesInfo, { root: true })))

      const dimensions = [seriesInfo.sagittalCount, seriesInfo.coronalCount, seriesInfo.axialCount]
      const ijk = dimensions.map(item => Math.round(item / 2) + 1)

      const imageDatas = await Promise.all([
        dispatch("GetSlice", {
          viewName: VIEW_NAMES.SAGITTAL,
          index: ijk[0],
          viewIndex: VIEW_TYPES.SAGITTAL,
        }),

        dispatch("GetSlice", {
          viewName: VIEW_NAMES.CORONAL,
          index: ijk[1],
          viewIndex: VIEW_TYPES.CORONAL,
        }),

        dispatch("GetSlice", {
          viewName: VIEW_NAMES.AXIAL,
          index: ijk[2],
          viewIndex: VIEW_TYPES.AXIAL,
        }),
      ]);
      console.log(imageDatas)
      modules.forEach(module=>{
        imageDatas.forEach((imagedata,index)=>{
          commit(module+"/SET_VIEW_MPR_VIEW",{viewIndex:index, key:"image", value:imagedata},{root:true})
        })

      })


 state.viewMprViews.forEach((view, index) => {
          dispatch("setupInteractor", {view, dimensions});

        });
      dispatch("noduleInfoStore/ActiveNoduleState",null,{root:true})


      //  dispatch("InitModuleView","noduleInfoStore").then(async()=>{
      //   const {SagittalData,CoronalData,AxialData,allViewData} = state
      //  const ijk = [SagittalData.changedPageIndex,CoronalData.changedPageIndex,AxialData.changedPageIndex]
      //  const dimensions = [SagittalData.dimension,CoronalData.dimension,AxialData.dimension]
      //  await dispatch("InitSlice",{ijk,dimensions})
      // })

      // const {SagittalData,CoronalData,AxialData,allViewData} = state
      //  const ijk = [SagittalData.changedPageIndex,CoronalData.changedPageIndex,AxialData.changedPageIndex]
      //  const dimensions = [SagittalData.dimension,CoronalData.dimension,AxialData.dimension]
      //  await dispatch("InitSlice",{ijk,dimensions})

    },

   async  InitModuleView({dispatch, state, getters, commit,rootState,rootGetters },currentState){

    commit("ADD_MODULE",currentState)
      // const {SagittalData,CoronalData,AxialData,allViewData} = state
      if(state.activeModule){
        commit(state.activeModule+"/SET_STATE",state,{root:true})
      }

      const active_state = rootState[currentState]

      commit("UPDATE_DIAGNOSE_STATE",{store:currentState,v_state:active_state})
      state.viewMprViews.forEach((view,index)=>{

        const renderWindow =  view.renderWindow
         renderWindow.getRenderers().forEach(render=>{
            renderWindow.removeRenderer(render)
          })
          renderWindow.addRenderer(active_state.viewMprViews[index].renderer)
          // renderWindow.render()
      })

      const {SagittalData,CoronalData,AxialData,allViewData} = state
      const ijk = [SagittalData.changedPageIndex,CoronalData.changedPageIndex,AxialData.changedPageIndex]
      const dimensions = [SagittalData.dimension,CoronalData.dimension,AxialData.dimension]
      await dispatch("InitSlice",{ijk,dimensions})

        // await dispatch("InitIJK",{ijk})

      dispatch("mprToolsStore/UpdateWindowWidth",allViewData.colorWindow,{root:true})
      dispatch("mprToolsStore/UpdateWindowCenter",allViewData.colorLevel,{root:true})

      dispatch("toolBarStore/initButtonState",{showButtons: allViewData.buttons ,activeButtons:allViewData.activeButtons} ,{root:true})

      commit("toolBarStore/SET_SLICE_CT_PIC_LAYOUT",allViewData.layOut,{root:true})


      //  dispatch('mprToolsStore/resizeSliceViews', null, { root: true });
      },
    async ActiveModule({dispatch, state, getters, commit,rootState,rootGetters},currentState){
      // Console.LOG(getAllButtonActiveStates)

      if(state.activeModule){
        const activeButtons = rootGetters['toolBarStore/getAllButtonActiveStates']

      console.log("activeButtons",activeButtons)
        commit(state.activeModule+"/SET_STATE",state,{root:true})

      }
      const active_state = rootState[currentState]
      commit("UPDATE_DIAGNOSE_STATE",{store:currentState,v_state:active_state})
      state.viewMprViews.forEach((view,index)=>{
        const renderWindow =  view.renderWindow
         renderWindow.getRenderers().forEach(render=>{
            renderWindow.removeRenderer(render)
          })
          renderWindow.addRenderer(active_state.viewMprViews[index].renderer)
          // renderWindow.render()
      })
      console.log(state.AxialData)
      const {SagittalData,CoronalData,AxialData,allViewData} = state
      console.log("allViewData",allViewData)
      dispatch("mprToolsStore/UpdateColorWindow",allViewData.colorWindow,{root:true})
      dispatch("mprToolsStore/UpdateColorLevel",allViewData.colorLevel,{root:true})

      dispatch("toolBarStore/initButtonState",{showButtons: allViewData.buttons ,activeButtons:allViewData.activeButtons} ,{root:true})


      commit("toolBarStore/SET_SLICE_CT_PIC_LAYOUT",allViewData.layOut,{root:true})


      // commit("UPDATE_DIAGNOSE_STATE",{store:"noduleInfoStore",v_state:active_state})
      // dispatch('mprToolsStore/resizeSliceViews', null, { root: true });



    },

    async InitSlice({dispatch, state, getters, commit},{ijk,dimensions}) {
      try {
        // state.viewMprViews.forEach((view, index) => {
        //   dispatch("setupInteractor", {view, dimensions});

        // });
        await dispatch("InitIJK", ijk);
        ijk.forEach((item, index) => {
          dispatch("UpdateDisplay", {
            viewIndex: index,
            changedPageIndex: item,
          });
        });
        const {allViewData} = state


      } catch (err) {
        console.log(err);
      }
    },
    SetViewData({commit, state, dispatch},{viewIndex,key,value}){
      commit("SET_VIEW_DATA",{ viewIndex,key,value
      })
    },
    SetAllViewData({commit},{ key,value }){
      commit("SET_ALL_VIEW_STATE",{ key,value })
    },
    UpdateDisplay({commit, state, dispatch}, {viewIndex, changedPageIndex}) {
      let pagex;
      let pagey;

      if (viewIndex == VIEW_TYPES.SAGITTAL) {
        pagex = changedPageIndex;
        pagey = state.CoronalData.changedPageIndex;
        dispatch("UpdateDisplayValue", {
          changedviewIndex: VIEW_TYPES.AXIAL,
          pagex,
          pagey,
        });

        pagex = changedPageIndex;
        pagey = state.AxialData.changedPageIndex;
        dispatch("UpdateDisplayValue", {
          changedviewIndex: VIEW_TYPES.CORONAL,
          pagex,
          pagey,
        });
      } else if (viewIndex == VIEW_TYPES.CORONAL) {
        pagex = state.SagittalData.changedPageIndex;
        pagey = changedPageIndex;
        dispatch("UpdateDisplayValue", {
          changedviewIndex: VIEW_TYPES.AXIAL,
          pagex,
          pagey,
        });

        pagex = changedPageIndex;
        pagey = state.AxialData.changedPageIndex;
        dispatch("UpdateDisplayValue", {
          changedviewIndex: VIEW_TYPES.SAGITTAL,
          pagex,
          pagey,
        });
      } else if (viewIndex == VIEW_TYPES.AXIAL) {
        pagex = state.SagittalData.changedPageIndex;
        pagey = changedPageIndex;
        dispatch("UpdateDisplayValue", {
          changedviewIndex: VIEW_TYPES.CORONAL,
          pagex,
          pagey,
        });

        pagex = state.CoronalData.changedPageIndex;
        pagey = changedPageIndex;
        dispatch("UpdateDisplayValue", {
          changedviewIndex: VIEW_TYPES.SAGITTAL,
          pagex,
          pagey,
        });
      }
    },
    UpdateDisplayValue({commit, state,rootState}, {changedviewIndex, pagex, pagey}) {
      const view = rootState[state.activeModule].viewMprViews[changedviewIndex];

      if(view && view.image){
          const world = view.image.indexToWorld([pagex, pagey, 0]);
      coordinate.setValue(...world);

      const [ndcX, ndcY] = coordinate.getComputedDoubleDisplayValue(
        view.renderer,
      );

      commit("SET_VIEW_DATA", {
        viewIndex: changedviewIndex,
        key: "displayX",
        value: ndcX,
      });
      commit("SET_VIEW_DATA", {
        viewIndex: changedviewIndex,
        key: "displayY",
        value: ndcY,
      });
      }

    },
    async UpdateIJK({dispatch, getters, commit}, ijk) {
      commit("UPDATE_IJKLOAD_STATUS",true)


      await Promise.all([
        dispatch("updateSliceForView", {
          viewName: VIEW_NAMES.SAGITTAL,
          index: ijk[0],
          viewIndex: VIEW_TYPES.SAGITTAL,
        }),

        dispatch("updateSliceForView", {
          viewName: VIEW_NAMES.CORONAL,
          index: ijk[1],
          viewIndex: VIEW_TYPES.CORONAL,
        }),

        dispatch("updateSliceForView", {
          viewName: VIEW_NAMES.AXIAL,
          index: ijk[2],
          viewIndex: VIEW_TYPES.AXIAL,
        }),
      ]);
      commit("UPDATE_IJKLOAD_STATUS",false)
    },

    async InitIJK({dispatch, getters, commit}, ijk) {
      await Promise.all([
        dispatch("initSliceForView", {
          index: ijk[0],
          viewIndex: VIEW_TYPES.SAGITTAL,
        }),

        dispatch("initSliceForView", {
          index: ijk[1],
          viewIndex: VIEW_TYPES.CORONAL,
        }),

        dispatch("initSliceForView", {
          index: ijk[2],
          viewIndex: VIEW_TYPES.AXIAL,
        }),
      ]);
    },



    async initSliceForView({dispatch,commit,state,rootState}, { index, viewIndex}){
      const v_view = rootState[state.activeModule].viewMprViews[viewIndex];

      const imageData = v_view.image
      await dispatch("UpdateSlice", {imageData, viewIndex, index});
    },
    async updateSliceForView({dispatch,commit,state}, {viewName, index, viewIndex}) {
      if (index === "") return;
      commit("UPDATE_LOAD_STATUS",true)
      const preModule = state.activeModule
      const imageData = await dispatch("GetSlice", {viewName,viewIndex, index});

      if (imageData &&preModule ==state.activeModule) {
        await dispatch("UpdateSlice", {imageData, viewIndex, index});
      }
    },
    setupInteractor({dispatch, state, commit,getters,rootState}, {view, dimensions}) {
      const viewIndex = view.viewIndex
      const dimension = dimensions[viewIndex];
      commit("SET_VIEW_DATA", {
        viewIndex: viewIndex,
        key: "dimension",
        value: dimension,
      });

        console.log("setupInteractor")

      view.interactor.onLeftButtonPress((event) => {
        if(state.activeModule){
          const v_view = rootState[state.activeModule].viewMprViews[viewIndex];

          dispatch("clearAllAutoplay")

          if (!state.allViewData.isPan) {
            console.log("onLeftButtonPress")
            dispatch("handleMousePress", {event, view:v_view});
          }else{
            view.interactor.getInteractorStyle().startPan()
          }
        }

      });

      view.interactor.onMouseMove((event) => {
        if(state.activeModule){
          const v_view = rootState[state.activeModule].viewMprViews[viewIndex];
          if (!state.allViewData.isPan) {
            dispatch("handleMouseMove", {event, view:v_view});
          }else{
            dispatch('mprToolsStore/resizeSliceViews', null, { root: true });

          }
        }

      });

      view.interactor.onLeftButtonRelease(() =>{
         if(state.activeModule){
           commit("SET_MOUSE_DOWN", false)

        }
      }

      );

      view.interactor.onStartMouseWheel(() => {
        if(state.activeModule){
          if(!state.autoPlayStates[viewIndex].isPlay){
            getters.viewsData.forEach((viewdata) => {
              commit("CLEAR_AUTOPLAY", viewdata.viewIndex);
              commit("UPDATE_AUTOPLAY_STATUS", {
                viewIndex: viewdata.viewIndex,
               updates:{
                isAutoPlay: false,
               }
              });
            });
            let animationId;

            const animate = () => {
              if (!state.isload) {
                dispatch("updateSliceForView", {
                  viewName: viewName,
                  viewIndex: viewIndex,
                  index: getters.viewsData[viewIndex].changedPageIndex,
                });
                animationId = requestAnimationFrame(animate);

                commit("UPDATE_AUTOPLAY_STATUS", {
                  viewIndex: viewIndex,
                  updates:{
                    timerId: null,
                  animationId: animationId,
                  isPlay: true,
                  }
                });
              }

            };

          }

        }


      });
      view.interactor.onMouseWheel((event) =>{
        if(state.activeModule){
          dispatch("handleMouseWheel", {spinY: event.spinY, view})
        }

      }
      );
      view.interactor.onEndMouseWheel((event)=>{
        if(state.activeModule){
          if(state.autoPlayStates[viewIndex].isPlay){
            commit("CLEAR_AUTOPLAY", viewIndex);
            const viewdata = getters.viewsData[viewIndex];
            if(viewdata.gotoPageIndex != viewdata.changedPageIndex){
             dispatch("updateSliceForView", {
               viewName: viewdata.viewName,
               viewIndex: viewdata.viewIndex,
               index: viewdata.changedPageIndex,
             });
            }
          }
        }
      })

    },

    async handleMousePress(
      {dispatch, commit, state, getters},
      {event, view},
    ) {
      console.log("handleMousePress")
      const viewIndex = view.viewIndex
      commit("SET_MOUSE_DOWN", true);
      const {x, y} = event.position;
      state.picker.pick([x, y, 0], view.renderer);
      const pickedPositions = state.picker.getPickedPositions();
      if (pickedPositions.length > 0) {
        const pickedPosition = pickedPositions[0];
        dispatch(state.activeModule+"/handleMousePress",{pickedPosition,view},{root:true})

        const ijk = view.image
          .worldToIndex(pickedPosition)
          .map(Math.round);

        const trueijk = GetTureIJK({
          viewIndex: viewIndex,
          ijk,
        });

        const imageScales = view.image.getPointData().getScalars();
        const pageindex =
          ijk[0] +
          ijk[1] * view.image.getDimensions()[0] +
          ijk[2] *
          view.image.getDimensions()[0] *
          view.image.getDimensions()[1];
        const pixelValue = imageScales.getTuple(pageindex);

        commit("SET_VIEW_DATA", {
          viewIndex: viewIndex,
          key: "hu",
          value: pixelValue[0],
        });

        trueijk.forEach((item, index) => {
          if (item !== "") {
            if (item <= 0) {
              trueijk[index] = 1; //重复执行了，怎么解
              commit("SET_VIEW_DATA", {
                viewIndex: index,
                key: "changedPageIndex",
                value: 1,
              });
            } else if (item > getters.viewsData[index].dimension) {
              trueijk[index] = getters.viewsData[index].dimension;
              commit("SET_VIEW_DATA", {
                viewIndex: index,
                key: "changedPageIndex",
                value: getters.viewsData[index].dimension,
              });
            } else {
              commit("SET_VIEW_DATA", {
                viewIndex: index,
                key: "changedPageIndex",
                value: item,
              });
            }
            dispatch("UpdateDisplay", {
              viewIndex: index,
              changedPageIndex: getters.viewsData[index].changedPageIndex,
            });
          }
        });
        if (!state.isIjkLoad) {
          dispatch("UpdateIJK", trueijk)
        }

      } else {
        commit("SET_VIEW_DATA", {
          viewIndex: viewIndex,
          key: "hu",
          value: "",
        });
      }
    },
    handleMouseMove({commit, state, dispatch, getters}, {event, view}) {
      const viewIndex = view.viewIndex
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
        commit("SET_VIEW_DATA", {
          viewIndex:  viewIndex,
          key: "hu",
          value: pixelValue[0] ,
        });
        if (state.mouseDown) {
          console.log("handleMouseMove")

          const trueijk = GetTureIJK({
            viewIndex:  viewIndex,
            ijk,
          });
          trueijk.forEach((item, index) => {
            const viewData = getters.viewsData[index]
            if (item !== "") {
              if (item <= 0) {
                trueijk[index] = 1; //重复执行了，怎么解
                commit("SET_VIEW_DATA", {
                  viewIndex: index,
                  key: "changedPageIndex",
                  value: 1,
                });
              } else if (item > viewData.dimension) {
                trueijk[index] = viewData.dimension;
                commit("SET_VIEW_DATA", {
                  viewIndex: index,
                  key: "changedPageIndex",
                  value: viewData.dimension,
                });
              } else {
                commit("SET_VIEW_DATA", {
                  viewIndex: index,
                  key: "changedPageIndex",
                  value: item,
                });
              }

              dispatch("UpdateDisplay", {
                viewIndex: index,
                changedPageIndex: viewData.changedPageIndex,
              });
            }
          });

          if (!state.isIjkLoad) {
            dispatch("UpdateIJK", trueijk)
          }


        }
      } else {
        commit("SET_VIEW_DATA", {
          viewIndex: viewIndex,
          key: "hu",
          value: "",
        });
      }
    },
    handleMouseRelease(){
console.log("")
    },

    handleMouseWheel({commit, state, dispatch, getters}, {spinY, view}) {
      const viewIndex = view.viewIndex
      const viewData = getters.viewsData[viewIndex]

      if (viewData.changedPageIndex) {
        let newIndex;
        if (spinY > 0) {
          newIndex =
            (viewData.changedPageIndex %
              viewData.dimension) +
            1;
          if (
            viewData.changedPageIndex ===
            viewData.dimension
          ) {
            commit("SET_VIEW_DATA", {
              viewIndex: viewIndex,
              key: "changedPageIndex",
              value: 1,
            });
            dispatch("UpdateDisplay", {
              viewIndex: viewIndex,
              changedPageIndex: 1,
            });
          } else {
            commit("SET_VIEW_DATA", {
              viewIndex: viewIndex,
              key: "changedPageIndex",
              value: viewData.changedPageIndex + 1,
            });
            dispatch("UpdateDisplay", {
              viewIndex: viewIndex,
              changedPageIndex:
              viewData.changedPageIndex,
            });
          }
        } else {
          newIndex =
            ((viewData.changedPageIndex -
              2 +
              viewData.dimension) %
              viewData.dimension) +
            1;
          if (viewData.changedPageIndex === 1) {
            commit("SET_VIEW_DATA", {
              viewIndex: viewIndex,
              key: "changedPageIndex",
              value: viewData.dimension,
            });
            dispatch("UpdateDisplay", {
              viewIndex: viewIndex,
              changedPageIndex: viewData.dimension,
            });
          } else {
            commit("SET_VIEW_DATA", {
              viewIndex: viewIndex,
              key: "changedPageIndex",
              value: viewData.changedPageIndex - 1,
            });
            dispatch("UpdateDisplay", {
              viewIndex: viewIndex,
              changedPageIndex:
                 viewData.changedPageIndex,
            });
          }
        }
        if(!state.isload){
          dispatch("updateSliceForView", {
            viewName: viewData.viewName,
            viewIndex: viewIndex,
            index: viewData.changedPageIndex,
          });
        }

      }
    },


    async GetSlice({ dispatch, state, commit }, { viewName, viewIndex, index }) {
      try {
        let loading = setInterval(() => {
          Vue.prototype.$message.destroy();
        }, 50);
        commit("SET_VIEW_DATA", { viewIndex, key: "gotoPageIndex", value: index });

        const res = await xhr_getSlice({
          seriesId: state.seriesInfo.seriesId,
          viewName: viewName,
          viewIndex: index,
        });

        if (res) {
          commit("UPDATE_LOAD_STATUS", false);
          clearInterval(loading);

          const file = new File([res.data], "image.dcm", { type: "application/dicom" });
          // const dicomMetadata = await readDicomTags(file);
          // const tag = '0020|0037';
          // const imagePositionPatient = dicomMetadata.tags.find(item => item[0] === tag);
          // console.log(index,imagePositionPatient)


          const result = await gdcmReadImage(file);
          const outputImage = result.image;
          const imageData = vtkITKHelper.convertItkToVtkImage(outputImage);

          return imageData;
        } else {
          console.error("Request failed: No data returned");
          return null; // Return null or some indication of failure
        }
      } catch (error) {
        console.error("Request failed:", error);
        return null; // Return null in case of error
      }
    },

    async UpdateSlice(
      {commit, dispatch, state,rootState},
      {imageData, viewIndex, index},
    ) {
      const image = imageData;
      const view = state.viewMprViews[viewIndex];

      const v_view = rootState[state.activeModule].viewMprViews[viewIndex];

      // const view = state.viewMprViews[viewIndex];
      if (!v_view) {
        console.error("没有这个页面:", viewIndex);
        return;
      }
      commit(state.activeModule+"/SET_VIEW_MPR_VIEW",{viewIndex , key:"image", value:image},{root:true})
      // view.image = image;
      v_view.sliceMapper.setInputData(image);
      dispatch(state.activeModule+"/UpdateSlice",{viewIndex,index},{root:true})


      dispatch("setupCamera", viewIndex);

      view.renderWindow.render();

      commit(state.activeModule+"/SET_VIEW_MPR_VIEW",{viewIndex , key:"pageIndex", value:index},{root:true})


      commit("SET_VIEW_DATA", {viewIndex, key: "pageIndex", value: index});
    },
    setupCamera({commit, state, getters,rootState}, viewIndex) {
      const view = state.viewMprViews[viewIndex];

      const v_view = rootState[state.activeModule].viewMprViews[viewIndex];

      // const view = state.viewMprViews[viewIndex];
      const image = v_view.image;
      if(image){
        const camera = v_view.renderer.getActiveCamera();

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


        // camera.setViewUp(0, 1, 0);
        v_view.renderer.resetCamera();

        const [point1, point2] = [
          v_view.renderer.worldToNormalizedDisplay(
            bounds[0],
            bounds[2],
            bounds[4],
            true,
          ),
          v_view.renderer.worldToNormalizedDisplay(
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
        camera.roll(getters.viewsData[viewIndex].cameraRotate);

        view.renderWindow.render();
      }


    },

    addRectangleAnnotation({commit, state}, {view, annotation, bboxindex}) {
      const {xmin, ymin, xmax, ymax, boundsmin, boundsmax} = annotation;
      let boundsZ = view.image.getBounds()[2]
      if(viewIndex == 2){
        boundsZ = view.image.getBounds()[5]
      }
      const [worldpoint1, worldpoint2] = [
        view.image.indexToWorld([xmin, ymin, boundsZ]),
        view.image.indexToWorld([xmax, ymax,boundsZ]),
      ];
      const points = vtkPoints.newInstance();
      points.setNumberOfPoints(5);
      points.setPoint(0, worldpoint1[0], worldpoint1[1], worldpoint1[2]);
      points.setPoint(1, worldpoint2[0], worldpoint1[1], worldpoint1[2]);
      points.setPoint(2, worldpoint2[0], worldpoint2[1], worldpoint2[2]);
      points.setPoint(3, worldpoint1[0], worldpoint2[1], worldpoint2[2]);
      points.setPoint(4, worldpoint1[0], worldpoint1[1], worldpoint1[2]);

      const lines = vtkCellArray.newInstance();
      lines.insertNextCell([5, 0, 1, 2, 3, 4]);

      const polyData = vtkPolyData.newInstance();
      polyData.setPoints(points);
      polyData.setLines(lines);

      const mapper = vtkMapper.newInstance();
      mapper.setInputData(polyData);

      const actor = vtkActor.newInstance();
      actor.setVisibility(false);


      actor.setMapper(mapper);
      actor.getProperty().setColor(...BBOX_COLORS.DEFAULT);
      actor.getProperty().setLineWidth(1);

      commit("ADD_ANNOTATION", {
        actor,
        worldpoint1,
        worldpoint2,
        boundsmin,
        boundsmax,
        viewIndex: viewIndex,
        bboxIndex: bboxindex,
      });
      view.renderer.addActor(actor);
      view.renderWindow.render();
    },
    // tools ===================================================================


    /**
     * 自动播放
     * @param {number} viewIndex - 操作页面索引
     * @param {number} time - 单片切换时间，单元毫秒
     */
    AutoPlay({ commit, dispatch, state, getters,rootState }, { viewIndex }) {

      const view = rootState[state.activeModule].viewMprViews[viewIndex];
      const viewData = getters.viewsData[viewIndex]
      if (!state.autoPlayStates[viewIndex].isAutoPlay ) {
        dispatch("clearAllAutoplay")
        // 定义一个变量来保存 requestAnimationFrame 的 ID
         // 创建定时器，每隔 50ms 触发
         const timer = setInterval(() => {
          let newIndex =
            (viewData.changedPageIndex % viewData.dimension) + 1;

          if (viewData.changedPageIndex === viewData.dimension) {
            newIndex = 1;
            commit("SET_VIEW_DATA", {
              viewIndex: viewIndex,
              key: "changedPageIndex",
              value: 1,
            });
            dispatch("UpdateDisplay", {
              viewIndex: viewIndex,
              changedPageIndex: 1,
            });
          } else {
            commit("SET_VIEW_DATA", {
              viewIndex: viewIndex,
              key: "changedPageIndex",
              value: viewData.changedPageIndex + 1,
            });
            dispatch("UpdateDisplay", {
              viewIndex: viewIndex,
              changedPageIndex:
              viewData.changedPageIndex,
            });
          }
          if(!state.isload){
            dispatch("updateSliceForView", {
              viewName: viewData.viewName,
              viewIndex: viewIndex,
              index: viewData.changedPageIndex,
            });
          }
        }, 60);

          commit("UPDATE_AUTOPLAY_STATUS", {
            viewIndex: viewIndex,
           updates:{
            timerId: timer,
            isPlay: true,
           }
          });

        commit("UPDATE_AUTOPLAY_STATUS", {
          viewIndex: viewIndex,
         updates:{
          isAutoPlay: true,
         }
        });
      } else {
         commit("CLEAR_AUTOPLAY", viewIndex);
         if(viewData.gotoPageIndex != viewData.changedPageIndex){
          dispatch("updateSliceForView", {
            viewName: viewData.viewName,
            viewIndex: viewData.viewIndex,
            index: viewData.changedPageIndex,
          });
         }
         commit("UPDATE_AUTOPLAY_STATUS", {
          viewIndex: viewIndex,
         updates:{
          isAutoPlay: false,
         }
        });
      }
    },

    freshView({state,rootState},viewType){
      const v_state = rootState[state.activeModule]
      if (v_state.viewMprViews[viewType].image){
        state.viewMprViews[viewType].renderWindow.render()
      }else{
      }

    },
    clearAllAutoplay({state,getters,commit,dispatch}){

      getters.viewsData.forEach((viewdata) => {
        commit("CLEAR_AUTOPLAY", viewdata.viewIndex);

        commit("UPDATE_AUTOPLAY_STATUS", {
          viewIndex: viewdata.viewIndex,
         updates:{
          isAutoPlay: false,
         }
        });})
    },
    beforeViewDestory({state,commit,dispatch}){


      dispatch("clearAllAutoplay")
      commit("RESET_STATE")
      // commit("toolBarStore/INIT_BUTTON_SHOW_STATE",[],{root:true})
      // commit("toolBarStore/INIT_BUTTON_ACTIVE_STATE",[],{root:true})

    }
  },
};
