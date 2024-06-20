<template>
  <div class="px-3 h-185 text-white relative">
    <div class="mt-3">
      <el-button class="!h-6 !bg-blue-500 !text-white !border-0"
        >当前检查</el-button
      ><el-button class="!h-6 !bg-transparent !border-0">量化随访</el-button>
    </div>
    <el-table
      class="!mt-5 !w-full"
      ref="multipleTableRef"
      :data="data.noduleDetailList"
      @selection-change="SelectCheckbox"
      @row-click="SelectRow"
    >
      <el-table-column type="selection" width="30" />
      >
      <el-table-column label="risk" width="60">
        <template #default="scope">{{ scope.row.riskCode }}</template>
      </el-table-column>
      <el-table-column label="volume" width="80">
        <template #default="scope">{{ scope.row.volume }}</template>
      </el-table-column>
      <el-table-column property="lobe" label="lobe" width="120" />
    </el-table>
    <div class="mt-2 py-2 text-3.5 text-coolGray">
      <div class="py-2">影像所见</div>
      <div class="mb-2" v-for="(item, index) in findingByLevel" :key="index">
        {{ item }}
      </div>
    </div>
    <div class="mt-2 py-2 text-3.5 text-coolGray">
      <div class="py-2">影像诊断</div>
      <div>{{ data.diagnosis }}</div>
    </div>

    <div
      class="w-full grid grid-cols-2 gap-3 h-10 absolute bottom-0 left-0 px-3"
    >
      <div class="col-span-1 w-full h-full">
        <el-button class="!h-full !bg-blue-500 !w-full !text-white !border-0"
          >报告</el-button
        >
      </div>
      <div class="col-span-1 w-full">
        <el-button class="!h-full !bg-transparent w-full !text-white"
          >导出</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToolsStore } from '@/stores'

const toolsStore = useToolsStore()
const SelectCheckbox = (row) => {
  console.log(row)
}
const SelectRow = (row) => {
  console.log(row)
  let centerpoint = []
  let point1 = row.annotation[0].points[0]
  let point2 = row.annotation[0].points[1]
  let XLength = Math.abs(point1.x - point2.x)
  let YLength = Math.abs(point1.y - point2.y)
  let ZLength = Math.abs(point1.z - point2.z)

  centerpoint = [
    (point1.x + point2.x) / 2,
    (point1.y + point2.y) / 2,
    (point1.z + point2.z) / 2
  ]
  toolsStore.ChangeImagePage(centerpoint)
  toolsStore.AddCube([XLength, YLength, ZLength], centerpoint)
  // viewsStore.applyClipping(
  //   [point1.x, point1.y, point1.z],
  //   [point2.x, point2.y, point2.z]
  // )
}

const props = defineProps(['data'])
const { data } = props
const findingByLevel = computed(() => {
  if (data.finding && data.finding != '') {
    return data.finding.split('\n')
  }
  return ''
})
</script>

<style lang="scss" scoped></style>
