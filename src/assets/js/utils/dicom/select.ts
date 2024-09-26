// 患者标记
export enum PATIENT_LABOPTIONS {
  AccessionNumber = 'accessionNumber',
  PatientId = 'patientId',
  PatientName = 'patientName',
}

/**
 * 判断当前 PATIENT_LABOPTIONS 键值 是否存在
 * @param option
 * @returns {Boolean}
 */
export function isPatientOptionValid(option: string): boolean {
  return Object.values(PATIENT_LABOPTIONS).includes(option);
}

/**
 * type_select select
 */
export enum SortOption {
  Default = "1",
  Risk = "2",
  IM = "3",
  LobeSegment = "4",
  Length = "5",
  Volume = "6",
  Type = "7"
}


// 所见
export const LungFindingEnum = {
  TEMP0:'双肺纹理清晰，未见明显结节影。',
  TEMP1: '{{lobeSegmentlabel}}{{lobeSegmentname}} 见{{type}},【{{im}}/{{imageCount}}】,大小约{{ellipsoidAxisMajor}}mm x {{ellipsoidAxisLeast}}mm，体积约{{volume}}mm³，平均CT值约{{ctMeasuresMean}}HU。',//1
  TEMP2: '双肺见多发结节，其中最大者【{{im}}/{{imageCount}}】，大小约{{ellipsoidAxisMajor}}mm x {{ellipsoidAxisLeast}}mm， 体积约{{volume}}mm³，平均CT值约{{ctMeasuresMean}}HU。',//1
  TEMP3: '{{lobeSegmentlabel}}{{lobeSegmentname}} 【{{im}}/{{imageCount}}】 见{{type}},大小约{{ellipsoidAxisMajor}}mm x {{ellipsoidAxisLeast}}mm，体积约{{volume}}mm³，平均CT值约{{ctMeasuresMean}}HU。',//1-limit or more-limit
  TEMP4: '大小约{{ellipsoidAxisMajor}}mm x {{ellipsoidAxisLeast}}mm，体积约{{volume}}mm³，平均CT值约{{ctMeasuresMean}}HU。',//汇总-模版前缀-动画插入格式：（左肺上叶前段【50/209】、右肺上叶前段【83/209】见2个实性结节，）
  TEMP5:'{{lobeSegmentlabel}}{{lobeSegmentname}} 【{{im}}/{{imageCount}}】'
}
;



export function mapObjectToTemplate(obj:Object, template:string,imageCount?:string) {
  return template
    .replace('{{lobeSegmentlabel}}', obj.lobeSegment.label)
    .replace('{{lobeSegmentname}}', obj.lobeSegment.name)

    .replace('{{type}}', obj.type.name)
    .replace('{{im}}', obj.im)
    .replace('{{imageCount}}', imageCount) // Replace 'TotalImages' with the actual value
    .replace('{{ellipsoidAxisMajor}}', obj.ellipsoidAxisMajor)
    .replace('{{ellipsoidAxisLeast}}', obj.ellipsoidAxisLeast)
    .replace('{{volume}}', obj.volume)
    .replace('{{ctMeasuresMean}}', obj.ctMeasuresMean);

}

