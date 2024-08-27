import {Vue, store} from "@common/js/public-ant-modules";

const instance = Vue.prototype;

export function select_codeTable_type_group(type) {
  //返回码表固定type值的数组
  return new Promise((resolve, reject) => {
    let vuexData = localStorage.getItem("carplay");
    // console.log("ins---vuexData:", vuexData, type);
    const vData = JSON.parse(vuexData);
    const {sysInfoOther} = vData;
    if (sysInfoOther) {
      let group = sysInfoOther.filter((v, k) => {
        // console.log("v----", v, "k---", k);

        return v.type === type;
      });
      // console.log("group", group);

      resolve(group);
    } else {
      reject();
    }
  });
}
/**
 * 直接返回scanSite
 * @returns
 */
export function query_humen_boot_data() {
  return new Promise((resolve, reject) => {
    try {
      let vuexData = localStorage.getItem("carplay");
      const humenData = JSON.parse(vuexData).scanSite;
      // debugger
      if (humenData) {
        resolve(humenData);
      } else {
        resolve([]);
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 处理lung-结节项目-相关json字段，其它情况不做处理，返回数据本源
 * @param dataSource
 * @param keys
 * @param subKeyName lung 下层的索引 切换不同的查询组合
 * @returns
 */
export async function processLungItems(dataSource, keys, subKeyName = 'segments') {
  // 假设 this.$api.findObjectByValue 和 query_humen_boot_data 已经定义在组件中
  const processedItems = dataSource.map(item => {
    // 首先获取基础数据
    const baseData = {...item};

    // 然后根据提供的 keys 处理每个字段
    keys.forEach(async key => {
      if (key in item) {
        const value = item[key];
        console.log("value=", value);

        const itemData = await query_humen_boot_data(); // 假设这是异步操作，这里先同步调用
        console.log("itemData==", itemData);
        const pathStr = `lung.${subKeyName}`;
        console.log("pathStr=", pathStr);

        const rowSelectItem = findObjectByValue(itemData, pathStr, value.toString())[0];
        console.log("rowSelectItem-->", rowSelectItem);
        if (rowSelectItem) {
          baseData[key] = rowSelectItem; // 将处理结果赋值回 baseData 对象
        }
      }
    });

    return baseData;
  });

  return processedItems;
}

/**
 *
 * 查询 dict ，返回部位对应的 结节类型数据
 * @param dataSource
 * @param path
 * @param searchValue
 * @returns
 */
export function findObjectByValue(dataSource, path, searchValue) {
  // 将路径字符串转换为数组
  const pathArray = path.split(".");

  // 使用 reduce 方法遍历路径数组
  let currentObject = dataSource;
  for (const key of pathArray) {
    // 检查当前对象是否包含路径中的键
    if (currentObject.hasOwnProperty(key)) {
      // 更新当前对象为路径中的下一个对象
      currentObject = currentObject[key];
    } else {
      // 如果路径中的键不存在，返回undefined
      return undefined;
    }
  }

  // 过滤出 value 等于 searchValue 的对象
  return currentObject.filter((item) => item.value === searchValue);
}

/**
 * 返回指定属性的array内容
 * @param dataSource [Property].[Property].[Property] ...
 * @param path
 * @returns
 */
export function getPropertyArray(dataSource, path) {
  // 将路径字符串转换为数组
  const pathArray = path.split(".");

  // 使用 reduce 方法遍历路径数组
  let currentObject = dataSource;
  for (const key of pathArray) {
    // 检查当前对象是否包含路径中的键
    if (
      currentObject !== undefined &&
      currentObject !== null &&
      currentObject.hasOwnProperty(key)
    ) {
      // 更新当前对象为路径中的下一个对象
      currentObject = currentObject[key];
    } else {
      // 如果路径中的键不存在，或者当前对象为 null 或 undefined，则返回空数组
      return [];
    }
  }

  // 如果最终对象不是数组，也返回空数组
  return Array.isArray(currentObject) ? currentObject : [];
}

/**
 * 返回肺部 左右 标记
 * @param attributes
 * @returns
 */
export function getLungSide(input) {
  // 检查输入是否为字符串
  if (typeof input !== "string") {
    console.warn("Warning: Input must be a string.");
    return;
  }
  // 检查字符串中是否包含 'right' 或 'left'
  if (input.includes("right")) {
    return "right";
  } else if (input.includes("left")) {
    return "left";
  } else {
    console.warn('Warning: String does not contain "right" or "left".');
    return;
  }
}
