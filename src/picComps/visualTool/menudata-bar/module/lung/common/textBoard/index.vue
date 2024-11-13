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
      <div class="item_book" v-for="(item, index) in bookItems" :key="index">
        <div class="item_row" :class="item.isActive ? 'selected' : ''">{{ item.desc }}</div>
      </div>
    </div>

    <textarea class="textarea_fix" v-model="descCacheBk"></textarea>
  </div>
</template>

<script lang="javascript">
import { mapMutations, mapGetters } from "vuex";
import Emitter from "@/assets/js/mixins/emitter.js";

export default {
  name: "ana-semantic-des-block",
  mixins: [Emitter],
  props: {
    title: {
      type: String,
      default: "",
    },
    bookItems: {
      type: Array,
      default: () => [],
    },

  },
  computed: {
    ...mapGetters("viewReportsStore", ["get_reports_tag", "get_reports_yxsj_content", "get_reports_yxzd_content"]),
  },
  data() {
    return {
      clipboard: null,
      descCacheBk: "",
    };
  },
  methods: {
    ...mapMutations("viewReportsStore", ["SET_REPORTS_TAG", "SET_REPORTS_MUIL_CONTEXT", "SET_REPORTS_YXSJ_CONTENT", "SET_REPORTS_YXZD_CONTENT"]),
    descCacheBk_copy_success() {
      this.$message.success('复制成功');
    },
    handle_copy() {
      const descStrBook = this.bookItems.map(item => item.desc + '\n').join('');
      this.descCacheBk = descStrBook;
    },

  },
  created() {

    this.$bus.off('ebs_reports_tag')
    this.$bus.on('ebs_reports_tag', (val) => {
      this.SET_REPORTS_TAG(val)
    })

    this.$bus.off('ebs_update_reports_context')
    this.$bus.on('ebs_update_reports_context', (tag) => {
      console.log("this.get_reports_tag", this.get_reports_tag);


      const descStrBook = this.getFullDescString(this.bookItems);
      console.log("descStrBook=", descStrBook);

      this.SET_REPORTS_MUIL_CONTEXT({
        name: tag,
        data: descStrBook,
      })


      // // "get_reports_tag", "get_reports_yxsj_content", "get_reports_yxzd_content"
      // console.log("v-get_reports_tag", this.get_reports_tag,);
      // console.log("v-get_reports_yxsj_content", this.get_reports_yxsj_content,);
      // console.log("v-get_reports_yxzd_content", this.get_reports_yxzd_content,);



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
