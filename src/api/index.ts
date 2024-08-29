import urlJson from "./collect-api";
import {apiOps, testDevOps} from "./options";
const {api, api2, api3, api5, api6} = apiOps;

const {Topbase, study, readwriteFsBase, cb, diagnose, nodule,image} = testDevOps;


// import {getBaseURL} from "@/assets/js/utils";
import {getBaseURL} from "@/assets/js/utils/url-toto.ts";
/**
 * TODO::这份文件的接口，先迎合-文佳搭建的spring-boot去返回，后续后端迁移至404后台写法，需改写~
 * ps：目前是从catch中才能捕获到值，先这么处理~
 * @param formData
 * @returns
 */

// 诊断分析
export const startDiagnose = (formData) => {
  return Base.submit(null, {
    url: api + urlJson["start-diagnose"],
    data: {
      ...formData,
    },
  });
};
/* 山哥专属 start*/
/**
 * algorithmConfig [{}]
   dicom zip
 * @param formData
 * @returns
 */
export const xhr_uploadDicom = (formData) => {
  return Base.submit(null, {
    method: "POST",
    autoQs: false,
    isFormData: true,
    // responseType: 'blob',
    // url: api5 + Topbase + study + urlJson['uploadDicom'],
    url: study + urlJson["uploadDicom"],
    data: formData,
    // data: {
    //   ...formData
    // },
    transformResponse: [
      (data) => {
        console.log("data===transformResponse=", data);
        return data;
      },
      (data) => {
        // 解析 Blob 数据并创建 Blob 数组
        console.log("-----------", data);

        // const blobArray = parseBlobToFiles(data);
        // return blobArray;
        return data;
      },
    ],
  })
    .then((response) => {
      console.log("response", response);
    })
    .catch((error) => {
      console.log("error", error);
    });
};
/**
 * studyId
 *
 * @param formData
 * @returns
 */
export const xhr_removeFavorite = (formData) => {
  return Base.submit(null, {
    // url: api5 + Topbase + study + urlJson['removeFavorite'],
    url: study + urlJson["removeFavorite"],
    data: {
      ...formData,
    },
  });
};

// 以下是根据注释补全的函数定义
/**
 * studyId
 * @param formData
 * @returns
 */
export const xhr_deleteStudy = (formData) => {
  return Base.submit(null, {
    // url: api5 + Topbase + study + urlJson['deleteStudy'],
    url: study + urlJson["deleteStudy"],
    data: {
      ...formData,
    },
  });
};
/**
 * seriesComputeId
 *
 * @param formData
 * @returns
 */
export const xhr_deleteSeries = (formData) => {
  return Base.submit(null, {
    // url: api5 + Topbase + study + urlJson['deleteSeries'],
    url: study + urlJson["deleteSeries"],
    data: {
      ...formData,
    },
  });
};
/**
 * studyId
 *
 * @param formData
 * @returns
 */
export const xhr_addFavorite = (formData) => {
  return Base.submit(null, {
    // url: api5 + Topbase + study + urlJson['addFavorite'],
    url: study + urlJson["addFavorite"],
    data: {
      ...formData,
    },
  });
};

/**
 * computeSeriesId 主键
 *  startDate
 *  endDate
 * accessionNumber 访问号
 * patientId 患者id
 * patientName 患者姓名
 * algorithmType 重建算法-类型
 * computeStatus 计算状态
 * myFavorite 是否收藏
 * reasonable //
 * pageNumber 翻页
 * pageSize 页条数
 * operationNameAndType 操作名称与类型
 * paginationModel 分页附带...obj
 * operateStatus 操作状态
 * operateDoctorUserId 操作医生id
 * imageCount 序列总数
 * seriesDescription 描述
 * seriesNumber 序列号
 * studyInstanceUid 研究实例 UID
 * seriesInstanceUid 序列实例 UID
 * printStatus “1”
 * pushStatus “1”
 *
 *
 *
 * @param formData
 * @returns
 */
export const xhr_pageStudies = (formData) => {
  return Base.submit(null, {
    method: "get",
    // url: api5 + Topbase + study + urlJson['pageStudies'],
    url: study + urlJson["pageStudies"],
    urlParam: {
      ...formData,
    },
  });
};
/**
 * 重新分析
 * computeSeriesId
 * @param formData
 */
export const xhr_reCompute = (formData) => {
  return Base.submit(null, {
    method: "POST",
    // url: api5 + Topbase + study + urlJson['pageStudies'],
    url: study + urlJson["reCompute"],
    data: {
      ...formData,
    },
  });
};

/**
 * seriesComputeId
 *
 * @param formData
 * @returns
 */
export const xhr_reAnalyse = (formData) => {
  return Base.submit(null, {
    url: api5 + Topbase + study + urlJson["reAnalyse"],
    data: {
      ...formData,
    },
  });
};
/**
 * file
 *
 * @param formData
 * @returns
 */
