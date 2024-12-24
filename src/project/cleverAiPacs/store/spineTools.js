
import * as cornerstoneTools from '@cornerstonejs/tools';
const {ToolGroupManager,annotation, LengthTool,PanTool,  RectangleROITool, ZoomTool,SplineROITool ,CobbAngleTool} = cornerstoneTools;
const { MouseBindings } = cornerstoneTools.Enums;
import { RenderingEngine ,Enums,utilities,metaData,  getRenderingEngine} from '@cornerstonejs/core';
import {CircularMagnifyTool} from "@/picComps/picDiagnose/menudata/spine/toolClass"
import mutations from '@common/store/mutations';




export default {
  state:{
    toolsState:{
      // window:{show:true,active:false,windowWidth:null,windowCenter:null},
      panTool:{show:true,active:false},
      magnifyTool:{show:false,active:false},
      activeBboxTool:{show:true,active:false},
      activeCobbTool:{show:true,active:false},
      zoomTool:{show:true,active:false},
      invert:{show:true,active:false}
    },
    testdata:0,
  },

  mutations:{
    TEST_COMMIT(state){
      state.testdata = state.testdata +1
    },
    CHANGE_TOOL_STATE(state,{tool,value}){
      state.toolsState[tool].active = value
    },
    UPDATE_WINDOW_WIDTH(state,value){
      state.toolsState['window'].windowWidth = value
    },
    UPDATE_WINDOW_CENTER(state,value){
      state.toolsState['window'].windowCenter = value
    },

    // RESET_TOOL_STATE(state){
    //   state.toolsState = {
    //     panTool:{show:true,active:false},
    //     magnifyTool:{show:false,active:false},
    //     activeBboxTool:{show:true,active:false},
    //     activeCobbTool:{show:true,active:false},
    //     zoomTool:{show:true,active:false},
    //     invert:{show:true,active:false}

    //   }
    // }
  },
  namespaced: true,
  actions: {
    // UpdateColorWindow({dispatch},value){
    //   console.log("UpdateWindowWidth");
    //   dispatch("UpdateWindowWidth",value)

    // },
    // UpdateColorLevel({dispatch},value){
    //   console.log("UpdateWindowCenter");
    //   dispatch("UpdateWindowCenter",value)

    // },


    UpdateWindowCenter({state, commit,rootState,dispatch}, value) {
      const {spineViewStore} = rootState
      const {viewportId,renderingEngineId,renderer,imageId} =  spineViewStore.view
      const {windowCenter,windowWidth} = spineViewStore.allViewData

      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      )
        const WC =  value
        const WW = windowWidth

        viewport.setProperties({ voiRange: { upper: WC + WW / 2, lower: WC - WW / 2 } });
        // commit("UPDATE_WINDOW_CENTER",value);
        dispatch("spineViewStore/SetAllViewData", {
          key: "colorLevel",
          value: value,
        },{root:true});



      viewport.render();

    },

    UpdateWindowWidth({state, commit,rootState,dispatch}, value) {
      const {spineViewStore} = rootState
      const {viewportId,renderingEngineId,imageId} =  spineViewStore.view
      const {windowCenter,windowWidth} = spineViewStore.allViewData

      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      )


        const WC =  windowCenter
        const WW = value

        viewport.setProperties({ voiRange: { upper: WC + WW / 2, lower: WC - WW / 2 } });
        // commit("UPDATE_WINDOW_WIDTH",value);
        dispatch("spineViewStore/SetAllViewData", {
          key: "colorWindow",
          value: value,
        },{root:true});


      viewport.render();

    },

    async ChangeSlider({dispatch}, {viewIndex, pageIndex}) {

    },


    invertView({commit, state,rootState,rootGetters,dispatch}, viewIndex) {
      const {spineViewStore} = rootState
      const {viewportId,renderingEngineId} =spineViewStore.view
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      )
      const invertState = state.toolsState['invert'].active
      commit("CHANGE_TOOL_STATE",{tool:'invert',value:!invertState})

      viewport.setProperties({ invert:!invertState,});

      viewport.render()

    },


    FlipHorizontal({commit, dispatch, state}, viewIndex) {

    },


    FlipVertical({commit, dispatch, state}, viewIndex) {

    },

    RotateCamera({commit, dispatch, state, rootGetters}, viewIndex) {

    },
 // 改变平移
 async ChangePan({dispatch, state, commit,rootState }) {
  const {spineViewStore} = rootState

  const {viewportId,renderingEngineId,imageId,toolGroup} = spineViewStore.view

  const renderingEngine = getRenderingEngine(renderingEngineId);
  const viewport = renderingEngine.getViewport(
    viewportId
  )


  const PanToolInstance = toolGroup.toolOptions[PanTool.toolName]


  if(PanToolInstance?.mode == 'Active'){
    commit("CHANGE_TOOL_STATE",{tool:'panTool',value:false})

     toolGroup.setToolPassive(PanTool.toolName);
     viewport.element.style.cursor = 'default'
    // await dispatch("spineViewStore/setPositionCenter",null,{root:true})

  }else{
    // dispatch("zoomView")
    commit("CHANGE_TOOL_STATE",{tool:'zoomTool',value:false})

    //  toolGroup.setToolPassive(ZoomTool.toolName);

    commit("CHANGE_TOOL_STATE",{tool:'panTool',value:true})

    // toolGroup.setToolPassive(CircularMagnifyTool.toolName);
    // await dispatch("magnifyView")

    // toolGroup.setToolEnabled(SplineROITool.toolName);
    // toolGroup.setToolEnabled(CobbAngleTool.toolName);


    toolGroup.setToolActive(PanTool.toolName, {
      bindings: [
            {
              mouseButton: MouseBindings.Primary,
            },
          ],
    });

  }

}

