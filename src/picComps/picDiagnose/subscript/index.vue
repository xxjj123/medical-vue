<template>
  <div class="  p-5">
    <div class="relative  h-full w-full" v-show="jbinfoButtonState">
      <div class="absolute left-0 top-0">
        11
      </div>
      <div class="absolute right-0 top-0">
        22
      </div>
      <div class="absolute left-0 bottom-0">
        33
      </div>
      <div class="absolute right-0 bottom-0">
        44
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
