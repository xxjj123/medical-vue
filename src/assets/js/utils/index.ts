export default {
  /**
   * @auther fangh
   * 转换世界坐标为画布坐标中心点的IM值
   * @param {*} param0
   *        imageData,
            dimensions,空间尺寸
            sagittalIndex,矢状面
            coronalIndex,冠状面
            axialIndex,轴面
   * @returns
   */
  setWidgetCenterFromIJK: ({
    imageData,
    dimensions,
    sagittalIndex,
    coronalIndex,
    axialIndex
  }) => {

    // 计算新的中心点
    const newCenter = imageData.indexToWorld([
      sagittalIndex,
      coronalIndex,
      dimensions[2] - axialIndex
    ]);


    return newCenter;
  },
  /**
   * 转换dict为ta-select用
   * name to label
   * @param data
   * @returns
   */
  serializeDropdownList: (data) => {
    // 创建一个空数组来存储序列化后的对象
    const serializedList = [];

    // 遍历传入的对象数组
    data.forEach((item) => {
      // 创建一个新的对象来存储序列化的数据
      const serializedItem = {
        label: item.name, // 后端的label字段
        value: item.value, // 后端的value字段
      };

      // 将序列化的对象添加到数组中
      serializedList.push(serializedItem);
    });

    // 返回序列化后的数组
    return serializedList;
  }

}
