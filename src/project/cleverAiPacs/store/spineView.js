import dicomParser from "dicom-parser";
import { dicomTagDescriptions } from "@/assets/js/utils/dicom/tagCode";

import Vue from 'vue';
import * as cornerstone from '@cornerstonejs/core';
import { RenderingEngine ,Enums,utilities,metaData,getRenderingEngine  } from '@cornerstonejs/core';
// import { Types } from '@cornerstonejs/core';

import * as cornerstoneTools from '@cornerstonejs/tools';
const { ViewportType,MetadataModules } = Enums;
const {Events} = cornerstoneTools.Enums
const { MouseBindings } = cornerstoneTools.Enums;
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
const {annotation,ToolGroupManager,LengthTool,PanTool,ZoomTool,ProbeTool,DragProbeTool,SplineROITool, RectangleROITool ,AngleTool,CobbAngleTool} = cornerstoneTools;
import { PointInfoTool,TextLabelTool,CircularMagnifyTool, } from "@/picComps/picDiagnose/menudata/spine/toolClass"

const {drawTextBox} = cornerstoneTools.drawing
const { transformWorldToIndex } = utilities;

cornerstone.init();
cornerstoneTools.init();
cornerstoneDICOMImageLoader.init();
cornerstone.imageLoader.registerImageLoader('wadouri', cornerstoneDICOMImageLoader.wadouri.loadImage);


console.log(cornerstoneTools);
console.log(cornerstone);

cornerstoneTools.addTool(LengthTool)
cornerstoneTools.addTool(SplineROITool,{
  // handleRadius: 1
})
cornerstoneTools.addTool(RectangleROITool)
cornerstoneTools.addTool(PanTool)
cornerstoneTools.addTool(AngleTool)
cornerstoneTools.addTool(CobbAngleTool)
cornerstoneTools.addTool(ZoomTool)
cornerstoneTools.addTool(DragProbeTool)
cornerstoneTools.addTool(ProbeTool)
cornerstoneTools.addTool(PointInfoTool)
cornerstoneTools.addTool(TextLabelTool)
cornerstoneTools.addTool(CircularMagnifyTool)

import {AllViewData} from './data';
import {xhr_getSpineInfo,xhr_getDicomImage} from "@/api";
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

const pointsCenter = (pointsArray) => {
  const center = pointsArray.reduce(
    (acc, [x, y]) => [acc[0] + x, acc[1] + y],
    [0, 0]
  ).map((sum) => sum / pointsArray.length);

  return center;
};

const getAngleDirection = (points)=>{
  if (points.length !== 3) {
    throw new Error("需要传入三个点的数组！");
  }

  const [A, B, C] = points;
  let angleDir = [0,0]

  // 计算向量 AB 和 BC 的叉积
  const parallel  = (A[0] - B[0]) * (C[1] - B[1]) - (A[1] - B[1]) * (C[0] - B[0]);
  if (parallel > 0) {
    angleDir[0] = 1
  } else if (parallel < 0) {
    angleDir[0] = -1.1
  }

  const vertical  = (B[0] - A[0]) * (C[1] - B[1]) - (B[1] - A[1]) * (C[0] - B[0]);
  if (vertical > 0) {
    angleDir[1] = 0.5
  } else if (vertical < 0) {
    angleDir[1] = -1
  }


  return angleDir
}

