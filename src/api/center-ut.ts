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
