<template>
  <div>
    <div ref="ViewRef" class="ViewBoard_panel flex justify-center items-center   w-full h-full ">

    </div>
  </div>
</template>

<script lang="javascript">

import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

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

  },
  watch: {

  },

  methods: {
    ...mapActions("picViewStore", [
      "InitView",
      "resizeSliceViews"
    ]),
  },
  created() {



  },
  mounted() {
    this.$nextTick(() => {
      // this.Init3DView(this.$refs.View3DRef);
      this.InitView(this.$refs.ViewRef);

      window.addEventListener("resize", this.resizeSliceViews);
    });
  },
};
</script>
<style lang="less" scoped>
.ViewBoard_panel {
  border: 1px solid red;
  width: 100%;
  height: 100%;
}
</style>