export function mapObjectListToFindingTemplate(objList:Object[], mode:string,imageCount:string,currentNum:string) {

  let resultBookItems = []
  if (objList.length == 0) {
   resultBookItems.push({ id: -1, isActive:false,desc: LungFindingEnum.TEMP0 })
  }else{
   if (mode === '0') {
    objList.sort((a, b) => {
      if (a.im < b.im) return -1;
      if (a.im > b.im) return 1;
      return 0;
    });

    objList.forEach((item) => {
      const resultBookItem = mapObjectToTemplate(item, LungFindingEnum.TEMP3, imageCount)
      resultBookItems.push({ id: item.id,isActive:currentNum==item.id, desc: resultBookItem })
        })
   }
   else if(mode === '1'){
    objList.sort((a, b) => {
      if (a.lobeSegmentSort < b.lobeSegmentSort) return -1;
      if (a.lobeSegmentSort > b.lobeSegmentSort) return 1;
      return 0;
    });

    objList.forEach((item) => {
    const resultBookItem = mapObjectToTemplate(item, LungFindingEnum.TEMP3, imageCount)
    resultBookItems.push({ id: item.id,isActive:currentNum==item.id, desc: resultBookItem })
    })

   }else if(mode==='2'){
    const typeMap = {};
  // 将objList中的项按type字段进行分类

  objList.forEach(item => {
   if (!typeMap[item.type.name]) {
    typeMap[item.type.name] = [];
   }
   typeMap[item.type.name].push(item);

  });
  for (const [type, items] of Object.entries(typeMap)) {
   let segments = items.map(item =>
    mapObjectToTemplate(item, LungFindingEnum.TEMP5, imageCount)
   ).join('、');

   const noduleCount = items.length;
   const largestItem = items.reduce((prev, current) =>
    (prev.volume > current.volume) ? prev : current

   );

    let summary
    if(noduleCount>1){
      summary = `${segments}见${noduleCount}个${type}，较大者` + mapObjectToTemplate(largestItem, LungFindingEnum.TEMP4, imageCount);

    }else{
      summary = `${segments}见${type}，` + mapObjectToTemplate(largestItem, LungFindingEnum.TEMP4, imageCount);

    }
    let isActive = false
    items.forEach((item)=>{
      if(item.id==currentNum){
        isActive = true
      }
    })
   resultBookItems.push({ id: largestItem.id,isActive:isActive, desc: summary });
  }

   }else if(mode ==='3'){
    objList.sort((a, b) => {
      if (a.lobeSegmentSort < b.lobeSegmentSort) return -1;
      if (a.lobeSegmentSort > b.lobeSegmentSort) return 1;
      return 0;
        });

      objList.forEach((item) => {
       const resultBookItem = mapObjectToTemplate(item, LungFindingEnum.TEMP3, imageCount)
        resultBookItems.push({ id: item.id,isActive:currentNum==item.id, desc: resultBookItem })
        })
   }else if(mode ==='4'){
    if(objList.length===1){
      const selectedItem = objList[0]
      const resultBookItem = mapObjectToTemplate(selectedItem, LungFindingEnum.TEMP1, imageCount)
      resultBookItems.push({ id: selectedItem.id,isActive:currentNum==resultBookItem.id, desc: resultBookItem })
    }else{
  objList.sort((a, b) => {
  if (a.volume > b.volume) return -1;
    if (a.volume < b.volume) return 1;
    return 0;
    });
   const selectedItem = objList[0]
   const resultBookItem = mapObjectToTemplate(selectedItem, LungFindingEnum.TEMP2, imageCount)
   let isActive = false
   objList.forEach((item)=>{
     if(item.id==currentNum){
       isActive = true
     }
   })
    resultBookItems.push({ id: selectedItem.id,isActive:isActive, desc: resultBookItem })
    }

   }

  }
  return resultBookItems;
 }

// 诊断
export const LungDiagnoseEnum = {
  TEMP0:'胸部CT平扫未见明显结节影。',
  TEMP1:'{{lobeSegmentlabel}}{{lobeSegmentname}}',
  TEMP3:'{{lobeSegmentlabel}}{{lobeSegmentname}} 见肿块, 约{{ellipsoidAxisMajor}}mm x {{ellipsoidAxisLeast}}mm。',
  TEMP4:'见肿块，较大者约{{ellipsoidAxisMajor}}mm x {{ellipsoidAxisLeast}}mm。'

}
export function mapObjectListToDiagnoseTemplate(objList:Object[], mode:string ) {


  let resultBookItems = []
  if (objList.length == 0) {
   resultBookItems.push({ id: -1, isActive:false,desc: LungDiagnoseEnum.TEMP0 })
  }else{
   if (mode === '0') {
    const massList = []
    const noduleList = []
    objList.forEach(item => {
      if(item.type.value == 'Mass'){
         massList.push(item);
      } else{
        noduleList.push(item);
      }

    })
    if(massList.length>0){
      if(massList.length==1){
        const selectedItem = massList[0]
        const resultBookItem = mapObjectToTemplate(selectedItem, LungDiagnoseEnum.TEMP3)
        resultBookItems.push({ id: selectedItem.id,isActive:false, desc: resultBookItem })
      }else{
        let segments = massList.map(item =>
          mapObjectToTemplate(item, LungDiagnoseEnum.TEMP1)
         ).join('、');
        const largestItem = massList.reduce((prev, current) =>
          (prev.volume > current.volume) ? prev : current
         );
         const summary = `${segments}` + mapObjectToTemplate(largestItem, LungDiagnoseEnum.TEMP4);
         resultBookItems.push({ id: largestItem.id, isActive:false,desc: summary });
      }

    }

    if(noduleList.length>0){
      if(noduleList.length==1){
        const selectedItem = noduleList[0]
        const resultBookItem = mapObjectToTemplate(selectedItem, LungDiagnoseEnum.TEMP1) +'结节。'
        resultBookItems.push({ id: selectedItem.id, isActive:false,desc: resultBookItem })
      }else{
        const typeMap = {};
        // 将objList中的项按type字段进行分类

        noduleList.forEach(item => {
         if (!typeMap[item.lobeSegment.value]) {
          typeMap[item.lobeSegment.value] = item.lobeSegment.label+ item.lobeSegment.name;
         }

        });
        let segments =Object.values(typeMap).join('、')
        const largestItem = noduleList.reduce((prev, current) =>
          (prev.volume > current.volume) ? prev : current
         );
         const summary = `${segments}` +'多发结节';
         resultBookItems.push({ id: largestItem.id, isActive:false,desc: summary });
      }

    }


   }}
   return resultBookItems;
}
