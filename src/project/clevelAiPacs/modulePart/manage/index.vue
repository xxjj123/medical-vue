<template>
  <div class="page_full">
    <div class="headerTop">
      <PacsPageHeader></PacsPageHeader>
    </div>
    <div class="contentMain">
      <ta-border-layout
        :header-cfg="headerCfg"
        :center-cfg="centerCfg"
        :footer-cfg="footerCfg"
        :show-resize="false"
        :showBorder="false"
        :showPadding="false"
      >
        <div slot="header">
          <!-- header 顶部内容 -->
        </div>
        <!-- <div slot="headerExtraContent">headerExtraContent 头部工具条的插槽</div> -->

        <div>center 主内容容器</div>
        <div slot="centerExtraContent">
          centerExtraContent 主要内容工具条的插槽
        </div>
        <div slot="centerFooter">centerFooter 主要内容底部的插槽</div>

        <div slot="footer">footer 底部内容</div>
        <div slot="footerExtraContent">footerExtraContent 底部工具条的插槽</div>
      </ta-border-layout>
    </div>
  </div>
</template>
<script lang='javascript'>
import PacsPageHeader from "@/components/pacs-page-header/index.vue";
export default {
  name: "manageDicom",
  components: {
    PacsPageHeader,
  },
  data() {
    return {
      headerCfg: {
        // title: "header",
        // expand: true,
        // expandText: "more",
        showBar: false,
        showBorder: false,
      },

      footerCfg: {
        title: "footer",
        expand: true,
        expandText: "more",
        showBar: true,
        showBorder: false,
      },
      centerCfg: {
        title: "center",
        showBar: true,
        showFooter: true,
        footerHeight: "68px",
        showBorder: false,
      },
    };
  },
};
</script>
<style lang='less' scoped>
.page_full {
  width: 100%;
  height: 100vh;
  .headerTop {
  }
  .contentMain {
    height: calc(100% - 81px);
  }
}
</style>