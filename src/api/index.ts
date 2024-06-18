import urlJson from './collect-api';
import {
  apiOps
} from './options';
const {
  api,
  api2
} = apiOps;

import axios from 'axios'


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

export const getExaminationList = (userId) =>
  Base.submit(null, {
    url: api2 + urlJson['get-examination-list'],
    method: 'get',
    urlParam: {
      userId: userId
    }
  })
// axios.get(api2 + urlJson['get-examination-list'], {
//   params: {
//     applyId: applyId
//   }
// })


//获取诊断细节
export const getExaminationDetail = (applyId) =>
  Base.submit(null, {
    url: api2 + urlJson['get-examination-detail'],
    urlParam: {
      applyId: applyId
    }
  })


//上传诊断文件以及基础信息
export const uploadExamination = (formData) =>
  Base.submit(null, {
    url: api2 + urlJson['upload-examination'],
    data: {
      ...formData
    }
  })


//根据applyid获取文件
//上传诊断文件以及基础信息
export const getFile = (applyId) =>
  Base.submit(null, {
    url: api2 + urlJson['get-file'],
    urlParam: {
      applyId: applyId
    },
  })

// Base.downloadFile({
//   method: 'get',
//   fileName: 'get.pdf',
//   url: api2 + urlJson['get-file'],
//   options: {
//     applyId: applyId
//   }
// })

export const isExit = (studyInstanceUID) =>
  Base.submit(null, {
    url: api2 + urlJson['is-exit'],
    urlParam: {
      studyInstanceUID: studyInstanceUID
    }
  })
