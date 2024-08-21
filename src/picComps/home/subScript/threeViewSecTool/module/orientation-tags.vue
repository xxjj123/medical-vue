<template>
  <div class="orientaion-tags">
    <div class="overlay1">
      <div>R</div>
    </div>
    <div class="overlay2">
      <div class="h-full flex flex-col justify-between items-stretch">
        <div>S</div>
        <div>I</div>
      </div>
    </div>

    <div class="overlay3">
      <div>L</div>
    </div>



  </div>
</template>
<script lang='javascript'>
export default {
  name: 'orientaion-tags',
  props: {
    datav: {
      type: Object,
      required: true
    }
  },
  computed: {

  },
  data() {
    return {}
  },
  created() {

  },
}
</script>
<style lang='less' scoped>
.orientaion-tags {
  user-select: none;
  pointer-events: none;
}

.overlay1 {
  box-sizing: border-box;
  position: absolute;
  width: calc(50% - 20px);
  height: 100%;
  display: flex;
  top: 0px;
  left: 0px;
  text-align: left;
  // align-items: flex-end;

  -webkit-box-align: center;
  align-items: center;
  padding-left: 12px;
  padding-bottom: 32px;
  // transform-origin: left bottom;
  transform-origin: left center;
}

.overlay2 {
  box-sizing: border-box;
  position: absolute;
  width: calc(50% - 20px);
  height: 100%;
  display: flex;
  top: 0px;
  left: calc(25% + 10px);
  text-align: center;
  align-items: flex-start;
  padding-left: 12px;
  padding-top: 12px;
  -webkit-box-pack: center;
  justify-content: center;
  transform-origin: center top;
}

.overlay3 {
  box-sizing: border-box;
  position: absolute;
  height: 100%;
  display: flex;
  top: -10px;
  text-align: right;
  -webkit-box-align: center;
  align-items: center;
  padding-right: 20px;
  // padding-top: 12px;
  right: 0px;
  left: auto;
  width: max-content;
  transform-origin: right center;
}
</style>
