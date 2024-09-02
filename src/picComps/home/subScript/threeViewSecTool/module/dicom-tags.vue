<template>
  <div class="" :class="[
    'dicom-tags',
    'absolute',
    { leftTop: fixHere === 'leftTop' },
    { rightTop: fixHere === 'rightTop' },
    { leftBottom: fixHere === 'leftBottom' }
  ]" :style="{ ...sheetStyleTag }">
    <template>
      <div class="item_row flex">
        <div class="label">WW/WL:</div>
        <div class="val">{{ WindowColorLevel }}</div>
      </div>

    </template>
    <template>
      <div class="item_row flex">
        <div class="label">Image:</div>
        <div class="val">{{ datav.image }}</div>
      </div>
    </template>

    <template v-if="ThicknessShow">
      <div class="item_row flex">
        <div class="label">Thickness:</div>
        <div class="val">{{ ThicknessVal }}</div>
      </div>

    </template>
    <template v-if="KvpShow">
      <div class="KVP_block absolute leftBottom">
        <div class="item_row flex">
          <div class="label">kVp:</div>
          <div class="val">{{ KvpVal }}</div>
        </div>
      </div>
    </template>
    <template v-if="HuShow">
      <div class="Hu_block absolute leftBottom">
        <div class="item_row flex">
          <div class="label">Hu:</div>
          <div class="val">{{ HuVal }}</div>
        </div>
      </div>
    </template>
    <template v-if="SpaceShow">
      <div class="spac_block absolute leftBottom">
        <div class="item_row flex">
          <div class="label">Spacing:</div>
          <div class="val">{{ SpacVal }}</div>
        </div>
      </div>
    </template>
    <template v-if="DimensionShow">
      <div class="dimension_block absolute leftBottom">
        <div class="item_row flex">
          <div class="label">Dimension:</div>
          <div class="val">{{ DimensionVal }}</div>
        </div>
      </div>
    </template>
    <template v-if="verseTag">
      <div class="absolute leftBottom">
        <div class="item_row flex ruleLine items-center">
          <div class="label flex items-center">
            <span>{{ scaleplate.value }}</span><span>{{ scaleplate.unit }}</span>
          </div>
          <div class="val mt-[3px]">
            <i></i>
          </div>
        </div>
      </div>
    </template>
    <template v-if="studies_selected">
      <div class="tagsOther absolute rightTop">
        <div class="item_row flex justify-end">
          <div class="val">{{ seriesInfo.institutionName }}</div>
        </div>

        <div class="item_row flex justify-end">
          <div class="val">{{ seriesInfo.patientName }}</div>
        </div>

        <div class="item_row flex justify-end">
          <div class="val">F&nbsp;{{ seriesInfo.patientAge }}&nbsp;{{ seriesInfo.patientId }}</div>
        </div>

        <div class="item_row flex justify-end">
          <div class="val">{{ seriesInfo.studyDateAndTime | dateTimeFormat }}</div>
        </div>

        <div class="item_row flex justify-end">
          <div class="val">{{ seriesInfo.manufacturer }}</div>
        </div>


      </div>
    </template>

  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'dicom-tags',
  props: {
    datav: {
      type: Object,
      required: true
    },
    sheetStyle: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState("viewInitStore", ["seriesInfo", "noduleDiagnoseState"]),
    sheetStyleTag: {
      get() {
        return this.sheetStyle;
      },
      set(val) {
        this.$emit("update:sheetStyle", val)
      },
    },
    group() {
      return this.datav.group || [];
    },
    studies_selected() {
      let studies = this.datav.studies_selected;
      return studies && Object.keys(studies).length > 0 ? studies : false
    },
    WindowColorLevel() {
      return this.noduleDiagnoseState.colorWindow + "/" + this.noduleDiagnoseState.colorLevel || false;
    },
    HuShow() {
      return this.datav.HuShow || false;
    },
    HuVal() {
      return this.datav.HuVal || '';
    },
    ThicknessShow() {
      return this.datav.ThicknessShow || false
    },
    ThicknessVal() {
      return parseFloat(this.seriesInfo.sliceThickness).toFixed(2) || '';
    },
    SpacVal() {
      const [coronalThick, sagittalThick] = this.seriesInfo.pixelSpacing.split(",").map(item => parseFloat(item).toFixed(2));
      return coronalThick + "/" + sagittalThick || '';
    },
    SpaceShow() {
      return this.datav.SpaceShow || false;
    },
    KvpShow() {
      return this.datav.KvpShow || false;
    },
    KvpVal() {
      return this.seriesInfo.kvp || '';
    },
    DimensionShow() {
      return this.datav.DimensionShow || false;
    },
    DimensionVal() {
      return this.seriesInfo.coronalCount + "/" + this.seriesInfo.sagittalCount || '';
    },
    verseTag() {
      return this.datav.verseTag || false;
    },
    scaleplate() {
      return this.datav.scaleplate || { unit: 'cm', value: '1', width: '16px', verse: true };
    },
    fixHere() {
      return this.datav.fixHere || 'leftTop';
    }
  },
  filters: {
    dateTimeFormat(value) {
      return value.replaceAll('-', '')
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
  user-select: none;
  pointer-events: none;
  width: 100%;
  height: 100%;
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
  font-size: 12px;
  font-weight: 100;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: rgb(0, 0, 0) 1px 1px 0px;
  margin-bottom: 1px;
  color: #2cf66c;
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
      border-bottom: 1px solid hsla(150, 84%, 70%, 0.986);

      &:before,
      &:after {
        content: "";
        display: inline-block;
        width: 1px;
        height: 3px;
        background: hsla(150, 84%, 70%, 0.986);
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

.KVP_block {
  bottom: 57px;
}

.Hu_block {
  bottom: 43px;
}

.spac_block {
  bottom: 28px;
}

.dimension_block {
  bottom: 10px;
}
</style>
