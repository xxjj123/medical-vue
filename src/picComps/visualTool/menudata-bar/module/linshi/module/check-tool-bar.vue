<template>
  <div class="nodule-result_check-tool-bar">
    <div class="row flex justify-between">
      <div class="btn_grp flex">
        <div class="btn_custom on">当前检查</div>
        <div class="btn_custom">量化随访</div>
      </div>
      <div class="state_box">
        <!-- <ta-tag color="cyan">随访等待计算</ta-tag> -->
        <ta-button type="link">无量化随访</ta-button>
      </div>
    </div>
  </div>
</template>
<script lang='javascript'>
export default {
  name: "check-tool-bar",
  data() {
    return {};
  },
};
</script>
<style lang='less' scoped>
.nodule-result_check-tool-bar {
  .row {
  }
  .btn_grp {
  }
  @color: #00afb0;
  @opacity: 0.15;

  .btn_custom {
    min-width: 70px;
    width: auto;
    min-height: 28px;
    height: auto;
    padding: 4px 7px;
    margin-right: 6px;
    border-radius: 4px;
    cursor: pointer;
    /* .hex-to-rgba(#00afb0, 0.15);;
    background-color: @rgba; */
    .background-opacity(@color, @opacity);
    color: @primary-color;

    // pointer-events: none;
    &:hover {
      cursor: not-allowed;
    }

    &.on {
      color: @input-color;
      background: @primary-color;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
