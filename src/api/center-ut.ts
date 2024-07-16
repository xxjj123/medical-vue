import {
  Vue,
  store,
} from "@common/js/public-ant-modules";

const instance = Vue.prototype;


export function select_codeTable_type_group(type) { //返回码表固定type值的数组
  return new Promise((resolve, reject) => {
    let vuexData = localStorage.getItem('carplay')
    console.log("ins---vuexData:", vuexData, type);
    const vData = JSON.parse(vuexData)
    const {sysInfoOther} = vData
    if (sysInfoOther) {
      let group = sysInfoOther.filter((v, k) => {
        console.log("v----", v, "k---", k);

        return v.type === type
      })
      console.log("group", group);

      resolve(group)
    } else {
      reject()
    }

  })
}
/**
 * 直接返回scanSite
 * @returns
 */
export function query_humen_boot_data() {
  return new Promise((resolve, reject) => {
    try {
      let vuexData = localStorage.getItem('carplay')
      const humenData = vuexData.scanSite;
      if (humenData) {
        resolve(humenData)
      } else {
        resolve([])
      }
    } catch (error) {
      reject(error)
    }
  })
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
  const pathArray = path.split('.');

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
  return currentObject.filter(item => item.value === searchValue);
}
