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
   * 计算中心点 IM
   * @param data 数据源
   * @param key 键名
   * @param operation 运算函数
   * @returns
   */
  operation_IM(data, key, operation) {
    // 初始化最大值和最小值为第一个对象对应属性的值
    let max = data[0][key];
    let min = data[0][key];

    // 遍历数据源，更新最大值和最小值
    data.forEach(item => {
      if (item[key] > max) {
        max = item[key];
      }
      if (item[key] < min) {
        min = item[key];
      }
    });

    // 计算最大值和最小值之和除以 2 的结果
    const sum = (max + min) / 2;

    // 根据传入的运算函数处理结果
    return operation(sum);
  },
  /**
   * 你可以创建一个工具函数来遍历JSON对象，
   * 并根据你提供的规则修改属性名。
   * 下面是一个示例函数，
   * 它接受两个参数：jsonData（要遍历的JSON对象）和customData（要添加的自定义数据）。
   * 如果JSON对象中的属性名与customData中的属性名冲突，
   * 它会在原属性名前添加下划线_。
   * 策略组合处理
   * @param jsonData
   * @param customData
   * @returns
   */
  customizeJson(data, customData) {
    const that = this; // 捕获当前的 this 引用
    const process = (arrayOrObject) => {
      if (Array.isArray(arrayOrObject)) {
        // 递归处理数组
        return arrayOrObject.map(item => process(item));
      } else if (typeof arrayOrObject === 'object' && arrayOrObject !== null) {
        // 递归处理对象
        const newData = {};
        for (const key in arrayOrObject) {
          newData[key] = process(arrayOrObject[key]);
        }
        // 应用自定义数据
        for (const customKey in customData) {
          if (newData.hasOwnProperty(customKey)) {
            newData[`_${customKey}`] = newData[customKey];
          }
          newData[customKey] = customData[customKey](that, newData);
        }
        return newData;
      }
      return arrayOrObject; // 基本数据类型直接返回
    };

    return process(data);
  },
  // 辅助函数，用于递归搜索属性值
  searchDeep(obj, property) {
    if (obj.hasOwnProperty(property) && obj[property] !== "") {
      return obj[property];
    }
    if (typeof obj === 'object') {
      for (const key of Object.keys(obj)) {
        const value = this.searchDeep(obj[key], property);
        if (value !== undefined) {
          return value;
        }
      }
    }
    return undefined;
  },
  transformData(jsonData, propertiesToSearch) {
    const tableData = [];

    jsonData.forEach((item) => {
      const tableItem = {}; // 初始化表格项

      propertiesToSearch.some((property) => { // 使用some来提前退出循环
        let value = item[property]; // 尝试获取属性值

        // 检查值是否存在且不为空字符串
        if (value !== undefined && value !== "") {
          tableItem[property] = value; // 赋值到表格项
          return true; // 存在则退出some循环
        }

        // 如果当前项是数组或对象，则递归搜索
        if (Array.isArray(item) || (typeof item === 'object' && item !== null)) {
          for (const key in item) {
            if (item.hasOwnProperty(key)) {
              value = this.searchDeep(item[key], property);
              if (value !== undefined) {
                tableItem[property] = value;
                return true; // 找到值则退出some循环
              }
            }
          }
        }

        return false; // 继续检查下一个属性
      });

      // 仅当表格项有值时添加到结果数组
      if (Object.values(tableItem).length > 0) {
        tableData.push({
          ...tableItem, // 展开属性
          ...item.ctMeasures, // 假设您还想包括ctMeasures中的属性
          risk: item.riskCode.toString(), // 转换风险代码为字符串
          volume: item.volume.toString(), // 确保体积是字符串格式
          lobe: item.lobe // 包括叶段信息
        });
      }
    });
    debugger;
    console.log("tableItem++++", tableItem);


    return tableData;
  },
  /**
   * 提取bigtable专用格式数据
   * @param data
   * @param propertiesToSearch
   * @returns
   */
  fillMissingValues(data, propertiesToSearch) {
    // 定义一个辅助函数来递归搜索属性
    function searchProperties(item) {
      return propertiesToSearch.reduce((accumulator, property) => {
        const value = item[property];
        const hasValue = value !== undefined && value !== ""; // 检查值是否已定义且不为空字符串

        // 如果当前项有该属性且值不为空，则使用该值
        if (hasValue) {
          accumulator[property] = value;
        } else if (Array.isArray(item)) {
          // 如果当前项是数组，则递归搜索数组中的每个元素
          accumulator[property] = item.reduce((arrAccumulator, arrayItem) => {
            const result = searchProperties(arrayItem);
            return arrAccumulator.concat(result[property] || []);
          }, []);
        } else if (typeof item === 'object') {
          // 如果当前项是对象，则递归搜索对象的每个属性
          accumulator[property] = searchProperties(item[property])[property];
        }
        return accumulator;
      }, {});
    }

    // 处理传入的数据
    return data.map(item => {
      const filledItem = {...item}; // 复制原始数据以避免直接修改
      propertiesToSearch.forEach(property => {
        // 使用辅助函数搜索每个属性，并填充值
        filledItem[property] = searchProperties(item)[property];
      });
      return filledItem;
    });
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
