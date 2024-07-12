<template>
  <ta-modal
    :visible="visible"
    :title="'选择' + name"
    :centered="true"
    :destroy-on-close="true"
    :mask-closable="false"
    :get-container="setContainer"
    :body-style="{ height: '500px', padding: '20px' }"
    :z-index="1001"
    @cancel="cancel"
    wrap-class-name="modal-specs modal-medium project-search-tree-modal"
  >
    <div class="fit" style="overflow: hidden">
      <ta-suggest
        :placeholder="'输入组织名称进行过滤'"
        :data-source="dataSource"
        :table-title-map="titleMap"
        :option-config="optionConfig"
        style="width: 100%; margin-bottom: 10px"
        @change="inputChange"
        @select="onSelect"
        @search="handleSearch"
      />
      <div style="height: calc(100% - 33px)">
        <ta-tabs class="fit">
          <ta-tab-pane :tab="name + '树'">
            <ta-e-tree
              class="search-tree-e-tree"
              ref="tree"
              v-show="treeDataFlag"
              :data="treeData"
              :load="loadOrgManData"
              show-checkbox
              highlight-current
              check-strictly
              :virtual="true"
              node-key="orgId"
              :props="defaultProps"
              lazy
              @check="handleCheckNodeChange"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                {{ data.orgName }}
                <span v-if="data.isAuthority === '0'">
                  <span
                    style="
                      float: right;
                      color: #ccc;
                      font-size: 12px;
                      cursor: not-allowed;
                    "
                    >无操作权限</span
                  >
                </span>
                <span v-if="data.disabled">
                  <span style="float: right; color: #ccc; font-size: 12px"
                    >该组织已选择</span
                  >
                </span>
              </span>
            </ta-e-tree>
            <ta-e-tree
              class="search-tree-e-tree"
              v-show="!treeDataFlag"
              ref="tree1"
              :data="treeData"
              highlight-current
              node-key="orgId"
              show-checkbox
              :props="defaultProps"
              :default-expand-all="true"
              check-strictly
              check-on-click-node
              :default-checked-keys="defaultCheckedKeys"
              @check-change="handleCheckNodeChange"
            />
          </ta-tab-pane>
        </ta-tabs>
      </div>
    </div>
    <div slot="footer" style="text-align: right">
      <ta-button type="primary" @click="fnConfirmNode"> 确定 </ta-button>
    </div>
  </ta-modal>
</template>

