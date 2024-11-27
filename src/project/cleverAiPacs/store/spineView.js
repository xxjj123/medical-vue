import dicomParser from "dicom-parser";
import { dicomTagDescriptions } from "@/assets/js/utils/dicom/tagCode";


import * as cornerstone from '@cornerstonejs/core';
import { RenderingEngine ,Enums,utilities,metaData,  } from '@cornerstonejs/core';
// import { Types } from '@cornerstonejs/core';

import * as cornerstoneTools from '@cornerstonejs/tools';
import {annotation,SplineROITool} from '@cornerstonejs/tools';
const { ViewportType } = Enums;
const { MouseBindings } = cornerstoneTools.Enums;
const renderingEngineId = 'myRenderingEngine';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';

cornerstone.init();
cornerstoneDICOMImageLoader.init();
cornerstoneTools.init();

cornerstone.imageLoader.registerImageLoader('wadouri', cornerstoneDICOMImageLoader.wadouri.loadImage);

const {ToolGroupManager, LengthTool,PanTool,  RectangleROITool, ZoomTool } = cornerstoneTools;
cornerstoneTools.addTool(LengthTool)
cornerstoneTools.addTool(SplineROITool)
cornerstoneTools.addTool(RectangleROITool)


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
      commit("SET_VIEW_ITEM",{key:"toolGroup",value:toolGroup})

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

        if(viewport.getImageIds()[0]){
          // const ijk = utilities.worldToImageCoords(viewport.getImageIds()[0],worldPos)
          // commit("SET_ALL_VIEW_STATE", {
          //   key: "ijk",
          //   value: ` (${ijk[0].toFixed(2)}, ${ijk[1].toFixed(2)})`,
          // });
          commit("SET_ALL_VIEW_STATE", {
            key: "hu",
            value: `canvas: (${canvasPos[0]}, ${canvasPos[1]}),world: (${worldPos[0].toFixed(
            2
          )}, ${worldPos[1].toFixed(2)}, ${worldPos[2].toFixed(2)}))`,
          });
        }

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


      commit("SET_VIEW_ITEM",{key:"imageId",value:imageId})





      const {pixelSpacing,sliceThickness,frameOfReferenceUID,rows,columns,sliceLocation,imagePositionPatient} = metaData.get('imagePlaneModule', imageId);

        metaData.addProvider((type)=>{
          if (type === 'imagePlaneModule') {
            const imageOrientationPatient = [1, 0, 0, 0, 1, 0 ];
            const imagePositionPatient = [0,0,0];
            let columnPixelSpacing = null;
            let rowPixelSpacing = null;
            if (pixelSpacing) {
                rowPixelSpacing = pixelSpacing[0];
                columnPixelSpacing = pixelSpacing[1];
            }
            let rowCosines = null;
            let columnCosines = null;
            if (imageOrientationPatient) {
                rowCosines = [
                    parseFloat(imageOrientationPatient[0]),
                    parseFloat(imageOrientationPatient[1]),
                    parseFloat(imageOrientationPatient[2]),
                ];
                columnCosines = [
                    parseFloat(imageOrientationPatient[3]),
                    parseFloat(imageOrientationPatient[4]),
                    parseFloat(imageOrientationPatient[5]),
                ];
            }
            return {
                frameOfReferenceUID,
                rows,
                columns ,
                imageOrientationPatient,
                rowCosines,
                columnCosines,
                imagePositionPatient,
                sliceThickness,
                sliceLocation ,
                pixelSpacing,
                rowPixelSpacing,
                columnPixelSpacing,
            };

        }
        })


      await cornerstoneTools.utilities.triggerAnnotationRenderForViewportIds([
        viewportId
      ]);
      // await dispatch("addProgrammaticAnnotation",{worldPoints })

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
    async addProgrammaticAnnotation ({state},{worldPoints}){
      // console.log({start,end});

      const renderer = state.view.renderer;
      if (!renderer) {
        throw new Error('Renderer is not initialized.');
      }
      const viewport = renderer.getViewport(viewportId);

      const viewReference = viewport.getViewReference();
      const { viewPlaneNormal, FrameOfReferenceUID } = viewReference;
      const newannotation = {
      annotationUID:   utilities.uuidv4(),
      data: {
      handles: {
        points: worldPoints,
                    },
              },
      highlighted: false,
      autoGenerated: false,
      invalidated: false,
      isLocked: false,
      isVisible: true,
      metadata: {
      toolName:LengthTool.toolName,
      viewPlaneNormal,
      FrameOfReferenceUID,
      referencedImageId: viewport.getImageIds()[0],
              },
          };
          annotation.state.addAnnotation(newannotation,viewport.element)

      await cornerstoneTools.utilities.triggerAnnotationRenderForViewportIds([
        viewportId
      ]);

      viewport.render();

    },

    async getAnnotationInfo({state}){
      console.log( "cornerstone",cornerstone);
      console.log( "cornerstone.metaData",metaData);


      console.log("cornerstone.utilities",utilities);

      console.log("cornerstoneTools",cornerstoneTools);
      console.log( "annotation.state",annotation.state);
      console.log("allAnnotations",annotation.state.getAllAnnotations());

    },


    initializeToolGroup({state},toolGroupId){
      let toolGroup = cornerstoneTools.ToolGroupManager.getToolGroup(toolGroupId);
      if (toolGroup) {
        return toolGroup;
      }

      toolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(toolGroupId);

      toolGroup.addTool(LengthTool.toolName);
      toolGroup.setToolPassive(LengthTool.toolName);

      toolGroup.addTool(RectangleROITool.toolName);
      toolGroup.setToolPassive(RectangleROITool.toolName);

      console.log(SplineROITool.SplineTypes.Linear);

      toolGroup.addTool(SplineROITool.toolName,{
        getTextLines:()=>{},
        // spline:{
        //   type:SplineROITool.SplineTypes.Linear
        // }
      });
      // toolGroup.setToolConfiguration()
      // toolGroup.setToolEnabled(SplineROITool.toolName)
      toolGroup.setToolEnabled(SplineROITool.toolName);

      // toolGroup.setToolActive(SplineROITool.toolName,{
      //     bindings: [
      //     {
      //       mouseButton: MouseBindings.Primary,
      //     },
      //   ],
      // })


      return toolGroup;
    },

    async addKeyPoints  ({ state, rootState, dispatch, commit }, { contours })  {
      const sortedContours = contours.map(sortPoints);

      // console.log("sortedContours",sortedContours);
      const imageId = state.view.imageId
      sortedContours.forEach((points) => {
        const worldPoints = points.map(point=>utilities.imageToWorldCoords(imageId,point))
      SplineROITool.hydrate(viewportId, worldPoints,{splineType:SplineROITool.SplineTypes.Linear});

    })
    },
    onlyShow({state}){
      const toolGroup = state.view.toolGroup
      //  const toolGroup = cornerstoneTools.ToolGroupManager.getToolGroup(toolGroupId)
       console.log(toolGroup);
       const mode = toolGroup.toolOptions.SplineROI.mode
       console.log(mode);

       if(mode == 'Enabled'){
        toolGroup.setToolPassive(SplineROITool.toolName)

       }else if(mode == "Passive"){
        toolGroup.setToolEnabled(SplineROITool.toolName)

       }



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
