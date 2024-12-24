<template>
  <div class="threeViewSecTool ">
    <slot></slot>
    <dicomTags v-show="jbinfoButtonState" :data="viewInfo"></dicomTags>
    <orientationTags v-show="jbinfoButtonState" :data="viewInfo" :datav="orientationTags_msg"></orientationTags>
    <crossHair v-show="crossHairButtonState" :data="viewInfo"></crossHair>

    <subTools :data="viewInfo" :viewType="viewType" :TracheaName="TracheaName !== '' ? TracheaName : 'lung'"></subTools>

  </div>
</template>

<script lang="javascript">
import btnGroup from "./module/btn-group.vue";
import subTools from "./module/subTools.vue";

import dicomTags from "./module/dicom-tags.vue";
import crossHair from "./module/crossHair.vue";

import orientationTags from "./module/orientation-tags.vue";

import { mapActions, mapState } from "vuex";
import {
  ButtonNames, suffix_name
} from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";

export default {
  name: 'threeViewSecTool',
  props: {
    sheetStyle: {
      type: Object,
      default: () => ({})
    },
    TracheaName: {
      type: String,
      default: "" //lung ,heart, brain ,...
    },
    viewType: {
      type: [String, Number],
    },
    viewInfo: {
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
    subTools,
    dicomTags,
    crossHair,
    orientationTags,

  },
  data() {
    return {}
  },
  computed: {
    ...mapState("toolBarStore", {
      jbinfoButtonState: state => state[`${ButtonNames.Jbinfo}${suffix_name}`],
      crossHairButtonState: state => state[`${ButtonNames.Szckx}${suffix_name}`],

    }),
  }

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