,
async zoomView({state,commit,rootState,dispatch}){
  const {spineViewStore} = rootState

  const {viewportId,renderingEngineId,imageId,toolGroup} = spineViewStore.view
  const renderingEngine = getRenderingEngine(renderingEngineId);
  const viewport = renderingEngine.getViewport(
    viewportId
  )

  const ZoomToolInstance = toolGroup.toolOptions[ZoomTool.toolName]
  if(ZoomToolInstance?.mode == 'Active'){
    commit("CHANGE_TOOL_STATE",{tool:'zoomTool',value:false})

     toolGroup.setToolPassive(ZoomTool.toolName);
     viewport.element.style.cursor = 'default'
    // await dispatch("spineViewStore/setPositionCenter",null,{root:true})

  }else{
    // dispatch("changePan")
    commit("CHANGE_TOOL_STATE",{tool:'panTool',value:false})

    // toolGroup.setToolPassive(PanTool.toolName);
    commit("CHANGE_TOOL_STATE",{tool:'zoomTool',value:true})

    toolGroup.setToolActive(ZoomTool.toolName, {
      bindings: [
            {
              mouseButton: MouseBindings.Primary,
            },
          ],
    });

  }

},
editBbox({rootState,commit}){
  console.log("editBbox");

  const {spineViewStore} = rootState

  const {toolGroup} = spineViewStore.view

  const selectedAnnotations = annotation.selection.getAnnotationsSelected()
  console.log(selectedAnnotations);
  selectedAnnotations.forEach(item=>{
    annotation.selection.deselectAnnotation(item)
  })

   const SplineROIToolInstance = toolGroup.toolOptions[SplineROITool.toolName]


   if(SplineROIToolInstance?.mode == 'Enabled'){
    commit("CHANGE_TOOL_STATE",{tool:'activeBboxTool',value:true})
    // toolGroup.setToolPassive(PanTool.toolName);
    // toolGroup.setToolEnabled(CobbAngleTool.toolName);
    // toolGroup.setToolPassive(CircularMagnifyTool.toolName);

    toolGroup.setToolPassive(SplineROITool.toolName)

   }else if(SplineROIToolInstance?.mode == "Passive"){
    commit("CHANGE_TOOL_STATE",{tool:'activeBboxTool',value:false})

    toolGroup.setToolEnabled(SplineROITool.toolName)

   }
},
editCobb({state,rootState ,commit}){
  console.log("editCobb");

  const {spineViewStore} = rootState

  const {toolGroup} = spineViewStore.view

  const selectedAnnotations = annotation.selection.getAnnotationsSelected()
  console.log(selectedAnnotations);
  selectedAnnotations.forEach(item=>{
    annotation.selection.deselectAnnotation(item)
  })
  const CobbAngleToolInstance = toolGroup.toolOptions[CobbAngleTool.toolName]

   if(CobbAngleToolInstance?.mode == 'Enabled' ||CobbAngleToolInstance.mode == 'Disabled'){
    commit("CHANGE_TOOL_STATE",{tool:'activeCobbTool',value:true})
    // toolGroup.setToolPassive(PanTool.toolName);
    // toolGroup.setToolEnabled(SplineROITool.toolName);
    // toolGroup.setToolPassive(CircularMagnifyTool.toolName);

    toolGroup.setToolPassive(CobbAngleTool.toolName,{
      bindings: [
        {
          mouseButton: MouseBindings.Primary,
        },
      ],
    })

   }else if(CobbAngleToolInstance?.mode == "Passive"){
    commit("CHANGE_TOOL_STATE",{tool:'activeCobbTool',value:false})

    toolGroup.setToolEnabled(CobbAngleTool.toolName)

   }
},
// magnifyView({rootState}){
//   console.log("magnifyView");

