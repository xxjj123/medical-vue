<template>
  <div class="  p-5">

    <div class="relative  h-full w-full" v-show="jbinfoButtonState">
      <div class="absolute left-0 top-0">
        <div> {{ data.manufacturer }}</div>
        <div> {{ data.institutionName }}</div>

      </div>
      <div class="absolute right-0 top-0 ">
        <div>{{ data.patientName }}</div>
        <div> {{ data.patientId }}</div>
        <div>
          {{ data.patientSex }}
        </div>
        <div>
          {{ data.patientAge }}
        </div>

      </div>
      <div class="absolute left-0 bottom-0">
        <div>{{ diagnoseState.colorLevel + "/" + diagnoseState.colorWindow }}</div>

        <div> {{ diagnoseState.hu }}</div>

      </div>
      <div class="absolute right-0 bottom-0">
        <div></div>
      </div>
    </div>
  </div>
</template>



<script lang="javascript">

import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import {
  ButtonNames, suffix_name

} from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";
export default {
  name: "ViewBoard",
  data() {
    return {

    };
  },
  props: {
    data: null,
    diagnoseState: null
  },
  components: {

  },
  computed: {
    ...mapState("toolBarStore", {
      jbinfoButtonState: state => state[`${ButtonNames.Jbinfo}${suffix_name}`],

    }),
  },
  watch: {

  },

  methods: {

  },
  created() {



  },
  mounted() {

  },
};
</script>
<style lang="less" scoped>
.ViewBoard_panel {
  border: 1px solid red;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  position: relative;
  user-select: none;
}
</style>
