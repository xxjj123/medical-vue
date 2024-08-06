// 添加路由加载蒙层
const routeLoading = {
  show() {
    // 加载中显示loading组件
    Base.showMask({ show: true, text: 'loading...' });
  },
  resolve(resolve) {
    // 加载完成隐藏loading组件
    return (component) => {
      setTimeout(() => {
        Base.showMask({ show: false });
        resolve(component);
      }, 10);
    };
  },
};
export { routeLoading };
