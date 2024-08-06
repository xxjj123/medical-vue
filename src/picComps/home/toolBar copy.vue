<template>
  <div class="h-full flex items-center justify-center space-x-2">
    <el-radio-group v-model="currentwindow" aria-label="label position">
      <el-radio-button value="lung">肺窗</el-radio-button>
      <el-radio-button value="mediastinal">纵隔窗</el-radio-button>
      <el-radio-button value="bone">骨窗</el-radio-button>
    </el-radio-group>
    <!-- 主题选择 -->
    <el-select
      v-model="currenttheme"
      placeholder="Select"
      size="large"
      style="width: 160px"
      value-key="index"
    >
      <el-option
        v-for="item in themes"
        :key="item.index"
        :label="item.name"
        :value="item"
      />
    </el-select>
    <!-- 窗宽窗位 -->
    <el-popover
      placement="bottom"
      title="窗宽窗位"
      :width="200"
      trigger="click"
    >
      <template #reference>
        <el-button class="m-2">
          <el-icon><Loading /></el-icon>
          <span class="label">窗宽窗位</span>
        </el-button>
      </template>
      灰度：
      <el-slider
        :min="0"
        :max="4096"
        v-model="windowcolor"
        @input="UpdateWindowColor"
      />
      <el-input v-model="windowcolor" style="max-width: 120px">
        <template #append>HU</template>
      </el-input>
      亮度：
      <el-slider
        :min="-1024"
        :max="3000"
        v-model="windowlevel"
        @input="UpdateWindowLevel"
      />
      <el-input v-model="windowlevel" style="max-width: 120px">
        <template #append>HU</template>
      </el-input>
    </el-popover>
    <!-- 角标信息 -->
    <el-button @click="ShowSubscript">
      <el-icon><CaretBottom /></el-icon>
      <span class="label">角标</span>
    </el-button>
    <!-- 十字线显示 -->
    <el-button @click="CrossHair">
      <el-icon><Rank /></el-icon>
      <span class="label">十字线</span>
    </el-button>
    <!-- 密集投影模式 -->
    <el-button>
      <el-popover
        placement="bottom"
        title="密集投影"
        :width="200"
        trigger="click"
      >
        <template #reference>
          <el-button class="m-2">
            <el-icon><PictureFilled /></el-icon>
            <span class="label">密集投影</span>
          </el-button>
        </template>
        模式：
        <el-radio-group v-model="slabMode" @change="ChangeSlabMode">
          <el-radio
            v-for="(option, index) in slabModes"
            :key="index"
            :label="option.value"
          >
            {{ option.label }}
          </el-radio>
        </el-radio-group>
      </el-popover>
    </el-button>
    <!-- 关键靶重建 -->
    <el-button>
      <el-icon><Aim /></el-icon>
      <span class="label">关键靶重建</span>
    </el-button>
    <!-- 平移模式 -->
    <el-button @click="StartPan">
      <el-icon><DCaret /></el-icon>
      <span class="label">平移模式</span>
    </el-button>
  </div>
</template>

<script setup>
import { useToolsStore } from "@/stores";
import { watch, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
// import {
//   Rank,
//   DCaret,
//   PictureFilled,
//   Aim,
//   CaretBottom,
//   Loading
// } from '@element-plus/icons-vue'

const emit = defineEmits(["ChangeTheme"]);
const toolsStore = useToolsStore();
const { crosshair } = storeToRefs(toolsStore);

//视窗，窗宽窗位
const windows = [
  {
    des: "lung",
    ww: 1500,
    wl: -500,
  },
  { des: "bone", ww: 1500, wl: 300 },
  { des: "mediastinal", ww: 300, wl: 50 },
];
const windowcolor = ref(0);
const windowlevel = ref(0);
const currentwindow = ref("");
watch(currentwindow, (newval) => {
  windows.forEach((item) => {
    if (item.des === newval) {
      windowcolor.value = item.ww;
      windowlevel.value = item.wl;
      toolsStore.UpdateColorWindow(item.ww);
      toolsStore.UpdateColorLevel(item.wl);
    }
  });
});
const UpdateWindowColor = () => {
  currentwindow.value = "";
  toolsStore.UpdateColorWindow(windowcolor.value);
};
const UpdateWindowLevel = () => {
  currentwindow.value = "";
  toolsStore.UpdateColorLevel(windowlevel.value);
};

const slabModes = [
  { label: "最小密度投影MPR", value: "min" },
  { label: "最大密度投影MIR", value: "max" },
];

const slabMode = ref(slabModes[0]); // 初始化 slabMode 变量
const ChangeSlabMode = (mode) => {
  // console.log(mode);
  toolsStore.ChangeSlabMode(mode);
};
const CrossHair = () => {
  toolsStore.CrossHair();
};
const StartPan = () => {
  toolsStore.StartPan();
};
//主题
const themes = [
  { index: 0, name: "肋骨高级视图", theme: "advanced-view" },
  { index: 1, name: "MPR", theme: "mpr-view" },
  { index: 2, name: "原图", theme: "original-view" },
];
const currenttheme = ref(themes[0]);
watch(
  () => currenttheme.value.index,
  () => {
    emit("ChangeTheme", currenttheme.value.theme);
  },
);

const ShowSubscript = () => {
  emit("ChangeSubshow");
};
onMounted(() => {
  emit("ChangeTheme", currenttheme.value.theme);
});
defineExpose({
  windowcolor,
  windowlevel,
});
</script>

<style lang="less" scoped>
.el-button {
  position: relative;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  .el-icon {
    font-size: 15px;
  }
  .label {
    display: none;
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    padding: 2px 5px;
    border-radius: 3px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    z-index: 10;
  }
}
.el-radio-button:hover .label,
.el-button:hover .label {
  display: block;
}
</style>