const calculateLength = (imageId,pos1, pos2) => {
 const worldpos1 =  utilities.imageToWorldCoords(imageId,pos1)
 const worldpos2 =  utilities.imageToWorldCoords(imageId,pos2)

  const dx = worldpos1[0] - worldpos2[0];
  const dy = worldpos1[1] - worldpos2[1];
  const dz = worldpos1[2] - worldpos2[2];

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export default {
  namespaced: true,
  state: {
    selectedCobbId:null,
    caseInfo: {
    },
    spineInfo:{

    },
    view:{
    },
    allViewData: {
      hu:'',
      reversed:false,
      cameraRotate:0 ,
      scaleLength: null,
      cobb:0,

      pan:false,
      magnify:false

    },

  },

  mutations: {
    SET_CASE_INFO(state, info) {
      state.caseInfo = info;
    },
    SET_CASE_INFO_ITEM(state, {key,value}) {
      state.caseInfo[key] = value;
    },
    SET_SPINE_INFO(state, info) {
      state.spineInfo = info;
    },
    SET_SPINE_INFO_ITEM(state, {key,value}) {
      state.spineInfo[key] = value;
    },
    SET_SELECTED_COBB(state,id){
      const cobb = state.spineInfo.angleList.find(item=>item.id==id)
      cobb.checked = !cobb.checked
      // state.selectedCobbId = id
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
    INIT_ALL_VIEW_DATA(state){
      const originalData = new AllViewData();
      originalData.layOut = null;
      originalData.buttons = [ButtonNames.Ckcw, ButtonNames.Jbinfo,ButtonNames.Pyms,ButtonNames.Zoom,ButtonNames.Reset,ButtonNames.Invert,ButtonNames.EditBbox,ButtonNames.EditCobb ];

      originalData.activeButtons = [ButtonNames.Jbinfo,]
      state.allViewData = {...state.allViewData,...originalData}
    },

  },
  actions: {
    async InitView(
      {dispatch, commit, state},
      element
    ) {
      const viewportId = "spineViewPort"
      const toolGroupId = "toolGroup"
      const renderingEngineId = "myRenderingEngine"

      // const renderingEngine = new RenderingEngine(renderingEngineId);
      const renderingEngine = new RenderingEngine(renderingEngineId);
      const toolGroup = await dispatch("initializeToolGroup",toolGroupId)

      const viewportInput = {
        viewportId ,
        element,
        type: ViewportType.STACK,
        defaultOptions: {
          background: VIEW_COLORS.BACKGROUND,
        },
      };

      renderingEngine.enableElement(viewportInput);
      toolGroup.addViewport(viewportId, renderingEngineId);

      element.addEventListener( Events.MOUSE_MOVE, (event)=>{
        const viewport = renderingEngine.getViewport(viewportId)
        const image = viewport?.getImageData()
        if(image){
          const {voxelManager,imageData} = image

          const worldPos = event.detail.currentPoints.world
          let ijk = transformWorldToIndex(imageData,worldPos);
          let value = voxelManager.getAtIJKPoint(ijk);
          commit("SET_ALL_VIEW_STATE",{key:"hu",value})

        }

      }
      );

      const view = {
        viewportId,
        renderingEngineId,
        toolGroupId
      }
      commit("SET_VIEW",view)

      commit("SET_VIEW_ITEM",{key:"toolGroup",value:toolGroup})
      commit("INIT_ALL_VIEW_DATA")
      const {allViewData} = state


      // const buttons = [ButtonNames.Layout, ButtonNames.Ckcw, ButtonNames.Jbinfo, ButtonNames.Szckx, ButtonNames.Pyms, ButtonNames.Bcj];
      // const activeButtons = [ButtonNames.Jbinfo ]

       dispatch("toolBarStore/initButtonState",{showButtons: allViewData.buttons ,activeButtons:allViewData.activeButtons} ,{root:true})

      // commit('SET_VIEW_ITEM', {key:"renderer",value:renderingEngine});

    },
    async addMyFavorite({commit},myFavorite){
      commit("SET_CASE_INFO_ITEM",{key:'myFavorite',value:myFavorite})
    },
   async  InitCaseInfo({state,commit,dispatch},info){
      commit("SET_CASE_INFO",info)
      const {instanceMetadataList,computeSeriesId} = info
       if(instanceMetadataList?.length > 0 ){
        const instanceId =  instanceMetadataList[0].instanceId
        try {
          const resfile = await xhr_getDicomImage({
            instanceId,
          });
          if (resfile) {
            const file = new File([resfile.data], "image.dcm" );
            const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);

            await dispatch("UpdateSlice",{imageId})


            const  resinfo = await  xhr_getSpineInfo({computeSeriesId})
            if(resinfo){

              const spineInfo = resinfo.data.resultData.data
              const {pixelSpacing} = metaData.get(MetadataModules.IMAGE_PLANE, imageId);

              // 这一块后续要改，太奇怪了
              const {  windowCenter , windowWidth} = metaData.get( MetadataModules.VOI_LUT , imageId);

              const WC =  windowCenter[0]
              const WW = windowWidth[0]


              dispatch("spineToolsStore/UpdateWindowWidth",WW,{root:true})
              dispatch("spineToolsStore/UpdateWindowCenter",WC,{root:true})

              const { angle,beginpnt1, beginpnt2, endpnt1, endpnt2, keypoints, boxes, keypnts,dist,horangle,maxind,cobbID,closepnt,SeccobbID,SecAngle,SecDist,Secclosepnt } = spineInfo


              const pixelSpacingX = pixelSpacing[0] || 1
              // const vertebralOffset = pixelSpacingX *dist
              spineInfo.trueDist = pixelSpacingX *dist.toFixed(2)
              spineInfo.clavicleHorangle = horangle.toFixed(2)
              const cobbAngle1 = angle.mt.angle.toFixed(2)


              const boneCodes =   ['C7','T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12','L1','L2','L3','L4','L5','L6']

              const sortedContours = keypoints.map((item,index)=>{return {id:index,boneCode:boneCodes[index],bbox:sortPoints(item)}});
              spineInfo.sortedContours = sortedContours
              // await dispatch("addBoneBboxs",{bones: sortedContours})

              // await dispatch("addCobb",{cobbPoints: [beginpnt1, endpnt1, beginpnt2, endpnt2] })

              const firstBone = sortedContours[0]
              const midLine = [pointsCenter([firstBone.bbox[0],firstBone.bbox[1]]),keypnts[2]]
              await dispatch("addLine",{linePoints:midLine })

              const midLine2 = sortedContours.map(bone=>pointsCenter(bone.bbox))
              await dispatch("addLine",{linePoints:midLine2,options:{color:'grey'}})
              // await dispatch("addLine",{linePoints:midLine2,options:{color:'yellow'}})


              const maxindBone = sortedContours[cobbID[1]]
              const maxindBoneCenter = pointsCenter(maxindBone.bbox)

              const fastLine = [maxindBoneCenter,closepnt]
              // await dispatch("addLength",{linePoints:fastLine,options:{color:'red'}})

              let boneList1 = []

              cobbID.forEach(async eachId=>{
                const bone = sortedContours[eachId]
                boneList1.push(bone)
                // await dispatch("addPointInfo",{point:pointsCenter(bone.bbox),pointLabel:bone.boneCode })
              })
              let  vertebralOffset1 = calculateLength(imageId,maxindBoneCenter,closepnt)
              vertebralOffset1 = vertebralOffset1.toFixed(2)
              const boneLine1 = sortedContours.slice(boneList1[0].id,boneList1[2].id+1).map(bone=>pointsCenter(bone.bbox))


              spineInfo.angleList = [
                {
                  checked:false,
                  cobb:cobbAngle1,
                  boneList:boneList1.sort((a, b) => a.id - b.id),
                  boneLine:boneLine1,
                  firstBone:boneList1[0].id,
                  fastLine:fastLine,
                  vertebralOffset:vertebralOffset1,
                  pointColor :'yellow',
                  lineColor:'red',
                  lengthColor:'red'
                },
              ]
              if(SeccobbID && SeccobbID[0] != -1){
                spineInfo.sShape = true;

                const cobbAngle2 = SecAngle.toFixed(2)
                let boneList2 = []

                SeccobbID.forEach(async eachId=>{
                  const bone = sortedContours[eachId]
                  boneList2.push(bone)
                  // await dispatch("addPointInfo",{point:pointsCenter(bone.bbox),pointLabel:bone.boneCode,options:{color:'green'} })
                })
                const maxindBone2 = sortedContours[SeccobbID[1]]
                const maxindBoneCenter2 = pointsCenter(maxindBone2.bbox)

                const fastLine2 = [maxindBoneCenter2,Secclosepnt]

                let vertebralOffset2 = calculateLength(imageId,maxindBoneCenter2,Secclosepnt)
                vertebralOffset2 = vertebralOffset2.toFixed(2)
                const boneLine2 = sortedContours.slice(boneList2[0].id,boneList2[2].id+1).map(bone=>pointsCenter(bone.bbox))

              const anglePoint2 = getAngleDirection(boneList2.map(bone=>pointsCenter(bone.bbox)))
                spineInfo.angleList.push({
                  checked:false,
                  cobb:cobbAngle2,
                  fastLine:fastLine2,
                  boneLine:boneLine2,
                  boneList:boneList2.sort((a, b) => a.id - b.id),
                  firstBone:boneList2[0].id,
                  vertebralOffset:vertebralOffset2,
                  pointColor :'yellow',
                  lineColor:'blue',
                  lengthColor:'blue'
                })
              }

                spineInfo.angleList.forEach(item=>{
                  const boneList =  item.boneList.map(bone=>pointsCenter(bone.bbox))
                  const angleMidBone = boneList[1]
                  const direction1 = getAngleDirection(boneList)
                  let  anglePoint  =  [angleMidBone[0]+500*direction1[0],angleMidBone[1]+100*direction1[1]]

                  item.anglePoint = anglePoint


                })

              spineInfo.sShapeLabel = spineInfo.sShape? 'S形':'C形'
              spineInfo.angleList = spineInfo.angleList.sort((a, b) => a.firstBone - b.firstBone).map((item, index) => {
                return { ...item, id: index }; // 根据排序后的索引赋值 id
              });

              commit("SET_SPINE_INFO",spineInfo)
              spineInfo.angleList.forEach(cobb=>{
                dispatch("setSelectedCobb",cobb.id)
              })
               dispatch("UpdateCobb")

              // dispatch("selectCobb",{cobbId:spineInfo.angleList[0].id,pointColor:'red',lineColor:'pink',lengthColor:'pink'})
              // dispatch("selectCobb",{cobbId:spineInfo.angleList[1].id,pointColor:'green',lineColor:'blue',lengthColor:'blue'})

            }
          } else {
            console.error("Request failed: No data returned");
          }

        } catch (error) {
          console.error("Request failed:", error);
        }

      }


    },
    async  removeCobb({state,commit,dispatch},cobbId){
      let annotations = annotation.state.getAllAnnotations();

      const filterAnno = annotations.filter(anno=>{
        return anno.metadata.type == 'selectedCobb'&& anno.metadata.cobbId == cobbId
      })
      const annos = filterAnno.map(anno=>anno.annotationUID)
      annos.forEach(anno=>{
        annotation.state.removeAnnotation(anno)

      })

    },
    async selectCobb({state,commit,dispatch},{cobbId,pointColor,lineColor,lengthColor}){
      const cobb = state.spineInfo.angleList.find(item=>item.id==cobbId)

      await dispatch("addLength",{linePoints:cobb.fastLine,options:{color:lengthColor||'yellow',type:'selectedCobb' ,cobbId}})
      await dispatch("addLine",{linePoints:cobb.boneLine,options:{color:lineColor||'yellow',type:'selectedCobb',cobbId,lineWidth:3}})

      cobb.boneList.forEach(async keyBone=>{
        const bone = state.spineInfo.sortedContours[keyBone.id]
        await dispatch("addPointInfo",{point:pointsCenter(bone.bbox),pointLabel:bone.boneCode,options:{color:pointColor||'red',type:'selectedCobb',cobbId} })
      })

      await dispatch("addTextLabel",{point:cobb.anglePoint,pointLabel:cobb.cobb+'°',options:{color: 'white', cobbId} })


    },
    async setSelectedCobb({state,commit,dispatch},cobbId){
      commit("SET_SELECTED_COBB",cobbId)

    },
    async UpdateCobb({state,commit,dispatch}){

      // const cobb = state.spineInfo.angleList.find(item=>item.id==id)

      state.spineInfo.angleList.map(cobb=>{
        if(cobb.checked){
          dispatch("selectCobb",{cobbId:cobb.id,pointColor:cobb.pointColor,lineColor:cobb.lineColor,lengthColor:cobb.lengthColor})
        }else{

          dispatch("removeCobb",cobb.id)
        }
      })

      const {viewportId,renderingEngineId} = state.view

      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      )

      cornerstoneTools.utilities.triggerAnnotationRenderForViewportIds([
        viewportId
      ]);
      viewport.render()
    },

    InitViewData({state,dispatch,commit}){
      // commit("INIT_ALL_VIEW_DATA")

    },
    SetAllViewData({commit},{ key,value }){
      commit("SET_ALL_VIEW_STATE",{ key,value })
    },

    async UpdateSlice({dispatch, state,commit},{imageId}) {

      const imageIds = [imageId];
      const {viewportId,renderingEngineId} = state.view
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      )
      //  const image =await  cornerstone.imageLoader.loadImage(imageId)
      //   console.log(image);
      //   viewport.renderImageObject(image)

      await viewport.setStack(imageIds);
      commit("SET_VIEW_ITEM",{key:"imageId",value:imageId})

      const {pixelSpacing,sliceThickness,frameOfReferenceUID,rows,columns,sliceLocation,imagePositionPatient } = metaData.get(MetadataModules.IMAGE_PLANE, imageId);
      const {  windowCenter , windowWidth} = metaData.get( MetadataModules.VOI_LUT , imageId);

        metaData.addProvider((type)=>{
          if (type === MetadataModules.IMAGE_PLANE    ) {
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

        dispatch("resetView")
        commit("INIT_ALL_VIEW_DATA")

        // 这一块后续要改，太奇怪了
        const WC =  windowCenter[0]
        const WW = windowWidth[0]

        commit("SET_ALL_VIEW_STATE",{key:'windowWidth',value:WW})
        commit("SET_ALL_VIEW_STATE",{key:'windowCenter',value:WC})


        // dispatch("spineToolsStore/UpdateWindowWidth",WW,{root:true})
        // dispatch("spineToolsStore/UpdatewindowCenter",WC,{root:true})


        viewport.setProperties({ voiRange: { upper: WC + WW / 2, lower: WC - WW / 2 } });
        viewport.render()

        // dispatch("spineToolsStore/UpdateWindowWidth",WW,{root:true})
    // dispatch("spineToolsStore/UpdateWindowCenter",WC,{root:true})


      // dispatch("spineToolsStore/UpdatewindowWidth",windowWidth[0],{root:true})
      // dispatch("spineToolsStore/UpdatewindowCenter",windowCenter[0],{root:true})
      const { allViewData } = state

      // dispatch("toolBarStore/initButtonState",{showButtons: allViewData.buttons ,activeButtons:allViewData.activeButtons} ,{root:true})



    },
    async resizeView({state,dispatch}){
      const {viewportId,renderingEngineId} =state.view
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      )

      if (renderingEngine) {
        const presentation = viewport.getViewPresentation()
        renderingEngine.resize(true, false);  //重置canvas
        viewport.setViewPresentation(presentation);
      }

    },

    async resetView({state,dispatch}){
      const {viewportId,renderingEngineId} =state.view
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      )

      renderingEngine.resize(true, false);
      const displayArea  =  await dispatch("createDisplayArea",{size:1,pointValue:0.5})

      viewport.setOptions(displayArea);
      viewport.setProperties(displayArea);
      viewport.render();
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
        invert:false,
        displayArea: {
          imageArea: Array.isArray(size) ? size : [size, size],
          imageCanvasPoint: {
            imagePoint,
            canvasPoint,
          },
        },
      };
    },

    async getAnnotationInfo({state,dispatch}){
      console.log( "cornerstone",cornerstone);
      console.log( "cornerstone.metaData",metaData);

      console.log("cornerstone.utilities",utilities);

      console.log("cornerstoneTools",cornerstoneTools);

      console.log( "annotation",annotation);

      console.log( "annotation.state",annotation.state);
      console.log("allAnnotations",annotation.state.getAllAnnotations());
      console.log(annotation.config);

      console.log(annotation.selection.getAnnotationsSelected());
      const {toolGroup} = state.view
      console.log("toolGroup",toolGroup);

      const {viewportId,renderingEngineId,imageId} = state.view

      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      )
      console.log(viewport);

      const styles = {
        color: 'rgb(255, 0, 0)',
    };
    // 对某个注释配置API
    const anno = annotation.state.getAllAnnotations()[0]
    console.log(anno);
    let annotations = annotation.state.getAnnotations(LengthTool.toolName, viewport.element);

    console.log("annotations",annotations);

    console.log(anno.annotationUID, styles);

    },

    initializeToolGroup({state},toolGroupId){

      const preToolGroup = cornerstoneTools.ToolGroupManager.getToolGroup(toolGroupId);

      if (preToolGroup) {
        return preToolGroup;
      }

      const toolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(toolGroupId);

      toolGroup.addTool(ZoomTool.toolName)
      toolGroup.addTool(AngleTool.toolName)
      toolGroup.addTool(CobbAngleTool.toolName)
      toolGroup.addTool(PanTool.toolName);
      toolGroup.addTool(DragProbeTool.toolName)

      toolGroup.addTool(SplineROITool.toolName,{
        getTextLines:()=>{},


       });
      toolGroup.addTool(LengthTool.toolName,{
        // getTextLines:()=>{}
      })

      toolGroup.addTool(PointInfoTool.toolName,{
        getTextLines:(data, targetId)=>{
          const {pointLabel} = data
          const textLines = [];
          textLines.push(pointLabel)
          return textLines;
        }
      })
      toolGroup.addTool(TextLabelTool.toolName,{
        getTextLines:(data, targetId)=>{
          const {pointLabel} = data
          const textLines = [];
          textLines.push(pointLabel)
          return textLines;
        }
      })

      toolGroup.addTool(CircularMagnifyTool.toolName)

      toolGroup.setToolEnabled(SplineROITool.toolName);
      toolGroup.setToolEnabled(CobbAngleTool.toolName);
      toolGroup.setToolEnabled(PointInfoTool.toolName);
      toolGroup.setToolEnabled(TextLabelTool.toolName);
      toolGroup.setToolEnabled(LengthTool.toolName);

      // toolGroup.setToolEnabled(AngleTool.toolName)

      // toolGroup.setToolActive(CircularMagnifyTool.toolName, {
      //   bindings: [
      //         {
      //           mouseButton: MouseBindings.Primary,
      //         },
      //       ],
      // });

      // toolGroup.setToolActive(ZoomTool.toolName, {
      //   bindings: [
      //         {
      //           mouseButton: MouseBindings.Primary,
      //         },
      //       ],
      // });
        // toolGroup.setToolActive(ZoomTool.toolName, {
        //   bindings: [
        //     {
        //       mouseButton: MouseBindings.Wheel, // Wheel Mouse
        //     },
        //   ],
        // });

      // toolGroup.setToolActive(CobbAngleTool.toolName, {
      //   bindings: [
      //         {
      //           mouseButton: MouseBindings.Primary,
      //         },
      //       ],
      // });


      return toolGroup;
    },

    async addBoneBboxs  ({ state, rootState, dispatch, commit }, { bones })  {

      const {viewportId,renderingEngineId,imageId,toolGroup} = state.view

      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      )

      bones.forEach((bone) => {
        const worldPoints = bone.bbox.map(point=>utilities.imageToWorldCoords(imageId,point))
        dispatch("customDrawSpline",{points:[...worldPoints,worldPoints[0]]})
      })

      cornerstoneTools.utilities.triggerAnnotationRenderForViewportIds([
        viewportId
      ]);

    },
    async addLine({state,dispatch},{linePoints,options}){

      const {imageId,viewportId} = state.view
      const worldPoints = linePoints.map(point=>utilities.imageToWorldCoords(imageId,point))
      // LengthTool.hydrate(viewportId,worldPoints);
      const annotationUID = utilities.uuidv4()
      const styles = {
        color: options?.color||'rgb(255,255,255)',
        // lineWidth:(options?.lineWidth || 1 )+ 'px',

      };
      dispatch("customDrawSpline",{points:worldPoints,options:{annotationUID,...options}})
      annotation.config.style.setAnnotationStyles( annotationUID, styles);

    // viewport.render()
    },
    async addLength({state,dispatch},{linePoints,options}){
      const {imageId,viewportId} = state.view
      const worldPoints = linePoints.map(point=>utilities.imageToWorldCoords(imageId,point))
      // LengthTool.hydrate(viewportId,worldPoints);

      const annotationUID = utilities.uuidv4()
      const styles = {
        color: options?.color||'rgb(127, 255, 212)',
        textBoxColor:options?.color||'rgb(127, 255, 212)',
        // textBoxColor:'rgb(255, 0, 0)',
        // color: 'pink',
        // textBoxColor:'pink',
        shadow :false,
        lineWidth:(options?.lineWidth || 2) + 'px',
        textBoxShadow:false
        // lineDash:[5,5],//虚线
      };
      dispatch("customDrawLength",{points:worldPoints,options:{annotationUID,...options}})


      annotation.config.style.setAnnotationStyles( annotationUID, styles);
      // annotation.config.style.setDefaultToolStyles({
      //   shadow :false,
      //   // textBoxShow:false
      // })
      // console.log( annotation.config.style.getAnnotationStyle( annotationUID ));



    },

    async addPointInfo({state,dispatch},{point,pointLabel,options}){
      const {imageId,viewportId} = state.view
      const worldPoint  =  utilities.imageToWorldCoords(imageId,point)
      const annotationUID = utilities.uuidv4()
      const styles = {
        color: options?.color||'rgb(255, 0, 0)',
        textBoxColor: options?.color||'rgb(255, 0, 0)'
      };
      dispatch("customDrawPoint",{point:worldPoint,options:{annotationUID,pointLabel,...options }})


      annotation.config.style.setAnnotationStyles( annotationUID, styles);

    },

    async addTextLabel({state,dispatch},{point,pointLabel,options}){
      const {imageId,viewportId} = state.view
      const worldPoint  =  utilities.imageToWorldCoords(imageId,point)
      const annotationUID = utilities.uuidv4()
      const styles = {
        color: options?.color||'rgb(255, 0, 0)',
        textBoxFontSize:'80px',
        textBoxColor: options?.color||'rgb(255, 0, 0)',
       };
      dispatch("customDrawTextLabel",{point:worldPoint,options:{annotationUID,pointLabel,...options }})


      annotation.config.style.setAnnotationStyles( annotationUID, styles);
    },


    async addCobb({ state, rootState, dispatch, commit },{cobbPoints}){
      const {imageId,viewportId} = state.view
      const worldPoints = cobbPoints.map(point=>utilities.imageToWorldCoords(imageId,point))
      const annotationUID = utilities.uuidv4()

      dispatch("customDrawCobb",{points:worldPoints,options:{annotationUID }})
      const styles = {
        color: 'rgb(0, 255, 0)',
        textBoxColor:'rgb(0, 255, 0)'
      };
      annotation.config.style.setAnnotationStyles( annotationUID, styles);
      // cornerstoneTools.utilities.triggerAnnotationRenderForViewportIds([
      //   viewportId
      // ]);
    },
    customDrawPoint({state},{point,options}){
      const {imageId,viewportId,renderingEngineId} = state.view
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      )

      const FrameOfReferenceUID = viewport.getFrameOfReferenceUID();
      const { viewPlaneNormal, viewUp } = viewport.getCamera();
      const referencedImageId = state.view.imageId
      const annotationUID=options?.annotationUID || utilities.uuidv4()
      const newannotation = {
          annotationUID ,
          data: {
            pointLabel:options?.pointLabel || '',
            handles: {
                points:[point],
            },


          },
          highlighted: false,
          autoGenerated: false,
          invalidated: true,
          isLocked: false,
          isVisible: true,
          metadata: {
              toolName: PointInfoTool.toolName,
              viewPlaneNormal,
              FrameOfReferenceUID,
              referencedImageId,
              ...options
          },
      };

      annotation.state.addAnnotation(newannotation,viewport.element)
      const textUID = '0';
      const canvasCoordinates = viewport.worldToCanvas(point);
      const textCanvasCoordinates = [
        canvasCoordinates[0] + 2,
        canvasCoordinates[1] - 2,
      ];


    },

    customDrawTextLabel({state},{point,options}){
      const {imageId,viewportId,renderingEngineId} = state.view
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      )

      const FrameOfReferenceUID = viewport.getFrameOfReferenceUID();
      const { viewPlaneNormal, viewUp } = viewport.getCamera();
      const referencedImageId = state.view.imageId
      const annotationUID=options?.annotationUID || utilities.uuidv4()
      const newannotation = {
          annotationUID ,
          data: {
            pointLabel:options?.pointLabel || '',
            handles: {
                points:[point],
            },
          },
          highlighted: false,
          autoGenerated: false,
          invalidated: true,
          isLocked: false,
          isVisible: true,
          metadata: {
              toolName: TextLabelTool.toolName,
              viewPlaneNormal,
              FrameOfReferenceUID,
              referencedImageId,
              ...options
          },
      };

      annotation.state.addAnnotation(newannotation,viewport.element)


    },

    customDrawSpline({state},{points,options}){
      const {imageId,viewportId,renderingEngineId} = state.view
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      )
      const FrameOfReferenceUID = viewport.getFrameOfReferenceUID();
      const { viewPlaneNormal, viewUp } = viewport.getCamera();
      const instance = new SplineROITool();
      const referencedImageId = state.view.imageId

      const splineType = SplineROITool.SplineTypes.Linear;
      const splineConfig = instance._getSplineConfig(splineType);
      const SplineClass = splineConfig.Class;
      const splineInstance = new SplineClass();
      const canvasPoints = points.map((point) => viewport.worldToCanvas(point));
      splineInstance.setControlPoints(canvasPoints);
      const splinePolylineCanvas = splineInstance.getPolylinePoints();
      const splinePolylineWorld = splinePolylineCanvas.map((point) => viewport.canvasToWorld(point));
      const newannotation = {
          annotationUID:  options?.annotationUID || utilities.uuidv4(),
          data: {
              handles: {
                  activeHandleIndex:null,
                  points,
                  textBox:{

                  }
              },
              label: '',
              cachedStats: {},
              spline: {
                  type: splineType,
                  instance: splineInstance,
              },
              contour: {
                  closed: false,
                  polyline: splinePolylineWorld,
              },
          },
          highlighted: false,
          autoGenerated: false,
          invalidated: true,
          isLocked: false,
          isVisible: true,
          metadata: {
              toolName: SplineROITool.toolName,
              viewPlaneNormal,
              FrameOfReferenceUID,
              referencedImageId,
              ...options
          },
      };
      annotation.state.addAnnotation(newannotation,viewport.element)

    },
    customDrawLength({state},{points,options}){
      const {imageId,viewportId,renderingEngineId} = state.view
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      )

      const FrameOfReferenceUID = viewport.getFrameOfReferenceUID();
      const { viewPlaneNormal, viewUp } = viewport.getCamera();
      const instance = new LengthTool();
      const referencedImageId = state.view.imageId
      const newannotation = {
          annotationUID:  options?.annotationUID || utilities.uuidv4(),
          data: {
              handles: {
                  activeHandleIndex:null,
                  points,
              },
              // label: '',
              cachedStats: {},
          },
          highlighted: false,
          autoGenerated: false,
          invalidated: true,
          isLocked: false,
          isVisible: true,
          metadata: {
              toolName: LengthTool.toolName,
              viewPlaneNormal,
              FrameOfReferenceUID,
              referencedImageId,
              ...options
          },
      };

      annotation.state.addAnnotation(newannotation,viewport.element)

    },


    customDrawCobb({state},{points,options}){
      const {imageId,viewportId,renderingEngineId} = state.view
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      )

      const FrameOfReferenceUID = viewport.getFrameOfReferenceUID();
      const { viewPlaneNormal, viewUp } = viewport.getCamera();
      const instance = new CobbAngleTool();
      const referencedImageId = state.view.imageId

      const newannotation = {
          annotationUID:  options?.annotationUID || utilities.uuidv4(),
          data: {
              handles: {
                  activeHandleIndex:null,
                  points,
                  textBox:{
                    worldBoundingBox : {
                      topLeft: [0,0,0],
                      topRight:  [0,10,0],
                      bottomLeft: [10,0,0],
                      bottomRight: [10,10,0],
                    }
                  }
              },
              label: '',
              cachedStats: {},

          },
          highlighted: false,
          autoGenerated: false,
          invalidated: true,
          isLocked: false,
          isVisible: true,
          metadata: {
              toolName: CobbAngleTool.toolName,
              viewPlaneNormal,
              FrameOfReferenceUID,
              referencedImageId,
          },
      };
      annotation.state.addAnnotation(newannotation,viewport.element)
    },

    beforeViewDestory({state,commit,dispatch}){
      const {toolGroupId } = state.view
      console.log("beforeViewDestory");
      commit("SET_CASE_INFO",{})
      commit("SET_SPINE_INFO",{})
      cornerstoneTools.ToolGroupManager.destroyToolGroup(toolGroupId)

    },


  },
};
