/* eslint-disable dot-notation,no-unused-vars,@typescript-eslint/no-unused-vars */
import Vue from 'vue';
import {
  BorderLayout,
  Button,
  Col,
  ConfigProvider,
  containerMask,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Row,
  Spin,
  notification,
  Space,
} from '@yh/ta404-ui';
// @ts-expect-error
import formUtil from '@yh/ta404-ui/es/utils/js/form.util';
// @ts-expect-error
import { pageMask } from '@yh/ta404-ui/es/utils/js/window.util';

const { showMask } = containerMask['$mask'];

const uiUtils = {
  ...formUtil,
  showMask,
  pageMask,
  notification,
};

Vue.prototype.$message = message;
window['message'] = message;
Vue.prototype.$success = Modal.success;
Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$notification = notification;

window['Base'] = {
  ...uiUtils,
  ...(window['Base'] ?? {}),
};