<script>
export default {
  name: "orgTree",
  props: {
    /** 弹框绑定的组件 */
    // eslint-disable-next-line vue/require-default-prop
    getContainerId: {
      type: String,
    },
    // 是否显示组织树模态框
    visible: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: "组织机构",
    },
    baseUrl: {
      type: String,
      default: "domain/orguserauth/orgCommonRestService",
    },
    // 单选/多选模式 single/multiple
    selectMode: {
      type: String,
      default: "single",
    },
    // 自定义节点选择行为函数，入参格式 (checked, treeNode, tree, selectMode)
    customCheckFun: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      url: `${this.$props.baseUrl}/getOrgByAsync`,
      expandKeys: [], // 默认展开的树节点
      defaultProps: {
        // 默认树属性
        children: "children",
        label: "orgName",
        isLeaf: "isLeaf",
        id: "orgId",
      },
      dataSource: [],
      titleMap: null,
      optionConfig: {
        value: "orgId",
        label: "orgName",
      },
      treeDataFlag: true,
      treeData: [],
      defaultCheckedKeys: [],
    };
  },
  watch: {
    visible(val) {
      if (val === true) {
        this.treeDataFlag = true;
      }
    },
  },
  created() {
    this.titleMap = new Map();
    this.titleMap.set("orgName", "组织名称");
    this.titleMap.set("namePath", "组织路径");
  },
  methods: {
    cancel() {
      this.$emit("cancelSelect");
      this.$emit("update:visible", false);
    },
    inputChange(val) {
      if (!val) {
        const data = {
          orgId: null,
          selfStr: "1",
        };
        this.getOrgByAsync(data, (dd) => {
          this.treeData = dd.data.orgTreeData;
        });
      }
    },
    setContainer() {
      return this.getContainerId
        ? document.getElementById(this.getContainerId)
        : document.body;
    },
    openModal() {
      this.$emit("update:visible", true);
      this.treeDataFlag = true;
    },
    // 过滤节点
    filterNode(value, data, node) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 处理节点点击事件
    handleCheckNodeChange(data, checked, indeterminate) {
      // 如果已经选中,则移除所有的选项,然后进行选中,如果取消选择,
      if (this.treeDataFlag) {
        const mgTree = this.$refs.tree;
        const treeNode = mgTree.getNode(data.orgId);
        const node = mgTree.getCheckedKeys();
        if (checked) {
          // 如果选中则进行提示
          if (data.isAuthority === "0") {
            this.$message.warning("您没有该组织的操作权限");
            mgTree.setChecked(data, false);
            return;
          }
          if (typeof this.customCheckFun === "function") {
            this.customCheckFun(checked, treeNode, mgTree, this.selectMode);
          } else if (this.selectMode === "single" && node.length >= 2) {
            for (let i = 0; i < node.length; i++) {
              if (node[i] !== data.orgId) {
                mgTree.setChecked(node[i], false, false);
              }
            }
          }
        }
      } else {
        const mgTree = this.$refs.tree1;
        const treeNode = mgTree.getNode(data.orgId);
        const node = mgTree.getCheckedKeys();
        if (checked) {
          // 如果选中则进行提示
          if (data.isAuthority === "0") {
            // this.$message.warning('您没有该组织的操作权限')
            // mgTree.setChecked(data, false)
            // return
          }
          if (typeof this.customCheckFun === "function") {
            this.customCheckFun(checked, treeNode, mgTree, this.selectMode);
          } else if (this.selectMode === "single" && node.length >= 2) {
            for (let i = 0; i < node.length; i++) {
              if (node[i] !== data.orgId) {
                mgTree.setChecked(node[i], false, false);
              }
            }
          }
        }
      }
    },
    // 点击确认选择节点
    fnConfirmNode() {
      let node = this.$refs.tree.getCheckedNodes();
      let checkData = this.$refs.tree.getCheckedNodes()[0];
      if (!this.treeDataFlag) {
        node = this.$refs.tree1.getCheckedNodes();
        checkData = this.$refs.tree1.getCheckedNodes()[0];
      }
      if (node.length < 1) {
        this.$message.warning("请选择组织", 2.5);
        return false;
      }
      if (this.selectMode === "single" && node.length >= 2) {
        this.$message.warning(
          "只能选择一个组织,或取消当前选择,再选择其他组织",
          2.5
        );
        return;
      }
      this.$emit("change", checkData);
      this.$emit("close", checkData);
      this.$emit("update:visible", false);
    },
    handleSearch(value) {
      if (value?.length) {
        Base.submit(
          null,
          {
            url: `${this.$props.baseUrl}/queryAllOrgByOrgId`,
            data: {
              param: value,
              needSearch: value.length ? "1" : "0",
            },
          },
          {
            successCallback: (data) => {
              this.dataSource = data.data.orgData;
            },
          }
        );
      } else {
        this.treeDataFlag = true;
      }
    },
    loadOrgManData(node, resolve) {
      const { orgId } = node.data;
      const data = {
        orgId,
      };
      this.getOrgByAsync(data, (dd) => {
        return resolve(dd.data.orgTreeData);
      });
    },
    onSelect(value, item, option) {
      this.treeDataFlag = false;
      const data = {
        orgId: value,
        selfStr: "1",
      };
      this.getOrgByAsync(data, (dd) => {
        const { orgTreeData } = dd.data;
        this.treeData = orgTreeData;
        if (value !== null) {
          this.defaultCheckedKeys = [value];
        }
      });
    },
    // 查询所有的组织权限
    getOrgByAsync(data, callBack) {
      Base.submit(
        null,
        { url: `${this.$props.baseUrl}/getOrgByAsync`, data },
        {
          successCallback: (d) => callBack(d),
        }
      );
    },
  },
};
</script>
<style scoped lang="less">
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
.search-tree-e-tree ::v-deep .el-tree-node:focus > .el-tree-node__content {
  background: transparent;
}
.search-tree-e-tree
  ::v-deep
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background: mix(@white, @primary-color, 92%);
}
</style>
