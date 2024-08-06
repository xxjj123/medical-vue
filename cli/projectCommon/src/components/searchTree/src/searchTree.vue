<template>
  <div class="project-search-tree">
    <span v-if="!customOpenModal">
      <ta-input-search
        :placeholder="'请选择' + name"
        :value="inputLabel"
        @search="openModal"
        @click="clickInput"
        @input="changeInput"
        v-if="!readonlyInput"
      >
        <ta-button slot="enterButton" icon="plus" />
      </ta-input-search>
      <ta-input v-else :value="inputLabel" :read-only="true" :bordered="false" />
    </span>
    <org-tree
      ref="searchOrgTree"
      :visible.sync="treeVisible"
      :get-container-id="getContainerId"
      :name="name"
      :base-url="baseUrl"
      @cancelSelect="cancel"
      @change="handleTreeChange"
    ></org-tree>
  </div>
</template>
<script>
import orgTree from '@projectCommon/components/orgTree';

export default {
  name: 'projectSearchTree',
  components: { orgTree },
  props: {
    /** 弹框绑定的组件 */
    // eslint-disable-next-line vue/require-default-prop
    getContainerId: {
      type: String,
    },
    // eslint-disable-next-line vue/require-default-prop
    baseUrl: {
      type: String,
    },
    name: {
      type: String,
      default: '组织机构',
    },
    // eslint-disable-next-line vue/require-default-prop
    value: {
      type: String,
    },
    allowInput: {
      type: Boolean,
      default: false,
    },
    // eslint-disable-next-line vue/require-default-prop
    initValue: {
      type: String,
    },
    // eslint-disable-next-line vue/require-default-prop
    reshowInput: {
      type: String,
    },
    readonlyInput: {
      type: Boolean,
      default: false,
    },
    // 是否自定义按钮弹出选择框，此模式不需要显示输入框
    customOpenModal: {
      type: Boolean,
    },
  },
  data() {
    return {
      treeVisible: false, // 是否显示组织树模态框
      inputLabel: '',
    };
  },
  watch: {
    initValue(val) {
      if (!this.allowInput) {
        this.inputLabel = val;
      }
    },
    reshowInput(val) {
      this.inputLabel = val;
    },
  },
  mounted() {
    if (this.allowInput) {
      this.inputLabel = this.value;
    }
  },
  methods: {
    cancel() {
      this.treeVisible = false;
      this.$emit('cancelSelect');
    },
    inputChange(val) {
      if (!val) {
        this.$refs.searchOrgTree.onSelect(null);
      }
    },
    /**
     * 可手动设置inputLabel的值
     * @param val
     */
    setInitLabel(val) {
      this.inputLabel = val;
    },
    changeInput(e) {
      if (this.allowInput) {
        this.$emit('change', e.target.value);
        this.inputLabel = e.target.value;
      }
    },
    clickInput() {
      if (!this.allowInput) {
        this.openModal();
      }
    },
    openModal() {
      this.treeVisible = true;
    },
    handleTreeChange(checkData) {
      this.inputLabel = checkData.namePath;
      if (this.allowInput) {
        this.$emit('change', checkData.orgName);
      } else {
        this.$emit('change', checkData.orgId);
      }
      this.$emit('close', checkData);
    },
  },
};
</script>
<style lang="less">
.project-search-tree-modal {
  .ant-tabs-nav .ant-tabs-tab {
    padding: 12px 16px 12px 0px;
  }

  .ant-tabs {
    padding: 0px;
  }

  .custom-tree-node {
    width: 100%;
  }

  .no-authority {
    float: right;
    color: @disabled-color;
    font-size: 12px;
    cursor: not-allowed;
  }
}
</style>
