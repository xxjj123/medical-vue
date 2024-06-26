/* eslint-disable dot-notation */
// @ts-expect-error
import {openTabMenu, closeTabMenu, pageMask, reload} from '@yh/ta404-ui/es/utils/js/window.util';
import '@yh/ta-utils/crossDomain';

window['Base'] = {
  ...(window['Base'] ?? {}),
  openTabMenu,
  closeTabMenu,
  pageMask,
  reload,
};
