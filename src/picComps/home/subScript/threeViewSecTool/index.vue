<template>
  <div class="threeViewSecTool">
    <dicomTags></dicomTags>
    <orientationTags></orientationTags>
    <btnGroup :TracheaName="TracheaName !== '' ? TracheaName : 'lung'"></btnGroup>
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
