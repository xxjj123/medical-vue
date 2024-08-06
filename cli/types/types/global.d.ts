import type { ModalConfirm, ModalOptions } from '@yh/ta404-ui/types/modal';
import type { message } from '@yh/ta404-ui';
import type * as TaUtils from '@yh/ta-utils/index.esm';

interface UiBase {
  showMask: Function;
  pageMask: Function;
  submit: Function;
  openTabMenu: unknown;
  closeTabMenu: unknown;
  reload: unknown;
}
declare global {
  interface Window {
    Modal: {
      info(options: ModalOptions): ModalConfirm;
      success(options: ModalOptions): ModalConfirm;
      error(options: ModalOptions): ModalConfirm;
      warning(options: ModalOptions): ModalConfirm;
      confirm(options: ModalOptions): ModalConfirm;
    };
    TaUtils: Partial<typeof TaUtils>;
    Base: Partial<typeof TaUtils> & Partial<UiBase>;
    message: typeof message;
    pageVmObj: unknown;
    faceConfig: unknown;
  }
}
