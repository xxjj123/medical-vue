import { getNowPageParam } from '@yh/ta-utils';
import Vue from 'vue';

const rePageMixins = {
  mounted() {
    const { rePageId } = getNowPageParam();
    // 判断页面是否有页面还原参数,如果有那么执行页面请求
    if (rePageId) {
      Base.submit(null, {
        url: 'review/getPageData',
        data: {
          pageId: rePageId,
        },
      }).then((res) => {
        this.setRePageData(JSON.parse(res.data.data));
      });
    }
  },
  methods: {
    /**
     * saveRePageData 获取页面页面还原数据并保存
     * @returns {Promise<string>} pageId 返回保存页面的id
     */
    async saveRePageData() {
      let pageId = '';
      // 获取data
      const reData = this.$data || {};
      // 获取表单数据
      const reForm = {};
      const formList = Object.keys(this).filter((item) => {
        return !!(
          item !== '_renderProxy' &&
          this[item] &&
          typeof this[item] === 'object' &&
          this[item].getFieldsMomentValue
        );
      });
      formList.forEach((item) => {
        reForm[item] = this[item].getFieldsMomentValue();
      });
      // 提交保存
      await Base.submit(null, {
        url: '/review/savePage',
        data: {
          data: JSON.stringify({
            reData,
            reForm,
          }),
        },
      })
        .then((res) => {
          pageId = res.data.pageId;
          this.$message.success('保存成功');
          // eslint-disable-next-line handle-callback-err
        })
        .catch(() => {
          this.message.error('保存失败');
        });
      return pageId;
    },
    // 页面还原
    setRePageData({ reData, reForm }) {
      // 设置data
      Object.keys(reData).forEach((item) => {
        this[item] = reData[item];
      });
      // 设置form
      Object.keys(reForm).forEach((item) => {
        this[item].setFieldsMomentValue({ ...reForm[item] });
      });
    },
    // 获取还原页面的src
    async getRePageUrl(pageId) {
      let src = '';
      await Base.submit(null, {
        url: 'review/getPageUrl',
        data: {
          pageId,
        },
      }).then((res) => {
        src = res.data.frontUrl;
        if (src.indexOf('?') > -1) {
          src += `&rePageId=${pageId}`;
        } else {
          src += `?rePageId=${pageId}`;
        }
      });
      return src;
    },
  },
};
// 所有组件不可用设置为不可用
Vue.prototype.setDisabled = (_vm) => {
  _vm.disabled = true;
};
Vue.mixin({
  mounted() {
    if (this.setDisabled && getNowPageParam() && getNowPageParam().rePageId) {
      this.setDisabled(this);
    }
  },
});
export default rePageMixins;