export const xhr_upload = (formData) => {
  return Base.submit(null, {
    url: api5 + Topbase + readwriteFsBase + urlJson["upload"],
    data: {
      ...formData,
    },
  });
};

/**
 *
 * @param formData
 * @returns
 */
export const xhr_push = (formData) => {
  return Base.submit(null, {
    url: api5 + Topbase + cb + urlJson["push"],
    data: {
      ...formData,
    },
  });
};

/**
 * seriesComputeId
 *
 * @param formData
 * @returns
 */
export const xhr_getSeriesInfo = (formData) => {
  return Base.submit(null, {
    url: diagnose + urlJson["getSeriesInfo"],
    data: {
      ...formData,
    },
  });
};

/**
 * seriesComputeId
 *
 * @param formData
 * @returns
 */
export const xhr_getNoduleInfo = (formData) => {
  console.log(formData);
  return Base.submit(null, {
    url: diagnose + urlJson["getNoduleInfo"],
    data: {
      ...formData,
    },
  });
};

/**
 * seriesComputeId
 *
 * @param formData
 * @returns
 */
export const xhr_getSlice = (formData) => {
  return new Promise((resolve, reject) => {
    try {
      return Base.submit(null, {

        url: image + urlJson["downloadSlice"],
        data: {
          ...formData,
        },
        responseType: "arraybuffer",
      }).then(res => {
        resolve(res);
      });
    } catch (error) {
      reject({error})
    }
  })
};

/**
 * seriesComputeId
 *
 * @param formData
 * @returns
 */
export const xhr_getModel3d = (formData) => {
  return Base.submit(null, {
    url: diagnose + urlJson["getModel3d"],
    data: {
      ...formData,
    },
    responseType: "arraybuffer",
  });
};

/* 山哥专属 end*/

// 获取诊断结果
export const getDiagnoseResult = (applyId) => {
  return new Promise((resolve, reject) => {
    Base.submit(null, {
      method: "get",
      url: api + urlJson["get-diagnose-result"],
      // data: {
      //   applyId: applyId
      // },
      urlParam: {
        applyId: "83299b46-8d18-4e41-88eb-cab1afa67523", //applyId
      },
    })
      .then((res) => {
        console.log("res", res);
        Vue.prototype.$message.destroy();
      })
      .catch((error) => {
        Vue.prototype.$message.destroy();
        console.log("err=================000000", error);
        resolve(error.data);
      });
  });
};

// ===========================================

// 获取-全系统业务相关码表
export const getSysDict = () => {
  return new Promise((resolve, reject) => {
    let newUrl = ``;
    if (process.env.NODE_ENV === "production") {
      newUrl = `${location.origin}${getBaseURL()}/dict.json`;
    } else {
      newUrl = `${getBaseURL()}/dict.json`;
    }
    // console.log("newUrl==", newUrl);
    Base.submit(null, {
      // url: 'http://localhost:5173/dict.json',//nice use
      url: newUrl,
    }).then((dataResult) => {
      // console.log("dataResult", dataResult, JSON.stringify(dataResult.data.scanSite));
      if (dataResult.code === 200) {
        // return dataResult.data;
        resolve(dataResult.data);
      }
    });
  });
};

// 获取诊断列表

export const getExaminationList = (userId) => {
  return new Promise((resolve, reject) => {
    Base.submit(null, {
      url: api2 + urlJson["get-examination-list"],
      method: "get",
      urlParam: {
        userId: userId,
      },
    })
      .then((data) => {
        console.log("list0000000000000000", data);
      })
      .catch((error) => {
        console.log("err=================000000", error);
        resolve(error.data);
      });
  });
};
// axios.get(api2 + urlJson['get-examination-list'], {
//   params: {
//     applyId: applyId
//   }
// })
// 6129 keya demo 测试
export const getExaDetail_keya = () => {
  // Authorization:
  // eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtY3dfYW5hbHlzZXIiLCJqd3RDbGFpbSI6eyJ1c2VySWQiOjI1LCJhY2NvdW50IjoibWN3IiwibmFtZSI6Im1jdyIsInJvbGUiOiJhbmFseXNlciIsImFjY291bnRMb2dJZCI6NzMxfSwiaWF0IjoxNzE3NjY0NTY2LCJleHAiOjE3MTc2NjQ1NjZ9.9-wbOmQHTur1oxxOUC9TTbIRX55KJBOz157bLcoHi7uqMNcA-hKzPSh0XuMjUta_XOgPXa6zuggseVRyTH6SrA
  return Base.submit(null, {
    headers: {
      Authorization:
        "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtY3dfYW5hbHlzZXIiLCJqd3RDbGFpbSI6eyJ1c2VySWQiOjI1LCJhY2NvdW50IjoibWN3IiwibmFtZSI6Im1jdyIsInJvbGUiOiJhbmFseXNlciIsImFjY291bnRMb2dJZCI6NzMxfSwiaWF0IjoxNzE3NjY0NTY2LCJleHAiOjE3MTc2NjQ1NjZ9.9-wbOmQHTur1oxxOUC9TTbIRX55KJBOz157bLcoHi7uqMNcA-hKzPSh0XuMjUta_XOgPXa6zuggseVRyTH6SrA",
    },
    url: api3 + urlJson["keyaDemo_download_6129"],
    method: "GET",
    // urlParam: {
    //   applyId: applyId
    // }
  })
    .then((res) => {
      console.log("keyayyy--res", res);

      return Promise.resolve(res.data);
    })
    .catch((err) => {
      console.log("keyayyy--err", err);
      return Promise.resolve(err?.data);
    });
};

