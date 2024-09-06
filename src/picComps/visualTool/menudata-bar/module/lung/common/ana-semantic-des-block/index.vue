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

      <div class="item_book" v-for="(item, index) in resultBookItems" :key="index">
        <div class="item_row" :class="item.isActive ? 'selected' : ''">{{ item.desc }}</div>
      </div>
    </div>

    <textarea class="textarea_fix" v-model="descCacheBk"></textarea>
  </div>
</template>
<script lang="javascript">
// 语义化描述文本展示器
/**
 * TODO:
 * 1、排序
 * 2、展示
 * 3、高亮联动
 * 4、工具栏扩展
 * 5、复制格式
 * 6、标题
 * ...
 */

import {SortOption, mapObjectListToFindingTemplate, mapObjectListToDiagnoseTemplate} from "@/assets/js/utils/dicom/select";
import {mapState, mapMutations, mapActions, mapGetters} from "vuex";

import Emitter from "@/assets/js/mixins/emitter.js";




export default {
  name: "ana-semantic-des-block",
  mixins: [Emitter],
  props: {
    selectVal: {
      type: [Object],
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
    ...mapState("viewInitStore", ["seriesInfo"]),
    ...mapGetters("viewReportsStore", ["get_reports_tag", "get_reports_yxsj_content", "get_reports_yxzd_content"]),
    desCodeValue: {
      get() {
        return this.desCode;
      },
      set(val) {
        return val;
      },
    },
    resultBookItems: {
      get() {
        console.log("this.selectValue", this.selectValue)
        if (this.selectValue && this.selectValue.value) {
          const {value} = this.selectValue;
          let resultBookItems = null;
          if (this.blockMode == 'finding') {
            resultBookItems = mapObjectListToFindingTemplate(this.selectionValue, value, this.seriesInfo.imageCount, this.currentNum)
            console.log("resultBookItems2---", resultBookItems)
            // return resultBookItems
          } else {
            resultBookItems = mapObjectListToDiagnoseTemplate(this.selectionValue, value)
            console.log("resultBookItems2", resultBookItems)
            // return resultBookItems
          }


          console.log("this.desCode", this.desCode);
          if (this.desCode === 'yxsj') {
            const descStrBook = this.getFullDescString(resultBookItems);
            console.log("descStrBook=", descStrBook);

            this.SET_REPORTS_MUIL_CONTEXT({
              name: this.desCode,
              data: descStrBook,
            })



          } else if (this.desCode === 'yxzd') {
            const descStrBook = this.getFullDescString(resultBookItems);
            console.log("descStrBook=", descStrBook);

            this.SET_REPORTS_MUIL_CONTEXT({
              name: this.desCode,
              data: descStrBook,
            })
          }

          // "get_reports_tag", "get_reports_yxsj_content", "get_reports_yxzd_content"
          console.log("v-get_reports_tag", this.get_reports_tag,);
          console.log("v-get_reports_yxsj_content", this.get_reports_yxsj_content,);
          console.log("v-get_reports_yxzd_content", this.get_reports_yxzd_content,);




          return resultBookItems

        }

      },
      set(val) {
        this.$emit("update:bookItems", val);
        // return val;
      },
    },
    currentNum: {
      get() {
        return this.current;
      },
      set(val) {
        this.$emit("update:current", val);
      }
    },
    selectValue: {
      get() {
        return this.selectVal;
      },
      set(val) {
        this.$emit("update:selectVal", val);
      }
    },
    selectionValue: {
      get() {
        return this.selection;
      },
      set(val) {
        return val;
      }
    }
  },
  watch: {

    currentNum: {
      handler(nVal, oVal) {
        console.log("currentNum_______", nVal, oVal);

      },
      immediate: false,
    },
    selectValue: {
      handler(nVal, oVal) {


        console.log("selectValue________", nVal, oVal);

      },
      immediate: false,
    },
    resultBookItems: {
      handler(nVal, oVal) {
        // this.resultBookItems_data = resultBookItems
        console.log("resultBookItems___________", nVal, oVal);
        if (nVal) {

        }

      },
      immediate: false,
    },
    desCodeValue: {
      handler(nVal, oVal) {
        console.log("watch___desCodeValue", nVal, oVal);
        this.$nextTick(() => {
          // this.$bus.emit('ebs_reports_tag', nVal)
          // if (nVal === 'yxsj') {
          //   this.$bus.emit('ebs_update_reports_context', 'yxsj');

          // } else if (nVal === 'yxzd') {
          //   this.$bus.emit('ebs_update_reports_context', 'yxzd');
          // }



        })




      },
      immediate: true,
    },
    selectionValue: {
      handler(nVal, oVal) {


      },
      immediate: true,
    }
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
      // Initialize clipboard instance
      // let clipboard = new ClipboardJS(this.$refs.copyButton, {
      //   text: () => this.descCacheBk,
      // });
      // // console.log("this.clipboard=", this.clipboard)
      // clipboard.on('success', function (e) {
      //   console.info('Action:', e.action);
      //   console.info('Text:', e.text);
      //   console.info('Trigger:', e.trigger);

      //   e.clearSelection();
      // });
      console.log("开始打印啦", "this.$parent", this.$parent, JSON.stringify(this.resultBookItems));

      const descStrBook = this.getFullDescString(this.resultBookItems);
      console.log("descStrBook=", descStrBook);
      this.descCacheBk = descStrBook;

      // let isClp = ClipboardJS.isSupported();
      // console.log("isClp=", isClp);




      // this.clipboard.on('success', (e) => {
      //   console.log('文本已成功复制:', e.text);
      // });
      // this.clipboard.on('error', (e) => {
      //   console.log('复制失败:', e);
      // });


      // this.resultBookItems = [
      //   `右肺上叶前段【39/259】见混合性结节，大小约13.8mmx8.3mm，体积约649.3mm³，平均CT值约-277.6HU`,
      //   `左肺上叶前段【63/259】见磨玻璃性结节，大小约4.6mmx2.4mm，体积约28.9mm³，平均CT值约-702.2HU。`,
      //   `左肺上叶前段【78/259】见磨玻璃性结节，大小约6.3mmx2.8mm，体积约49.6mm³，平均CT值约-529.3HU。`,
      //   `右肺上叶前段【78/259】见磨玻璃性结节，大小约4.9mmx3.7mm，体积约51.0mm³，平均CT值约-634.0HU。`,
      // ];
    },
    // init_resultBookItems() {


    //   console.log("init_resultBookItems")


    //   this.resultBookItems_data = [
    //     // `右肺上叶前段【39/259】见混合性结节，大小约13.8mmx8.3mm，体积约649.3mm³，平均CT值约-277.6HU`,
    //     // `左肺上叶前段【63/259】见磨玻璃性结节，大小约4.6mmx2.4mm，体积约28.9mm³，平均CT值约-702.2HU。`,
    //     // `左肺上叶前段【78/259】见磨玻璃性结节，大小约6.3mmx2.8mm，体积约49.6mm³，平均CT值约-529.3HU。`,
    //     // `右肺上叶前段【78/259】见磨玻璃性结节，大小约4.9mmx3.7mm，体积约51.0mm³，平均CT值约-634.0HU。`,
    //   ];
    //   // console.log(" this.resultBookItems=", this.resultBookItems);
    // },
  },
  created() {
    // this.init_resultBookItems();


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
