import urlJson from './collect-api';
import {
  apiOps
} from './options';
const {
  api,
  api2
} = apiOps;

import axios from 'axios'
/**
 * TODO::这份文件的接口，先迎合-文佳搭建的spring-boot去返回，后续后端迁移至404后台写法，需改写~
 * ps：目前是从catch中才能捕获到值，先这么处理~
 * @param formData
 * @returns
 */

// 诊断分析
export const startDiagnose = (formData) => {
  return Base.submit(null, {
    url: api + urlJson['start-diagnose'],
    data: {
      ...formData
    }
  })
}


// 获取诊断结果
export const getDiagnoseResult = (applyId) =>
  Base.submit(null, {
    url: api + urlJson['get-diagnose-result'],
    urlParam: {
      applyId: applyId
    }
  })


// ===========================================


// 获取诊断列表

export const getExaminationList = (userId) => {
  return new Promise((resolve, reject) => {
    Base.submit(null, {
      url: api2 + urlJson['get-examination-list'],
      method: 'get',
      urlParam: {
        userId: userId
      }
    })
      .then(data => {
        console.log("list0000000000000000", data);
      }).catch(error => {
        console.log("err=================000000", error);
        resolve(error.data);
      })
  })
}
// axios.get(api2 + urlJson['get-examination-list'], {
//   params: {
//     applyId: applyId
//   }
// })


//获取诊断细节
// TODO: 不是404数据结构-异常特殊处理下，会进入catch，等后端重写后，重新接入。
export const getExaminationDetail = (applyId) => {

  return Base.submit(null, {
    url: api2 + urlJson['get-examination-detail'],
    method: 'GET',
    urlParam: {
      applyId: applyId
    }
  }).then(res => {
    return Promise.resolve(res.data);
  }).catch(err => {
    return Promise.resolve(err?.data);
  })
}
// Base.submit(null, {
//   url: api2 + urlJson['get-examination-detail'],
//   method: 'GET',
//   urlParam: {
//     applyId: applyId
//   },
//   // successCallback: (data) => {
//   //   console.log("successCallback-", data);

//   // },
//   // failCallback: (data) => {
//   //   console.log("failCallback--", data);

//   // },
//   // serviceCallback: (type, data) => {
//   //   console.log("serviceCallback---", type, data);

//   // },
//   // errorCallBack: (error) => {
//   //   console.log("errorCallBack----", error);

//   // }
// })


//上传诊断文件以及基础信息
export const uploadExamination = (formData) =>
  Base.submit(null, {
    url: api2 + urlJson['upload-examination'],
    data: {
      ...formData
    }
  })

function parseBlobToArray(blob) {
  // 假设 Blob 包含多个文件，并且您知道如何分割这些文件
  // 这里只是一个示例，实际的解析逻辑会根据您的文件格式和数据结构而变化

  // 创建一个 Blob 数组
  const blobArray = [];

  // 示例：将 Blob 分割为多个 Blob 对象
  // 假设文件之间有特定的分隔符或者每个文件有固定的大小
  const fileSize = 1024 * 1024; // 假设每个文件大小为 1 MB
  let offset = 0;

  while (offset < blob.size) {
    // 创建一个子 Blob
    const subBlob = blob.slice(offset, Math.min(offset + fileSize, blob.size));

    // 将子 Blob 添加到数组中
    blobArray.push(subBlob);

    // 更新偏移量
    offset += fileSize;
  }

  return blobArray;
}

function parseBlobToFiles_muil(blob) {
  // 假设 Blob 包含多个文件，并且您知道如何分割这些文件
  // 例如，您可能需要解析 Blob 的内容，找到文件的界限
  // 这里只是一个示例，实际的解析逻辑会根据您的文件格式和数据结构而变化

  // 创建一个 File 对象列表
  const files = [];

  // 示例：将 Blob 分割为多个文件
  // 假设文件之间有特定的分隔符或者每个文件有固定的大小
  const fileSize = 1024 * 1024; // 假设每个文件大小为 1 MB
  let offset = 0;

  while (offset < blob.size) {
    // 创建一个子 Blob
    const subBlob = blob.slice(offset, Math.min(offset + fileSize, blob.size));

    // 创建一个 File 对象
    const file = new File([subBlob], 'filename.ext', {type: 'application/octet-stream'});

    // 将 File 对象添加到列表中
    files.push(file);

    // 更新偏移量
    offset += fileSize;
  }

  return files;
}

export const readBlobAsArrayBuffer = async (blob) => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(blob);
  return new Promise((resolve, reject) => {
    reader.onload = function (event) {
      resolve(event.target.result);
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
}

//根据applyid获取文件
//上传诊断文件以及基础信息
export const getFile = (applyId) => {
  return new Promise((resolve, reject) => {
    Base.submit(null, {
      method: 'GET',
      autoQs: false,
      responseType: 'blob',
      // parseBigNumber: true,
      url: api2 + urlJson['get-file'],
      urlParam: {
        applyId: applyId
      },
      transformResponse: [(data) => {
        console.log("data===transformResponse=", data);
        return data;
        // 在这里处理下载的文件
        // 例如，你可以使用 File API 将二进制数据转换为文件
        // const url = window.URL.createObjectURL(new Blob([data]));
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', 'file.txt'); // 设置下载的文件名
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        // window.URL.revokeObjectURL(url);
      }]

    }, (data) => {
      // 解析 Blob 数据并创建 Blob 数组
      const blobArray = parseBlobToFiles(data);
      return blobArray;
    })
      .then(function (response) {
        // 处理成功的逻辑
        const blobArray = response.data; // 这里应该是一个 Blob 数组
        // 您可以在这里对 blobArray 进行进一步的处理
        console.log("response", response, "blobArray", blobArray);
        resolve(response);

      })
      .catch(function (error) {
        // 处理错误的逻辑
        console.log("处理错误的逻辑", err);
        reject(err);

      });
  })
}

/*  Base.downloadFile({
   method: 'get',
   fileName: 'get.pdf',
   url: api2 + urlJson['get-file'],
   options: {
     applyId: applyId
   }
 }) */



export const isExit = (studyInstanceUID) =>
  Base.submit(null, {
    url: api2 + urlJson['is-exit'],
    urlParam: {
      studyInstanceUID: studyInstanceUID
    }
  })
