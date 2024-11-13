class ViewData {
  constructor() {
    this.viewIndex = null;
    this.viewName = null;
    this.pageIndex = null;
    this.dimension = null;
    this.gotoPageIndex = null;
    this.changedPageIndex = null;
    this.displayX = null;
    this.displayY = null;
    this.scaleLength = null;
    this.Ww = null;
    this.Wl = null;
    this.reversed = false;
    this.cameraRotate = 0;
    this.hu = "";
  }

  // 恢复初始值的方法
  resetToInitial() {
    Object.assign(this, new ViewData());
  }

  // 从另一个 ViewData 实例赋值
  copyFrom(viewDataInstance) {
    if (viewDataInstance instanceof ViewData) {
      Object.assign(this, viewDataInstance);
    } else {
      console.error("参数必须是一个 ViewData 实例");
    }
  }
}

class AllViewData {
  constructor() {
    this.colorWindow = null;
    this.colorLevel = null;
    this.isPan = false;
    this.layOut = null;
    this.preLayOut = null;

    this.isRecon = false;
    this.zoomView = null;

    this.buttons =[]
    this.activeButtons =[]

  }

  // 恢复初始值的方法
  resetToInitial() {
    Object.assign(this, new AllViewData());
  }

  // 从另一个 AllViewData 实例赋值
  copyFrom(allViewDataInstance) {
    if (allViewDataInstance instanceof AllViewData) {
      Object.assign(this, allViewDataInstance);
    } else {
      console.error("参数必须是一个 AllViewData 实例");
    }
  }
}

class  ViewRenderer {
  constructor() {


    this.renderer = null; // 设置 renderer 为 null
    this.image = null; // 初始化 image
    this.sliceMapper = null; // 设置 sliceMapper 为 null
    this.sliceActor = null; // 设置 sliceActor 为 null
    this.viewIndex = null
    this.pageIndex = null
  }

  // 恢复初始值的方法
  resetToInitial() {
    Object.assign(this, new ViewRenderer());
  }

  // 从另一个 AllViewData 实例赋值
  copyFrom(allViewDataInstance) {
    if (allViewDataInstance instanceof ViewRenderer) {
      Object.assign(this, allViewDataInstance);
    } else {
      console.error("参数必须是一个 AllViewData 实例");
    }
  }
}


class NoduleOperate {
  constructor() {
    this.computeSeriesId = null;
    this.lesionOrderType = null;
    this.riskFilter = null;
    this.typeFilter = null;
    this.majorAxisSelectFilter = null;
    this.majorAxisScopeFilter = null;
    this.findingOrderType = null;
    this.diagnosisType = null;

  }

  // 恢复初始值的方法
  resetToInitial() {
    Object.assign(this, new NoduleOperate());
  }

  // 从另一个 AllViewData 实例赋值
  copyFrom(allViewDataInstance) {
    if (allViewDataInstance instanceof NoduleOperate) {
      Object.assign(this, allViewDataInstance);
    } else {
      console.error("参数必须是一个 AllViewData 实例");
    }
  }
}

// 导出 ViewData 和 AllViewData 类
export { ViewRenderer,ViewData, AllViewData,NoduleOperate };
