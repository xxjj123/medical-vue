export default {
  /* 混合测试 start*/
  'start-diagnose': '/common/from/register/pacs',
  'get-diagnose-result': '/common/result',
  'get-examination-list': '/examinations/getlist',
  'get-examination-detail': '/examinations/getdetail',
  'upload-examination': '/examinations/upload',
  'get-file': '/examinations/download',
  'is-exit': '/examinations/isexit',
  'keyaDemo_download_6129': '/object/download/6129',
  /* 混合测试 end*/
  /* 山哥-----公司测试环境接口 start*/
  /* study */
  'uploadDicom': '/uploadDicom',//dicom文件上传
  'removeFavorite': '/removeFavorite',//取消收藏
  'deleteStudy': '/deleteStudy',//删除检查
  'deleteSeries': '/deleteSeries',//删除序列
  'addFavorite': '/addFavorite',//添加收藏
  'pageStudies': '/pageStudies',//分页查询检查
  'reAnalyse': '/reAnalyse',//重新分析 old
  'reCompute': '/reCompute',//重新分析 new

  /* fs  */
  'upload': '/upload', //文件存储-文件上传

  /* callback */
  'push': '/push' //ai结果推送




  /* 山哥-----公司测试环境接口 end*/
}
