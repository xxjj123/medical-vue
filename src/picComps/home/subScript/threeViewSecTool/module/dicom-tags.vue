<template>
  <div :class="[
    'dicom-tags',
    'absolute',
    {leftTop: fixHere === 'leftTop'},
    {rightTop: fixHere === 'rightTop'},
    {leftBottom: fixHere === 'leftBottom'}
  ]">
    <template v-if="group.length > 0">
      <div class="item_row flex" v-for="(it, index) in group" :key="index">
        <div class="label">
          <span>{{ it.label }}</span>
          <span>:</span>
        </div>
        <div class="val">{{ it.value }}</div>
      </div>
    </template>
    <template v-if="verseTag">
      <div class="item_row flex ruleLine items-center">
        <div class="label flex items-center">
          <span>{{ scaleplate.value }}</span><span>{{ scaleplate.unit }}</span>
        </div>
        <div class="val mt-[3px]">
          <i></i>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'dicom-tags',
  props: {
    datav: {
      type: Object,
      required: true
    }
  },
  computed: {
    group() {
      return this.datav.group || [];
    },
    verseTag() {
      return this.datav.verseTag || false;
    },
    scaleplate() {
      return this.datav.scaleplate || {unit: 'cm', value: '1', width: '16px', verse: true};
    },
    fixHere() {
      return this.datav.fixHere || 'leftTop';
    }
  },
  data() {
    return {}
  },
  created() {
    console.log("this.data===", this.datav);

  }
}
</script>

<style lang='less' scoped>
.dicom-tags {
  box-sizing: border-box;
}

.leftTop {
  left: 0;
  top: 0;
}

.rightTop {
  right: 0;
  top: 0;
}


.leftBottom {
  left: 0;
  bottom: 0;
}

.item_row {
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 100;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: rgb(0, 0, 0) 1px 1px 0px;
  margin-bottom: 1px;
}

.ruleLine {
  line-height: 1;

  .label {
    padding-right: 10px;
    font-size: 13px;

    span {
      margin-right: 2px;
    }
  }

  .val {
    i {
      display: block;
      width: 16px;
      position: relative;
      border-bottom: 1px solid #fff;

      &:before,
      &:after {
        content: "";
        display: inline-block;
        width: 1px;
        height: 3px;
        background: #f7f8f7;
        position: absolute;
      }

      &:before {
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto;
      }

      &:after {
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
  }
}
</style>
