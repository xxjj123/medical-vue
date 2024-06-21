<template>
  <div class="pacs_page_header_wrapper pl-[21px] pr-[39px] pt-[19px] pb-[21px]">
    <div class="flex justify-between">
      <template v-if="!bread">
        <slot name="trademark">
          <div class="flex">
            <div class="icon_mainLg"></div>
            <div class="pl-[13px] lg_infoName">
              <div class="h1">医学影像辅助诊断系统</div>
              <div class="h2">Yinhai Medical</div>
            </div>
          </div>
        </slot>
      </template>
      <template v-else>
        <div class="breadMenu flex justify-start items-center">
          <div
            class="left_arrow hover:cursor-pointer mr-[13px]"
            @click="back()"
          ></div>
          <div class="back_page hover:cursor-pointer" @click="back()">
            {{ breadItem.prevName }}
          </div>
          <div class="fgf hover:cursor-default ml-[10px] mr-[10px]">
            &frasl;
          </div>
          <div class="cur_page hover:cursor-default">
            {{ breadItem.curName }}
          </div>
        </div>
      </template>
      <div>
        <div class="group_btns flex items-center justify-start">
          <div
            class="ripple keyborard_icon mr-[41px] hover:cursor-pointer"
            @click="handle_keyborard_banner"
          ></div>
          <div
            v-popover:mypop
            @click="toggleRotation"
            class="ripple userGrps flex items-center justify-start hover:cursor-pointer"
          >
            <div class="ripple user_icon mr-[10px]"></div>
            <div
              :class="[
                'btn_more transform transition duration-300',
                { 'rotate-180': rotated },
              ]"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ext -->
    <ta-popover
      ref="mypop"
      @after-leave="afterLeaveEvents"
      :visible-arrow="false"
      :offset="10"
      style="background: #000"
      :appendToBody="false"
      class="cus_poper"
    >
      <div slot="content" class="user_out_box">
        <div class="flex justify-start items-end">
          <div class="flex justify-start items-center">
            <div class="user_icon mr-[10px]"></div>
            <div class="text_user">Admin</div>
          </div>
          <div>
            <ta-button type="primary" @click="gotoOut">登出</ta-button>
          </div>
        </div>
      </div>
    </ta-popover>

    <!-- ext 键盘配置 -->
    <pacsKeyborardCtrl :visible.sync="pacsKbCtrl_visible"></pacsKeyborardCtrl>
  </div>
</template>
<script lang='javascript'>
import pacsKeyborardCtrl from "@/components/pacs-keyborard-ctrl/index.vue";
export default {
  name: "pacs-page-header",
  props: {
    bread: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    pacsKeyborardCtrl,
  },
  data() {
    return {
      rotated: true,
      pacsKbCtrl_visible: false,
      breadItem: {
        prevName: "",
        curName: "",
      },
    };
  },

  watch: {
    pacsKbCtrl_visible(val) {
      console.log("wathc-,val,__pacsKbCtrl_visible", val);
    },
  },
  methods: {
    back() {
      const previousRouteString = localStorage.getItem("previousRoute");
      console.log("previousRouteString***", previousRouteString);
      // const { path, query } = previousRouteString;
      // this.$router.push({
      //   path: path,
      //   query: {
      //     ...query,
      //   },
      // });
      this.$router.go(-1);
    },
    handle_keyborard_banner() {
      this.pacsKbCtrl_visible = true;
    },
    toggleRotation() {
      this.rotated = !this.rotated;
    },
    afterLeaveEvents() {
      this.rotated = true;
    },
    gotoOut() {
      // this.$router.go(-1);
      location.href = "login.html";
      localStorage.removeItem("previousRoute");
    },
    init_BreadInfo() {
      const previousRouteString = localStorage.getItem("previousRoute");
      if (previousRouteString) {
        const previousRoute = JSON.parse(previousRouteString);
        console.log("上一个路由信息:", previousRoute);

        this.breadItem.prevName = previousRoute.meta?.name
          ? previousRoute.meta?.name
          : "列表";
        this.breadItem.curName = this.$route.meta?.name;
      }
    },
  },
  created() {
    console.log("$route-------------", this.$route);

    this.init_BreadInfo();
  },
};
</script>
<style lang='less' scoped>
// .func_bgCover() {
//   background-repeat: no-repeat;
//   background-size: 100%;
//   background-position: 0 0;
// }

.pacs_page_header_wrapper {
  height: 80px;
  background-color: @theme_headerBg;
}

.icon_mainLg {
  width: 40px;
  height: 40px;
  .func_bgCover();
  background-image: url(@/assets/images/mainLogo.png);
}

.lg_infoName {
  .h1 {
    font-size: 16px;
    color: #ffffff;
  }
  .h2 {
    font-size: 12px;
    color: #ffffff;
  }
}

.group_btns {
  .keyborard_icon {
    .func_bgCover();
    width: 26px;
    height: 20px;
    background-image: url(./assets/img/fastKeybd.png);
  }

  .userGrps {
    .btn_more {
      .func_bgCover();
      width: 10px;
      height: 8px;
      background-image: url(./assets/img/arrow.png);
    }
  }
}

.user_icon {
  .func_bgCover();
  width: 40px;
  height: 40px;
  background-image: url(./assets/img/headLg.png);
}

.user_out_box {
  background-color: @input-bg;
  .text_user {
    color: #fff;
    margin-right: 20px;
  }
}
body {
  .cus_poper {
    /deep/ .el-popover {
      &.el-popper {
        background-color: @input-bg;
      }
    }
  }
}

.breadMenu {
  .left_arrow {
    .func_bgCover();
    background-image: url(./assets/img/back.png);
    width: 8px;
    height: 13px;
  }

  .back_page {
    color: rgba(255, 255, 255, 0.65);
  }

  .fgf {
    color: rgba(255, 255, 255, 0.65);
  }

  .cur_page {
  }
}
</style>
