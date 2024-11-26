import dicomParser from "dicom-parser";
import { dicomTagDescriptions } from "@/assets/js/utils/dicom/tagCode";


import * as cornerstone from '@cornerstonejs/core';
import { RenderingEngine ,Enums,utilities,metaData,  } from '@cornerstonejs/core';
// import { Types } from '@cornerstonejs/core';

import * as cornerstoneTools from '@cornerstonejs/tools';
import {annotation} from '@cornerstonejs/tools';
const { ViewportType } = Enums;
const { MouseBindings } = cornerstoneTools.Enums;
const renderingEngineId = 'myRenderingEngine';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';

cornerstone.init();
cornerstoneDICOMImageLoader.init();
cornerstoneTools.init();

cornerstone.imageLoader.registerImageLoader('wadouri', cornerstoneDICOMImageLoader.wadouri.loadImage);

const {ToolGroupManager, LengthTool,PanTool, RectangleROITool, ZoomTool } = cornerstoneTools;
cornerstoneTools.addTool(LengthTool)

const viewportId = "spineViewPort"
const toolGroupId = "toolGroup"


import {AllViewData} from './data';
import {xhr_getSlice,xhr_getSingleImage} from "@/api";
import {
  ButtonNames
} from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";


const VIEW_COLORS = {
  BACKGROUND: [0, 0, 0]
};


export default {
  namespaced: true,
  state: {
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
      element
    ) {

      // const renderingEngine = new RenderingEngine(renderingEngineId);
      const renderingEngine = new RenderingEngine(renderingEngineId);
      const toolGroup = await dispatch("initializeToolGroup")

      commit('SET_VIEW_ITEM', {key:"renderer",value:renderingEngine});
      const viewportInput = {
        viewportId ,
        element,
        type: ViewportType.STACK,
        defaultOptions: {
          background: VIEW_COLORS.BACKGROUND, // 黑色背景
                    // background: [0, 0, 0], // 黑色背景

        },
      };


      renderingEngine.enableElement(viewportInput);
      toolGroup.addViewport(viewportId, renderingEngineId);
      commit("SET_VIEW_ITEM",{key:"element",value:element})
      element.addEventListener('mousemove', (evt) => {
        const rect = element.getBoundingClientRect();

        const canvasPos = [
          Math.floor(evt.clientX - rect.left),
          Math.floor(evt.clientY - rect.top),
        ];
        // Convert canvas coordinates to world coordinates
        const viewport = state.view.renderer.getViewport(viewportId);
        const worldPos = viewport.canvasToWorld(canvasPos);

        commit("SET_ALL_VIEW_STATE", {
          key: "hu",
          value: `canvas: (${canvasPos[0]}, ${canvasPos[1]}),world: (${worldPos[0].toFixed(
          2
        )}, ${worldPos[1].toFixed(2)}, ${worldPos[2].toFixed(2)}))`,
        });

      });

    },
    InitViewData({state,dispatch,commit}){


    },

    async GetSlice({dispatch, state,commit}) {
      console.log("getslice")
      try {
        const res = await xhr_getSingleImage({
          studyid: "1838512078533521409",

        });
        if (res) {
          const file = new File([res.data], "image.dcm" );
          dispatch("UpdateSlice",{file})
        } else {
          console.error("Request failed: No data returned");
        }

      } catch (error) {
        console.error("Request failed:", error);
      }
    },


    async UpdateSlice({dispatch, state,commit},{file}) {

      const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);

      const imageIds = [imageId];
      const renderer = state.view.renderer;
      if (!renderer) {
        throw new Error('Renderer is not initialized.');
      }

      const viewport = renderer.getViewport(viewportId);

      await viewport.setStack(imageIds);



      const { imagePositionPatient } = metaData.get('imagePlaneModule', imageId);
      console.log(imagePositionPatient);
      console.log(metaData.get('imagePlaneModule', imageId));

      let start = [400,200]
      let end = [600,350]
      start = viewport.canvasToWorld([...start]);
    end = viewport.canvasToWorld([...end]);
    //   start = utilities.imageToWorldCoords(viewport.getCurrentImageId(),[...start]);
    // end = utilities.imageToWorldCoords(viewport.getCurrentImageId(), [...end]);
      await dispatch("addProgrammaticAnnotation",{start ,end })

      await dispatch("setPositionCenter")
      console.log(      annotation.state.getAllAnnotations());

    },

    async setPositionCenter({state,dispatch}){
      const renderer = state.view.renderer;
      if (!renderer) {
        throw new Error('Renderer is not initialized.');
      }
      const viewport = renderer.getViewport(viewportId);
      const displayArea  =  await dispatch("createDisplayArea",{size:1,pointValue:0.5})
      viewport.setOptions(displayArea);
      viewport.setProperties(displayArea);
      const { flipHorizontal } = displayArea;
      viewport.setCamera({ flipHorizontal});
      viewport.render();
    },
    async addProgrammaticAnnotation ({state},{start,end}){
      console.log(cornerstone);
      console.log({start,end});

      // console.log( viewport.getImageIds());


      console.log(cornerstoneTools.utilities);
      const renderer = state.view.renderer;
      if (!renderer) {
        throw new Error('Renderer is not initialized.');
      }
      const viewport = renderer.getViewport(viewportId);

      await cornerstoneTools.utilities.annotationHydration(viewport, 'Length', [
        start,
        end,

      ]);
      await cornerstoneTools.utilities.triggerAnnotationRenderForViewportIds([
        viewportId
      ]);

      annotation.visibility.showAllAnnotations();
      viewport.render();




    },
    initializeToolGroup({state},toolGroupId){
      let toolGroup = cornerstoneTools.ToolGroupManager.getToolGroup(toolGroupId);

      if (toolGroup) {
        return toolGroup;
      }

      toolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(toolGroupId);

      console.log(LengthTool.toolName);

      // Add the tools to the tool group
      toolGroup.addTool(LengthTool.toolName);
      // toolGroup.addTool(StackScrollTool.toolName);
      // toolGroup.setToolPassive(cornerstoneTools.LengthTool.toolName);
      // toolGroup.setToolActive(cornerstoneTools.StackScrollTool.toolName, {
      //   bindings: [
      //     {
      //       mouseButton: MouseBindings.Wheel,
      //     },
      //   ],
      // });

      return toolGroup;
    },

    createDisplayArea({state},
      {size,
      pointValue,
      canvasValue = pointValue,
      rotation = 90,
      flipHorizontal = false}
    ) {
      const imagePoint = Array.isArray(pointValue)
        ? pointValue
        : [pointValue, pointValue];
      const canvasPoint = Array.isArray(canvasValue)
        ? canvasValue
        : [canvasValue, canvasValue];
      return {
        rotation,
        flipHorizontal,
        displayArea: {
          imageArea: Array.isArray(size) ? size : [size, size],
          imageCanvasPoint: {
            imagePoint,
            canvasPoint,
          },
        },
      };
    },


    beforeViewDestory({state,commit,dispatch}){

    },


  },
};
