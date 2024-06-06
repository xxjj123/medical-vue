import selectMultiple from '@projectCommon/components/selectMultiple.vue';
import { defineComponent, type VNode, h, getCurrentInstance, toRefs } from 'vue';
import { isObject, isString, uuidV4 } from '@yh/ta-utils';
import './style/renderFormItem.less';

export const RENDER_TYPE = {
  ADD: 'ADD',
  EDIT: 'EDIT',
  SHOW: 'SHOW',
  DETAIL: 'DETAIL',
};
// 2024-1-17 update: 修改为render函数.使用setup函数可以避免renderFormItem的多次反复渲染.但是在某些页面(例如人员账号管理)中,连续两次查看不同人员的信息时会导致第2(+)次显示的信息始终是第一次的信息.
//  这个问题可以通过修改renderFormItem标签的key来解决,但是,这样解决之后又有可能出现一些意料之外的内存泄漏的问题
export default defineComponent({
  components: { selectMultiple },
  props: {
    renderType: {
      type: String,
      default: RENDER_TYPE.ADD,
    },
    renderProp: {
      type: Object,
      default: () => {
        return {};
      },
    },
    showValues: {
      type: Object,
      default: () => {
        return {};
      },
    },
    simpleShowSlot: {
      type: Array,
      default: () => {
        return [];
      },
    },
    formSetting: {
      required: true,
      type: Object,
      default: () => {
        return {};
      },
    },
    isShowParentItem: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, ctx) {
    const { formSetting, showValues, simpleShowSlot, renderType, renderProp, isShowParentItem } =
      toRefs(props);
    const { slots } = ctx;
    const $vm = getCurrentInstance()?.proxy;
    // 获取formSetting中需要的属性
    const {
      formId: formItemId = '',
      label: formLabel,
      formItem,
      decoratorOptions,
      formItemLayout,
      display,
      disabled,
      placeholder,
    } = formSetting.value;

    // 转换form-item的rules
    if (decoratorOptions && decoratorOptions.rules) {
      const { rules } = decoratorOptions;
      rules.forEach((item: Record<string, unknown>) => {
        if (item.type === 'number') {
          // @ts-expect-error
          item.transform = (value) => {
            return Number(value);
          };
          item.message = '请输入数字';
        }
      });
    }

    // 处理隐藏等class
    let _class = formSetting.value.class || '';
    if (!display) {
      _class += ' displayNone';
    }
    if (formSetting.value.formId === 'pResourceName' && !isShowParentItem.value) {
      _class += ' displayNone';
    }

    const { collection } = formItem;

    const getScopedSlots = (name: string) => {
      // 首先获得具名的插槽
      // 否则就回退到default上
      return slots[name] ?? slots.default;
    };

    const buildItemShowContext = (type: string) => {
      const slot = slots.default;
      const val = showValues.value[formItemId];
      switch (type) {
        case 'slot':
          return simpleShowSlot.value.indexOf(formItemId) === -1 ? slot?.() || val : val;
        case 'select':
        case 'radio':
        case 'radioButton':
          // @ts-expect-error
          return $vm?.CollectionLabel(formItem.collection, val);
        case 'select-multiple':
          return isString(val)
            ? val
                .split(',')
                // @ts-expect-error
                .map((value) => $vm?.CollectionLabel(formItem.collection, value))
                .join(',')
            : val;
        case 'sensitive-input':
          // eslint-disable-next-line no-case-declarations
          const objVal: Record<string, unknown> = isString(val) ? JSON.parse(val) : val;
          return isObject(objVal) ? objVal.sensitiveField : val;
        default:
          return val;
      }
    };
    const buildItemContext = (type: string): VNode => {
      const slot = getScopedSlots(formItemId);
      switch (type) {
        case 'slot':
          // @ts-expect-error
          return slot?.();
        case 'select':
          return h('ta-select', {
            props: {
              placeholder,
              disabled,
              allowClear: true,
              collectionType: collection,
            },
          });
        // return (
        //   <ta-select
        //     placeholder={placeholder}
        //     disabled={disabled}
        //     allowClear={true}
        //     collection-type={formItem.collection}
        //   ></ta-select>
        // );
        case 'select-multiple':
          return h('select-multiple', {
            props: {
              placeholder,
              collection: formItem.collection,
              disabled,
              allowClear: true,
            },
          });
        // return (
        //   <select-multiple
        //     placeholder={placeholder}
        //     collection={formItem.collection}
        //     disabled={disabled}
        //     allowClear={true}
        //   ></select-multiple>
        // );
        case 'radio':
          return h('ta-radio-group', {
            props: {
              disabled,
              collectionType: formItem.collection,
            },
          });
        // return (
        //   <ta-radio-group
        //     disabled={disabled}
        //     collection-type={formItem.collection}
        //   ></ta-radio-group>
        // );
        case 'radioButton':
          // @ts-expect-error
          // eslint-disable-next-line no-case-declarations
          const children = $vm.CollectionData(formItem.collection)?.map(({ label, value }) => {
            return h(
              'ta-radio-button',
              {
                props: {
                  key: value,
                  value,
                },
              },
              [label],
            );
          });
          return h(
            'ta-radio-group',
            {
              props: {
                buttonStyle: 'solid',
                disabled,
              },
              class: 'label',
            },
            [children],
          );
        // return (
        //   <ta-radio-group class="lalal" buttonStyle="solid" disabled={disabled}>
        //     {this.CollectionData(formItem.collection)?.map(({ label, value }) => (
        //       <ta-radio-button key={value} value={value}>
        //         {label}
        //       </ta-radio-button>
        //     ))}
        //   </ta-radio-group>
        // );
        case 'sensitive-input':
          return h('ta-sensitive-input', {
            props: {
              inputKey: formItemId,
              placeholder,
              description: formLabel,
              authUser: renderType.value === RENDER_TYPE.EDIT,
              authRequest: renderProp.value.authRequest,
            },
          });
        // return (
        //   <ta-sensitive-input
        //     inputKey={formItemId}
        //     placeholder={placeholder}
        //     description={formLabel}
        //     auth-user={renderType === RENDER_TYPE.EDIT}
        //     authRequest={renderProp.authRequest}
        //   />
        // );
        default:
          return h('ta-input', {
            props: {
              placeholder,
              disabled,
              autocomplete: 'off',
            },
          });
        // return <ta-input placeholder={placeholder} disabled={disabled} autocomplete="off" />;
      }
    };

    const baseFormItemProps: Record<string, unknown> = {
      props: {
        label: formLabel,
        labelCol: formItemLayout.labelCol,
        wrapperCol: formItemLayout.wrapperCol,
        fieldDecoratorId: formItemId,
        fieldDecoratorOptions: decoratorOptions,
      },
      class: _class,
    };

    const renderShow = () => {
      return h(
        'ta-form-item',
        {
          ...baseFormItemProps,
        },
        [buildItemShowContext(formItem.type)],
      );
      // return (
      //   <ta-form-item
      //     label={formLabel}
      //     className={_class}
      //     labelCol={formItemLayout.labelCol}
      //     wrapperCol={formItemLayout.wrapperCol}
      //     fieldDecoratorId={formItemId}
      //     fieldDecoratorOptions={decoratorOptions}
      //   >
      //     {buildItemShowContext(formItem.type)}
      //   </ta-form-item>
      // );
    };

    const renderDetail = () => {
      return h('ta-form-item', {
        ...baseFormItemProps,
        scopedSlots: {
          detail: ({ value, id, label }) => {
            const v = value ?? decoratorOptions.initialValue;

            const formItemDetail = `${formItemId}Detail`;
            const detailSlot = getScopedSlots(formItemDetail);
            if (detailSlot) {
              return detailSlot?.({
                value: v,
                id,
                label,
              });
            }

            if (collection) {
              return h(
                'span',
                {
                  style: {
                    margin: '0',
                    padding: '4px 11px',
                  },
                },
                $vm.CollectionLabel(collection, v),
              );
            }
            return h(
              'span',
              {
                style: {
                  margin: '0',
                  padding: '4px 11px',
                },
              },
              v,
            );
          },
        },
      });
      // return (
      //   <ta-form-item
      //     label={formLabel}
      //     class={_class}
      //     labelCol={formItemLayout.labelCol}
      //     wrapperCol={formItemLayout.wrapperCol}
      //     fieldDecoratorId={formItemId}
      //     fieldDecoratorOptions={decoratorOptions}
      //     {...detailSlot}
      //   ></ta-form-item>
      // );
    };

    const renderEditAndAdd = () => {
      return h(
        'ta-form-item',
        {
          ...baseFormItemProps,
        },
        [buildItemContext(formItem.type)],
      );
      // return (
      //   <ta-form-item
      //     label={formLabel}
      //     class={_class}
      //     labelCol={formItemLayout.labelCol}
      //     wrapperCol={formItemLayout.wrapperCol}
      //     fieldDecoratorId={formItemId}
      //     fieldDecoratorOptions={decoratorOptions}
      //   >
      //     {buildItemContext(formItem.type)}
      //   </ta-form-item>
      // );
    };

    return () => {
      const rt = renderType.value;
      if (rt === RENDER_TYPE.SHOW) {
        return renderShow();
      } else if (rt === RENDER_TYPE.ADD || rt === RENDER_TYPE.EDIT) {
        return renderEditAndAdd();
      } else if (rt === RENDER_TYPE.DETAIL) {
        return renderDetail();
      } else {
        return null;
      }
    };
  },
});
