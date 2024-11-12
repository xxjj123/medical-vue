<template>
  <div class="ana-semantic-des-block_wrapperbox">
    <div class="top_bar flex justify-between">
      <div class="w-[66%]">
        <div class="tit flex">
          <div>
            {{ title }}
          </div>
          <slot name="searchBar"> </slot>
        </div>
      </div>
      <div class="flex-1 flex justify-end">
        <div ref="copyButton" v-clipboard:copy="descCacheBk" v-clipboard:success="descCacheBk_copy_success"
          @click="handle_copy" class="copyIcon flex items-center ripple">
          <div class="pic"></div>
          <div class="txt">复制</div>
        </div>
      </div>
    </div>
    <div class="context_book">
      <!-- {{ selectVal }} -->
      <div class="item_book" v-for="(item, index) in resultBookItems" :key="index">
        <div class="item_row" :class="item.isActive ? 'selected' : ''">{{ item.desc }}</div>
      </div>
    </div>

    <textarea class="textarea_fix" v-model="descCacheBk"></textarea>
  </div>
</template>
<script lang="javascript">


import { SortOption, noduleFindingTemplate, noduleDiagnoseTemplate } from "@/assets/js/utils/dicom/select";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

import Emitter from "@/assets/js/mixins/emitter.js";


export default {
  name: "ana-semantic-des-block",
  mixins: [Emitter],
  props: {
    selectVal: {
      type: Object,
    },
    desCode: {
      type: String,
      default: () => {
        return "";//yxsj yxzd
      }
    },
    title: {
      type: String,
      default: "",
    },
    blockMode: {
      type: String,
      default: "",
    },
    bookItems: {
      type: Array,
      default: () => [],
    },
    current: {
      type: [String, Number],
    },
    selection: {
      type: Array,
      default: () => [],
    },

  },
  computed: {
    ...mapState("mprViewStore", ["seriesInfo"]),
    ...mapGetters("viewReportsStore", ["get_reports_tag", "get_reports_yxsj_content", "get_reports_yxzd_content"]),

    resultBookItems: {
      get() {
        if (this.selectVal) {
          const { value } = this.selectVal
          let resultBookItems = null;
          const { imageCount } = this.seriesInfo
          const mode = value
          if (this.blockMode == 'finding') {
            resultBookItems = noduleFindingTemplate(this.selection, mode, imageCount, this.current)
            console.log("resultBookItems2---", resultBookItems)
            // return resultBookItems
          } else if (this.blockMode == 'diagnose') {
            resultBookItems = noduleDiagnoseTemplate(this.selection, mode, this.current)
            console.log("resultBookItems2", resultBookItems)

          }

          if (this.desCode === 'yxsj') {
            const descStrBook = this.getFullDescString(resultBookItems);

            this.SET_REPORTS_MUIL_CONTEXT({
              name: this.desCode,
              data: descStrBook,
            })


          } else if (this.desCode === 'yxzd') {
            const descStrBook = this.getFullDescString(resultBookItems);

            this.SET_REPORTS_MUIL_CONTEXT({
              name: this.desCode,
              data: descStrBook,
            })
          }

          return resultBookItems
        }
        return []


      },
      set(val) {
        this.$emit("update:bookItems", val);
        // return val;
      },
    },



  },
  watch: {

    resultBookItems: {
      handler(nVal, oVal) {

      },
      immediate: false,
    },
    desCode: {
      handler(nVal, oVal) {
        console.log("watch___desCodeValue", nVal, oVal);

      },
      immediate: true,
    },

  },
  data() {
    return {
      resultBookItems_data: [],
      clipboard: null,
      descCacheBk: "",
    };
  },
  methods: {
    ...mapMutations("viewReportsStore", ["SET_REPORTS_TAG", "SET_REPORTS_MUIL_CONTEXT", "SET_REPORTS_YXSJ_CONTENT", "SET_REPORTS_YXZD_CONTENT"]),
    descCacheBk_copy_success() {
      this.$message.success('复制成功');
    },
    getFullDescString(data) {
      return data.map(item => item.desc + '\n').join('');
    },
    handle_copy() {

      console.log("开始打印啦", "this.$parent", this.$parent, JSON.stringify(this.resultBookItems));

      const descStrBook = this.getFullDescString(this.resultBookItems);
      console.log("descStrBook=", descStrBook);
      this.descCacheBk = descStrBook;



      clipboard.on('error', (e) => {
        // 显示错误消息提示
        this.$message.error("复制失败，请重试");
      });
    },

  },
  created() {
    console.log("this.$slots.searchBar:::", this.$slots.searchBar)

    this.$bus.off('ebs_reports_tag')
    this.$bus.on('ebs_reports_tag', (val) => {
      this.SET_REPORTS_TAG(val)
    })

    this.$bus.off('ebs_update_reports_context')
    this.$bus.on('ebs_update_reports_context', (tag) => {
      console.log("this.get_reports_tag", this.get_reports_tag);


      const descStrBook = this.getFullDescString(this.resultBookItems);
      console.log("descStrBook=", descStrBook);

      this.SET_REPORTS_MUIL_CONTEXT({
        name: tag,
        data: descStrBook,
      })


      // "get_reports_tag", "get_reports_yxsj_content", "get_reports_yxzd_content"
      console.log("v-get_reports_tag", this.get_reports_tag,);
      console.log("v-get_reports_yxsj_content", this.get_reports_yxsj_content,);
      console.log("v-get_reports_yxzd_content", this.get_reports_yxzd_content,);



    })
  },
};
</script>
<style lang="less" scoped>
.top_bar {
  font-size: 14px;
  margin-bottom: 14px;
  margin-top: 20px;
}

.copyIcon {
  cursor: pointer;

  .pic {
    .func_bgCover();
    background-image: url(./assets/img/copy.png);
    width: 14px;
    height: 14px;
    margin-right: 2px;
  }

  .txt {
    font-size: 14px;
  }
}

.context_book {
  .item_book {
    margin: 10px 0 10px 0;

    .item_row {}
  }
}

.selected {
  color: yellow;
}

.textarea_fix {
  font-size: 0;
  position: fixed;
  right: -999px;
}
</style>
