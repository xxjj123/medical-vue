<template>
  <ta-select
    mode="multiple"
    v-model="selectValue"
    :placeholder="placeholder"
    :options="CollectionData(collection)"
    :disabled="disabled"
    :allow-clear="allowClear"
    @change="handleChange"
  />
</template>

<script>
import { isString, isArray } from '@yh/ta-utils';

export default {
  name: 'selectMultiple',
  props: ['collection', 'value', 'disabled', 'placeholder', 'allowClear'],
  data() {
    return {
      selectValue: [],
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val, old) {
        if (!isString(val) || val.trim() === '') {
          this.selectValue = [];
          return;
        }
        this.selectValue = val.split(',');
      },
    },
  },
  methods: {
    handleChange(value) {
      if (!isArray(value)) value = [];
      this.$emit('input', value.join(','));
      this.$emit('change', value.join(','));
    },
  },
};
</script>

<style scoped></style>