//     const {spineViewStore} = rootState

//   const {viewportId,renderer,imageId,toolGroup} = spineViewStore.view

//   const viewport =  renderer.getViewport(viewportId);


//   const MagnifyToolInstance = toolGroup.getToolInstance(MagnifyTool.toolName)
//   console.log("MagnifyToolInstance",MagnifyToolInstance);
//   MagnifyToolInstance.setConfiguration({
//     magnifySize: 10, // parallel scale , higher more zoom
//     magnifyWidth: 200, //px
//     magnifyHeight: 200, //px
//   })

//   if(MagnifyToolInstance.mode == 'Active'){
//      toolGroup.setToolPassive(MagnifyTool.toolName);
//      viewport.element.style.cursor = 'default'

//     //  await dispatch("spineViewStore/setPositionCenter",null,{root:true})

//   }else{
//     toolGroup.setToolPassive(PanTool.toolName);

//     toolGroup.setToolActive(MagnifyTool.toolName, {
//       bindings: [
//             {
//               mouseButton: MouseBindings.Primary,
//             },
//           ],
//     });

//   }

// },
async magnifyView({rootState,commit,dispatch}){
  console.log("magnifyView");

    const {spineViewStore} = rootState

  const {viewportId,renderingEngineId,toolGroupId,imageId} = spineViewStore.view
  const renderingEngine = getRenderingEngine(renderingEngineId);
  const viewport = renderingEngine.getViewport(
    viewportId
  )

  const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
  console.log("toolGroup",toolGroup);


  const MagnifyToolInstance = toolGroup.toolOptions[CircularMagnifyTool.toolName]

  console.log("MagnifyToolInstance",MagnifyToolInstance);

  // MagnifyToolInstance.setConfiguration({
  //   magnifySize: 10, // parallel scale , higher more zoom
  //   magnifyWidth: 200, //px
  //   magnifyHeight: 200, //px
  // })

  if(MagnifyToolInstance?.mode == 'Active'){
    console.log(MagnifyToolInstance.mode);

     toolGroup.setToolPassive(CircularMagnifyTool.toolName);
     viewport.element.style.cursor = 'default'


    //  await dispatch("spineViewStore/setPositionCenter",null,{root:true})
    // commit("CHANGE_TOOL_STATE",{tool:'magnifyTool',value:false})

  }else{
    // commit("CHANGE_TOOL_STATE",{tool:'magnifyTool',value:true})

    // toolGroup.setToolPassive(PanTool.toolName);
    // await dispatch("ChangePan")
    // toolGroup.setToolEnabled(SplineROITool.toolName);
    // toolGroup.setToolEnabled(CobbAngleTool.toolName);



    toolGroup.setToolActive(CircularMagnifyTool.toolName, {
      bindings: [
            {
              mouseButton: MouseBindings.Primary,
              // action: debounce(CircularMagnifyTool.action, 100),
            },
          ],
    })
        // commit("CHANGE_TOOL_STATE",{tool:'magnifyTool',value:true})


  }

},
changetoolState({state,commit}){
  // console.log(state.toolsState['magnifyTool'].active);

  // commit("CHANGE_TOOL_STATE",{tool:'magnifyTool',value:!state.toolsState['magnifyTool'].active})

  // commit("TEST_COMMIT")

},



addAngleWidget({state,rootState,commit,dispatch}){


},
hiddenAngle({rootState,dispatch}){


},
resetView({dispatch}){

       dispatch("spineViewStore/resetView",null,{root:true})

}
,

setupCamera({commit, state,rootState,rootGetters,dispatch}, viewIndex){

},

    resizeSliceView({dispatch, state, getters, commit,rootState}) {

    },
    resizeCamera({state,dispatch,rootGetters}){

    },
    beforeViewDestory({state,commit,dispatch}){


    }
  },
};