//获取诊断细节
// TODO: 不是404数据结构-异常特殊处理下，会进入catch，等后端重写后，重新接入。
export const getExaminationDetail = (applyId) => {
  return Base.submit(null, {
    url: api2 + urlJson["get-examination-detail"],
    method: "GET",
    urlParam: {
      applyId: applyId,
    },
  })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((err) => {
      return Promise.resolve(err?.data);
    });
};
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
    url: api2 + urlJson["upload-examination"],
    data: {
      ...formData,
    },
  });

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
    const file = new File([subBlob], "filename.ext", {
      type: "application/octet-stream",
    });

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
};

//根据applyid获取文件
//上传诊断文件以及基础信息
export const getFile = (applyId) => {
  return new Promise((resolve, reject) => {
    Base.submit(
      null,
      {
        method: "GET",
        autoQs: false,
        responseType: "blob",
        // parseBigNumber: true,
        url: api2 + urlJson["get-file"],
        urlParam: {
          applyId: applyId,
        },
        transformResponse: [
          (data) => {
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
          },
        ],
      },
      (data) => {
        // 解析 Blob 数据并创建 Blob 数组
        const blobArray = parseBlobToFiles(data);
        return blobArray;
      },
    )
      .then(function (response) {
        // 处理成功的逻辑
        const blobArray = response.data; // 这里应该是一个 Blob 数组
        // 您可以在这里对 blobArray 进行进一步的处理
        console.log("response", response, "blobArray", blobArray);
        resolve(response);
      })
      .catch(function (error) {
        // 处理错误的逻辑
        console.log("处理错误的逻辑", error);
        reject(error);
      });
  });
};

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
    url: api2 + urlJson["is-exit"],
    urlParam: {
      studyInstanceUID: studyInstanceUID,
    },
  });



/* ----------------------nodule----lung----api---start */
/**
 * 结节病变列表查询
 * @param formData
 * @returns
 */
export const xhr_queryNodule = (formData) => {
  return Base.submit(null, {
    // url: api5 + Topbase + study + urlJson['addFavorite'],
    url: nodule + urlJson["queryNodule"],
    data: {
      ...formData,
    },
  });
};

/**
 * 查询上次结节操作
 * @param formData
 * @returns
 */
export const xhr_queryOperate = (formData) => {
  return Base.submit(null, {
    // url: api5 + Topbase + study + urlJson['addFavorite'],
    url: nodule + urlJson["queryOperate"],
    data: {
      ...formData,
    },
  });
};

/**
 * 查询文本报告
 * @param formData
 * @returns
 */
export const xhr_queryTextReport = (formData) => {
  return Base.submit(null, {
    // url: api5 + Topbase + study + urlJson['addFavorite'],
    url: nodule + urlJson["queryTextReport"],
    data: {
      ...formData,
    },
  });
};


/**
 * 保存人工诊断结果
 * @param formData
 * @returns
 */
export const xhr_saveManualDiagnosis = (formData) => {
  return Base.submit(null, {
    // url: api5 + Topbase + study + urlJson['addFavorite'],
    url: nodule + urlJson["saveManualDiagnosis"],
    data: {
      ...formData,
    },
  });
};


/**
 * 保存本次结节操作
 * @param formData
 * @returns
 */
export const xhr_saveOperate = (formData) => {
  return Base.submit(null, {
    // url: api5 + Topbase + study + urlJson['addFavorite'],
    url: nodule + urlJson["saveOperate"],
    data: {
      ...formData,
    },
  });
};


/**
 * 更新结节病变信息
 * @param formData
 * @returns
 */
export const xhr_updateNoduleLesion = (formData) => {
  return Base.submit(null, {
    // url: api5 + Topbase + study + urlJson['addFavorite'],
    url: nodule + urlJson["updateNoduleLesion"],
    autoQs: false,
    // isFormData: true,
    data: {
      ...formData,
    },
  });
};



/**
 * 更新文本报告
 * @param formData
 * @returns
 */
export const xhr_updateTextReport = (formData) => {
  return Base.submit(null, {
    // url: api5 + Topbase + study + urlJson['addFavorite'],
    url: nodule + urlJson["updateTextReport"],
    data: {
      ...formData,
    },
  });
};

/* ----------------------nodule----lung----api---end */
