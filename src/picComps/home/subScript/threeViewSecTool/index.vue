<template>
  <div class="threeViewSecTool">
    <slot></slot>
    <dicomTags :datav="dicomTags_msg"></dicomTags>
    <orientationTags :datav="orientationTags_msg"></orientationTags>
    <btnGroup :viewType="viewType" :TracheaName="TracheaName !== '' ? TracheaName : 'lung'"></btnGroup>
  </div>
</template>

<script lang="javascript">
import btnGroup from "./module/btn-group.vue";
import dicomTags from "./module/dicom-tags.vue";
import orientationTags from "./module/orientation-tags.vue";
export default {
  name: 'threeViewSecTool',
  props: {
    TracheaName: {
      type: String,
      default: "" //lung ,heart, brain ,...
    },
    viewType: {
      type: [String, Number],
    },
    dicomTags_msg: {
      type: Object,
      default: () => ({})
    },
    orientationTags_msg: {
      type: Object,
      default: () => ({})
    }

  },
  components: {
    btnGroup,
    dicomTags,
    orientationTags,

  },
  data() {
    return {}
  },


}
</script>

<style lang="less" scoped>
.threeViewSecTool {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;

}
</style>
