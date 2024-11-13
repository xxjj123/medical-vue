<template>
  <div class="ml-[10px]">
    <ta-dropdown :trigger="['click']" class="flex justify-start items-center mr-[10px]">
      <a href="javascript:;">
        {{ selected ? selected.label : '' }}
        <ta-icon type="down" />
      </a>
      <ta-menu slot="overlay" @click="chooseItem">
        <ta-menu-item v-for="(item, index) in options" :key="item.value">
          {{ item.label }}
        </ta-menu-item>
      </ta-menu>
    </ta-dropdown>
  </div>
</template>
<script lang="jsx">

// 病变列表
export default {
  name: "search-bar",
  props: {
    options: Array,
    selected: Object
  },

  methods: {
    chooseItem(e) {
      const { key } = e
      this.$emit("selectItem", key)
    }

  },
};
</script>
