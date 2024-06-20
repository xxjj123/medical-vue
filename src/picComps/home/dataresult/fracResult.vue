<template>
  <div class="w-full px-5 h-185 relative">
    <div class="mt-2 py-3 text-3.5 w-full text-coolGray">
      <div>影像所见</div>
      <div v-for="(item, index) in findingByLevel" :key="index">{{ item }}</div>
    </div>
    <div class="mt-2 py-2 text-3.5 text-coolGray">
      <div class="py-2">影像诊断</div>
      <div>{{ data.diagnosis }}</div>
    </div>
    <div class="w-full h-10 absolute bottom-0 left-0 px-3">
      <el-button class="!h-full !bg-blue-500 !w-full !text-white !border-0"
        >报告</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps(['data'])
const { data } = props
const findingByLevel = computed(() => {
  return data.finding.split('\n')
})
</script>

<style lang="scss" scoped></style>
