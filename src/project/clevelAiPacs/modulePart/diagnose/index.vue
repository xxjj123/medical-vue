<template>
  <div class="diagnose_page">diagnose_page</div>
</template>
<script lang='javascript'>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  name: "diagnose",
  computed: {
    // 使用方法时，指定一下模块即可
    ...mapState("viewsStore", ["helloViews"]),
  },
  data() {
    return {};
  },
  created() {
    console.log("helloViews==", this.helloViews);
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.diagnose_page {
  background-color: @theme_backBg;
}
</style>
