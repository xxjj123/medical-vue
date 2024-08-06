// 表单页面enter换下一个输入框的
const fastEnterMixins = {
  mounted() {
    if (window.__completeEnterBind__) return;
    window.addEventListener('keydown', this.enterCallback);
    window.__completeEnterBind__ = true;
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.enterCallback);
    window.__completeEnterBind__ = false;
  },
  methods: {
    childrenHasClass(el, className) {
      return el.querySelectorAll(`.${className}`).length > 0;
    },
    hasClass(node, className) {
      if (node.classList) {
        return node.classList.contains(className);
      }
      const originClass = node.className;
      return ` ${originClass} `.indexOf(` ${className} `) > -1;
    },
    activeNodeList() {
      // 当前节点class
      return [
        'ant-select',
        'ant-input',
        'ant-checkbox-input',
        'ant-input-number-input',
        'ant-calendar-picker-input',
        'ant-cascader-picker',
      ];
    },
    formItemClassList() {
      return [
        '.ant-cascader-picker:not(.ant-cascader-picker-disabled)',
        '.ant-select:not(.ant-select-disabled)',
        '.ant-input:not(.ant-input-disabled)',
        '.ant-input-number-input',
      ];
    },
    filterClassList() {
      return ['ant-cascader-input'];
    },
    // 获取当前表单
    findCurForm(curNode) {
      if (!curNode) return '';
      if (this.hasClass(curNode, 'ant-form')) {
        return curNode;
      }

      return this.findCurForm(curNode.parentElement);
    },
    // 获取当前表单下可被激活的表单项
    findActivableFormItem(_form) {
      const form = _form;
      if (!form) return [];
      let nodeList = [];
      for (let i = 0, l = form.children.length; i < l; i++) {
        const formItem = form.children[i];
        if (this.isActivable(formItem)) {
          // 如果这个表单项是auto-complete
          if (this.childrenHasClass(formItem, 'ant-select-auto-complete')) {
            const target = formItem.querySelector('.ant-input:not(.ant-input-disabled)');
            if (target) {
              nodeList = [...nodeList, target];
            }
          } else {
            nodeList = [
              ...nodeList,
              ...formItem.querySelectorAll(this.formItemClassList().join(',')),
            ];
          }
        }
      }
      nodeList = nodeList.filter((node) => {
        const filterClass = this.filterClassList();
        for (let i = 0, l = filterClass.length; i < l; i++) {
          if (this.hasClass(node, filterClass[i])) {
            return false;
          }
        }
        return true;
      });
      return nodeList;
    },
    // 获取当前表单项
    findCurFormItem(el) {
      if (!el) return void 0;
      if (el.classList.contains('ant-calendar-picker')) {
        el = el.children[0];
      }
      const classList = this.activeNodeList();
      for (let i = 0; i < classList.length; i++) {
        if (this.hasClass(el, classList[i])) {
          return el;
        }
      }
      return this.findCurFormItem(el.parentElement);
    },
    isActivable(node) {
      return (
        !(node.hidden || node.getAttribute('hidden')) &&
        !(node.readOnly || node.getAttribute('readOnly')) &&
        !(node.disabled || node.getAttribute('disabled'))
      );
    },
    // 查找表单是否是在modal或者抽屉里,是的话返回modal或者drawer元素,不是返回undefined
    findModalOrDrawerByForm(form) {
      if (!form.parentElement) return void 0;
      if (
        this.hasClass(form.parentElement, 'ant-drawer') ||
        this.hasClass(form.parentElement, 'ant-modal-root')
      ) {
        return form.parentElement;
      }
      return this.findModalOrDrawerByForm(form.parentElement);
    },
    // 检查元素有没有被隐藏，只检测display:none的情况，其他忽略，需要再添加
    checkDisplay(el) {
      if (!el) return false;
      if (el.style.display === 'none' || getComputedStyle(el).display === 'none') {
        return true;
      }
      return this.checkDisplay(el.parentElement);
    },
    // 根据当前表单寻找可激活的表单
    findActivableForm(form) {
      let forms = [];
      const el = this.findModalOrDrawerByForm(form); // 找找看是不是弹窗或者抽屉里的表单
      if (el) {
        forms = [...el.querySelectorAll('.ant-form')].filter((filteredForm) => {
          return !this.checkDisplay(filteredForm);
        });
      } else {
        // 过滤掉弹窗或者抽屉里的表单 和display为none的
        forms = [...document.body.querySelectorAll('.ant-form')].filter((filteredForm) => {
          return !this.findModalOrDrawerByForm(filteredForm) && !this.checkDisplay(filteredForm);
        });
      }
      return forms;
    },
    //
    findVueComponent(vueComponent, componentTag) {
      if (!vueComponent) return '';
      if (
        vueComponent.$options._componentTag &&
        vueComponent.$options._componentTag === componentTag
      ) {
        return vueComponent;
      }
      return this.findVueComponent(vueComponent.$parent, componentTag);
    },
    // 获取相邻的表单
    getAdjoinForm(form) {
      let adjoinForm = [];
      const forms = this.findActivableForm(form);
      const index = forms.findIndex((item) => item === form);
      if (index > -1) {
        adjoinForm = [forms[index - 1], forms[index + 1]];
      }
      return adjoinForm;
    },
    formItemBlur(node) {
      if (!node) return;
      // 关闭树下拉选框弹框 " ant-cascader-picker-focused"
      if (node.classList.contains('ant-select-focused')) {
        node.classList.remove('ant-select-focused');
        node.classList.remove('ant-select-open');
        node['aria-expanded'] = false;
        let id;
        if (node.getAttribute('aria-controls')) {
          id = node.getAttribute('aria-controls');
        } else {
          id = node.children[0].getAttribute('aria-controls');
        }
        if (document.getElementById(id)) {
          document.getElementById(id).parentNode.style.display = 'none';
        }
      }
      if (this.hasClass(node, 'ant-cascader-picker')) {
        // 解决不选中最后一个子节点面板不收起
        const v = this.findVueComponent(node.__vue__, 'ta-cascader');
        try {
          v.handlePopupVisibleChange(false);
        } catch (e) {
          //
        }
      }
    },
    formItemFocus(node) {
      if (!node) return;
      if (node.classList.contains('ant-calendar-picker-input')) {
        if (node.tagName === 'SPAN') {
          node = node.parentNode;
        }
      }
      if (node.classList.contains('ant-select')) {
        node.classList.add('ant-select-focused');
        // 解决多选下拉设置焦点后 鼠标点击无法移除焦点样式
        node.addEventListener(
          'blur',
          () => {
            node.classList.remove('ant-select-focused');
          },
          { once: true },
        );
      }
      node.focus();
    },
    enterCallback(e) {
      // 不是回车或者是按ctrl+enter
      if (e.keyCode !== 13 || (e.keyCode === 13 && e.ctrlKey)) {
        return;
      }
      const curNode = this.findCurFormItem(document.activeElement);
      if (!curNode) return; // 不是表单的
      const curForm = this.findCurForm(curNode);
      const nodeList = this.findActivableFormItem(curForm);
      let nodeSequenceList = [];
      for (let i = 0, l = nodeList.length; i < l; i++) {
        if (curNode === nodeList[i]) {
          nodeSequenceList = [nodeList[i - 1], curNode, nodeList[i + 1]];
        }
      }
      if (!nodeSequenceList.length) return; // 当前元素没在当前表单可用的中
      let nextItem = e.shiftKey ? nodeSequenceList[0] : nodeSequenceList[2];
      // 跑到这儿没有下一个说明是最后一个或者第一个表单项
      // 按住shift 没有上一个说明是当前表单第一个元素,没有按住shift但是又没有下个元素，说明是当前最后一个寻找其他表单
      if (!nextItem) {
        const nextForm = e.shiftKey
          ? this.getAdjoinForm(curForm)[0]
          : this.getAdjoinForm(curForm)[1];
        const nextFormFormItems = this.findActivableFormItem(nextForm);
        nextItem =
          (e.shiftKey ? nextFormFormItems[nextFormFormItems.length - 1] : nextFormFormItems[0]) ||
          curNode;
      }
      this.formItemBlur(curNode);
      this.formItemFocus(nextItem);
      if (nextItem === curNode && this.hasClass(nextItem, 'ant-select')) {
        // 如果是最后一个并且是下拉 针对多选做添加聚焦样式
        setTimeout(() => {
          nextItem.classList.add('ant-select-focused');
        }, 300);
      }
    },
  },
};
export default fastEnterMixins;
