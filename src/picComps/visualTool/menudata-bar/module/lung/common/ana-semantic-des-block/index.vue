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
        <div @click="handle_copy" class="copyIcon flex items-center ripple">
          <div class="pic"></div>
          <div class="txt">复制</div>
        </div>
      </div>
    </div>
    <div class="context_book">
      <div
        class="item_book"
        v-for="(item, index) in resultBookItems"
        :key="index"
      >
        {{ item }}
      </div>
    </div>
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
export default {
  name: "ana-semantic-des-block",
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
    resultBookItems: {
      get() {
        return this.bookItems;
      },
      set(val) {
        this.$emit("update:bookItems", val);
        // return val;
      },
    },
  },
  data() {
    return {
      resultBookItems_data: [],
    };
  },
  methods: {
    handle_copy() {
      // this.resultBookItems = [
      //   `右肺上叶前段【39/259】见混合性结节，大小约13.8mmx8.3mm，体积约649.3mm³，平均CT值约-277.6HU`,
      //   `左肺上叶前段【63/259】见磨玻璃性结节，大小约4.6mmx2.4mm，体积约28.9mm³，平均CT值约-702.2HU。`,
      //   `左肺上叶前段【78/259】见磨玻璃性结节，大小约6.3mmx2.8mm，体积约49.6mm³，平均CT值约-529.3HU。`,
      //   `右肺上叶前段【78/259】见磨玻璃性结节，大小约4.9mmx3.7mm，体积约51.0mm³，平均CT值约-634.0HU。`,
      // ];
    },
    init_resultBookItems() {
      this.resultBookItems_data = [
        `右肺上叶前段【39/259】见混合性结节，大小约13.8mmx8.3mm，体积约649.3mm³，平均CT值约-277.6HU`,
        `左肺上叶前段【63/259】见磨玻璃性结节，大小约4.6mmx2.4mm，体积约28.9mm³，平均CT值约-702.2HU。`,
        `左肺上叶前段【78/259】见磨玻璃性结节，大小约6.3mmx2.8mm，体积约49.6mm³，平均CT值约-529.3HU。`,
        `右肺上叶前段【78/259】见磨玻璃性结节，大小约4.9mmx3.7mm，体积约51.0mm³，平均CT值约-634.0HU。`,
      ];
      // console.log(" this.resultBookItems=", this.resultBookItems);
    },
  },
  created() {
    this.init_resultBookItems();
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
  }
}
</style>
