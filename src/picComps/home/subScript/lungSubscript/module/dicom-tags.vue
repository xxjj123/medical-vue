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
        <!-- {{ data }} -->
        <!-- {{ data.hu }} -->
        <!-- {{ seriesInfo }} -->

        <div class="label">WW/WL:</div>
        <div class="val">{{ dicomTags.WindowColorLevel }}</div>
      </div>

    </template>
    <template>
      <div class="item_row flex">
        <div class="label">Image:</div>
        <div class="val">{{ dicomTags.image }}</div>
      </div>
    </template>

    <template v-if="ThicknessShow">
      <div class="item_row flex">
        <div class="label">Thickness:</div>
        <div class="val">{{ ThicknessVal }}</div>
      </div>

    </template>
    <template v-if="dicomTags.showMore">
      <div class="KVP_block absolute leftBottom">
        <div class="item_row flex">
          <div class="label">kVp:</div>
          <div class="val">{{ dicomTags.KvpVal }}</div>
        </div>
      </div>
    </template>
    <template>
      <div class="Hu_block absolute leftBottom">
        <div class="item_row flex">
          <div class="label">Hu:</div>
          <div class="val">{{ dicomTags.hu }}</div>
        </div>
      </div>
    </template>
    <template v-if="dicomTags.showMore">
      <div class="spac_block absolute leftBottom">
        <div class="item_row flex">
          <div class="label">Spacing:</div>
          <div class="val">{{ dicomTags.SpacVal }}</div>
        </div>
      </div>
    </template>
    <template v-if="dicomTags.showMore">
      <div class="dimension_block absolute leftBottom">
        <div class="item_row flex">
          <div class="label">Dimension:</div>
          <div class="val">{{ dicomTags.DimensionVal }}</div>
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
    <template v-if="dicomTags.showMore">
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
    data: {
      type: Object,
      required: true
    },
    sheetStyle: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState("lungViewStore", ["seriesInfo", "allViewData"]),

    dicomTags: {
      get() {
        const { changedPageIndex, dimension, hu, viewportId } = this.data
        const { windowWidth, windowCenter } = this.allViewData
        const { coronalCount, sagittalCount, kvp } = this.seriesInfo
        let SpacVal = ''
        if (this.seriesInfo.pixelSpacing) {
          const [coronalThick, sagittalThick] = this.seriesInfo.pixelSpacing.split(",").map(item => parseFloat(item).toFixed(2));
          SpacVal = coronalThick + "/" + sagittalThick || '';
        }
        return {
          image: changedPageIndex + "/" + dimension,
          hu: hu,
          showMore: viewportId == 'STACK_AXIAL',
          WindowColorLevel: windowWidth + "/" + windowCenter,
          SpacVal: SpacVal,
          DimensionVal: coronalCount + "/" + sagittalCount,
          KvpVal: kvp

        }

      }
    },

    sheetStyleTag: {
      get() {
        return this.sheetStyle;
      },
      set(val) {
        this.$emit("update:sheetStyle", val)
      },
    },
    group() {
      return this.data.group || [];
    },
    studies_selected() {
      let studies = this.data.studies_selected;
      return studies && Object.keys(studies).length > 0 ? studies : false
    },
    // WindowColorLevel() {
    //   return this.allViewData.windowWidth + "/" + this.allViewData.windowCenter || false;
    // },

    verseTag() {
      return this.data.verseTag || false;
    },
    scaleplate() {
      return this.data.scaleplate || { unit: 'cm', value: '1', width: '16px', verse: true };
    },
    fixHere() {
      return this.data.fixHere || 'leftTop';
    }
  },
  filters: {
    dateTimeFormat(value) {
      if (value) {
        return value.replaceAll('-', '')

      }
      return ''
    }
  },
  data() {
    return {}
  },
  created() {
    // console.log("this.data===", this.data);

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
