export default {
  /**
   * 获取当前域名+base的地址
   * @returns
   */
  getBaseURL: () => {
    const isProduction = process.env.NODE_ENV === "production";
    let baseURL;

    if (isProduction) {
      // 生产环境使用location.origin加上VITE_LOGIN_SYS_BASE_SORT的环境变量
      baseURL = `${location.origin}${process.env.VITE_LOGIN_SYS_BASE_SORT}`;
    } else {
      // 非生产环境使用location.origin
      baseURL = location.origin;
    }

    return baseURL;
  },
  /**
   * 原始数据数组和需要筛选的字段名称数组。这个函数将转换字段名称数组中的值，将下划线转换为空间，并检查这些值是否与原始数据中每个对象的 engName 属性匹配。如果匹配，它会将字段名称映射到对应的 sortValue。
   * @param originalData
   * @param fieldsToMap
   * @returns
   */
  mapDicomTagsToValues(originalData, fieldsToMap) {
    // 创建一个结果对象
    const result = {};

    // 遍历字段名称数组
    fieldsToMap.forEach((field) => {
      // 将下划线转换为空间，以匹配原始数据中的 engName
      const normalizedFieldName = field.replace(/_/g, " ");

      // 遍历原始数据数组
      originalData.forEach((item) => {
        // 检查当前字段名称是否与原始数据的 engName 属性匹配
        if (item.engName === normalizedFieldName) {
          // 如果匹配，将字段名称添加到结果对象，并设置对应的 sortValue
          result[field] = item.sortValue;
        }
      });
    });

    // 返回结果对象
    return result;
  },
  /**
   * readDicomTags输出格式转换为系统用json
   * @param dicomData
   * @returns
   */
  async convertDicomTags(dicomData, dicomTagsDescriptions) {
    // debugger
    // 验证dicomData和dicomData.tags的有效性
    if (!dicomData || !dicomData.tags || !Array.isArray(dicomData.tags)) {
      throw new Error("Invalid DICOM data format.");
    }

    // 遍历dicomData.tags数组
    return dicomData.tags.map((tag) => {
      if (!Array.isArray(tag) || tag.length !== 2) {
        throw new Error(
          "Invalid tag format. Each tag should be an array with two elements.",
        );
      }

      const [code, value] = tag;
      const description = dicomTagsDescriptions[code]; // 根据code获取描述对象

      // 检查description对象是否存在，如果存在，使用对应的eng和chn值
      const engName = description ? description.eng : code; // 获取英文名称或使用code
      const chnContent = description ? description.chn : "无对应中文解释"; // 获取中文名称或默认值

      // 返回结果对象
      return { code, engName, sortValue: value, chnContent };
    });
  },
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
    axialIndex,
  }) => {
    // 计算新的中心点
    const newCenter = imageData.indexToWorld([
      sagittalIndex,
      coronalIndex,
      dimensions[2] - axialIndex,
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
    data.forEach((item) => {
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
    // 捕获当前的 this 引用
    const that = this;

    // 定义递归处理函数
    const process = (arrayOrObject) => {
      let newData = {};
      // console.log("Array.isArray(arrayOrObject)", Array.isArray(arrayOrObject))
      // 检查是否为数组
      if (Array.isArray(arrayOrObject)) {
        // 递归处理数组中的每个元素
        return arrayOrObject.map((item, index) => {
          // console.log("item,index----", "arrayOrObject", arrayOrObject, item, index);

          return process(item);
        });
      } else if (typeof arrayOrObject === "object") {
        // 检查是否为对象
        // 递归处理对象的每个属性
        // const newData = {};
        for (const key in arrayOrObject) {
          newData[key] = process(arrayOrObject[key]);
        }
        // 应用自定义数据
        for (const customKey in customData) {
          // console.log("customKey=", customKey)
          // 如果newData中已有该属性，则添加下划线前缀备份原属性
          if (newData.hasOwnProperty(customKey)) {
            newData[`_${customKey}`] = newData[customKey];
          }
          // 调用customData中的函数来设置属性值
          const customValue = customData[customKey](that, newData);
          // debugger;
          if (customValue !== undefined && customValue !== "") {
            //不产生多层数据
            // if (customValue !== undefined) { //产生多层数据，用于显式查看数据层是否处理，debug用
            newData[customKey] = customValue;
          }
        }
        return newData;
      } else {
        // 基本数据类型直接返回
        return arrayOrObject;
      }
    };
    // 开始递归处理
    return process(data);
  },
  // 辅助函数，用于递归搜索属性值<暂时搁置~待调整>
  searchDeep(obj, property) {
    if (obj.hasOwnProperty(property) && obj[property] !== "") {
      return obj[property];
    }
    if (typeof obj === "object") {
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
      // 初始化表格项
      // 如果json-Array有多次出现属性值，则最终覆盖之后处理的那个~
      const tableItem = {};

      // 定义一个辅助函数来递归搜索属性
      const findPropertyValue = (obj, property) => {
        if (obj.hasOwnProperty(property) && obj[property] !== "") {
          return obj[property];
        }
        if (Array.isArray(obj)) {
          for (const subItem of obj) {
            const value = findPropertyValue(subItem, property);
            if (value !== undefined) {
              return value;
            }
          }
        } else if (typeof obj === "object") {
          for (const key of Object.keys(obj)) {
            const value = findPropertyValue(obj[key], property);
            if (value !== undefined) {
              return value;
            }
          }
        }
        return undefined;
      };

      // 遍历propertiesToSearch中的每个属性，并尝试找到它们的值
      propertiesToSearch.forEach((property) => {
        const value = findPropertyValue(item, property);
        if (value !== undefined) {
          tableItem[property] = value;
        }
      });

      // 如果找到了属性值，构建表格项并添加到结果数组中
      if (Object.keys(tableItem).length > 0) {
        tableData.push({
          ...item.ctMeasures, // 包括ctMeasures中的属性
          boxIndex: item.boxIndex,
          risk: item.riskCode.toString(), // 转换风险代码为字符串
          volume: item.volume.toString(), // 确保体积是字符串格式
          lobe: item.lobe, // 包括叶段信息
          lobeSegment: item.lobeSegment, //肺段
          type: item.type, //结节类型
          ...tableItem, // 展开找到的属性
        });
      }
    });

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
        } else if (typeof item === "object") {
          // 如果当前项是对象，则递归搜索对象的每个属性
          accumulator[property] = searchProperties(item[property])[property];
        }
        return accumulator;
      }, {});
    }

    // 处理传入的数据
    return data.map((item) => {
      const filledItem = { ...item }; // 复制原始数据以避免直接修改
      propertiesToSearch.forEach((property) => {
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
  },
};
