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
export const noduleFindingEnum = {
  TEMP0:'双肺纹理清晰，未见明显结节影。',
  TEMP1: '{{lobeSegmentlabel}}{{lobeSegmentname}} 见{{type}},【{{im}}/{{imageCount}}】,大小约{{ellipsoidAxisMajor}}mm x {{ellipsoidAxisLeast}}mm，体积约{{volume}}mm³，平均CT值约{{ctMeasuresMean}}HU。',//1
  TEMP2: '双肺见多发结节，其中最大者【{{im}}/{{imageCount}}】，大小约{{ellipsoidAxisMajor}}mm x {{ellipsoidAxisLeast}}mm， 体积约{{volume}}mm³，平均CT值约{{ctMeasuresMean}}HU。',//1
  TEMP3: '{{lobeSegmentlabel}}{{lobeSegmentname}} 【{{im}}/{{imageCount}}】 见{{type}},大小约{{ellipsoidAxisMajor}}mm x {{ellipsoidAxisLeast}}mm，体积约{{volume}}mm³，平均CT值约{{ctMeasuresMean}}HU。',//1-limit or more-limit
  TEMP4: '大小约{{ellipsoidAxisMajor}}mm x {{ellipsoidAxisLeast}}mm，体积约{{volume}}mm³，平均CT值约{{ctMeasuresMean}}HU。',//汇总-模版前缀-动画插入格式：（左肺上叶前段【50/209】、右肺上叶前段【83/209】见2个实性结节，）
  TEMP5:'{{lobeSegmentlabel}}{{lobeSegmentname}} 【{{im}}/{{imageCount}}】'
}

function noduleObjectToTemplate(obj:Object, template:string,imageCount?:string) {
  return template
    .replace('{{lobeSegmentlabel}}', obj.lobe.label)
    .replace('{{lobeSegmentname}}', obj.lobeSegment.label)
    .replace('{{type}}', obj.type.label)
    .replace('{{im}}', obj.im)
    .replace('{{imageCount}}', imageCount) // Replace 'TotalImages' with the actual value
    .replace('{{ellipsoidAxisMajor}}', obj.ellipsoidAxisMajor)
    .replace('{{ellipsoidAxisLeast}}', obj.ellipsoidAxisLeast)
    .replace('{{volume}}', obj.volume)
    .replace('{{ctMeasuresMean}}', obj.ctMeasuresMean)

}

export function noduleFindingTemplate(objList:Object[], mode:string,imageCount:string,currentNum:string) {
  let resultBookItems = []
  if (objList.length == 0 || !mode) {
   resultBookItems.push({ id: -1, isActive:false,desc: noduleFindingEnum.TEMP0 })
  }else{
   if (mode === 1) {
    objList.sort((a, b) => {
      if (a.im < b.im) return -1;
      if (a.im > b.im) return 1;
      return 0;
    });

    objList.forEach((item) => {
      const resultBookItem = noduleObjectToTemplate(item, noduleFindingEnum.TEMP3, imageCount)
      resultBookItems.push({ id: item.id,isActive:currentNum==item.id, desc: resultBookItem })
        })
   }
   else if(mode === 2){
    objList.sort((a, b) => {
      if (a.lobeSegmentSort < b.lobeSegmentSort) return -1;
      if (a.lobeSegmentSort > b.lobeSegmentSort) return 1;
      return 0;
    });

    objList.forEach((item) => {
    const resultBookItem = noduleObjectToTemplate(item, noduleFindingEnum.TEMP3, imageCount)
    resultBookItems.push({ id: item.id,isActive:currentNum==item.id, desc: resultBookItem })
    })

   }else if(mode===3){
    const typeMap = {};
  // 将objList中的项按type字段进行分类

  objList.forEach(item => {
   if (!typeMap[item.type.label]) {
    typeMap[item.type.label] = [];
   }
   typeMap[item.type.label].push(item);

  });
  for (const [type, items] of Object.entries(typeMap)) {
   let segments = items.map(item =>
    noduleObjectToTemplate(item, noduleFindingEnum.TEMP5, imageCount)
   ).join('、');

   const noduleCount = items.length;
   const largestItem = items.reduce((prev, current) =>
    (prev.volume > current.volume) ? prev : current

   );

    let summary
    if(noduleCount>1){
      summary = `${segments}见${noduleCount}个${type}，较大者` + noduleObjectToTemplate(largestItem, noduleFindingEnum.TEMP4, imageCount);

    }else{
      summary = `${segments}见${type}，` + noduleObjectToTemplate(largestItem, noduleFindingEnum.TEMP4, imageCount);

    }
    let isActive = false
    items.forEach((item)=>{
      if(item.id==currentNum){
        isActive = true
      }
    })
   resultBookItems.push({ id: largestItem.id,isActive:isActive, desc: summary });
  }

   }else if(mode ===4){
    objList.sort((a, b) => {
      if (a.lobeSegmentSort < b.lobeSegmentSort) return -1;
      if (a.lobeSegmentSort > b.lobeSegmentSort) return 1;
      return 0;
        });

      objList.forEach((item) => {
       const resultBookItem = noduleObjectToTemplate(item, noduleFindingEnum.TEMP3, imageCount)
        resultBookItems.push({ id: item.id,isActive:currentNum==item.id, desc: resultBookItem })
        })
   }else if(mode ===5){
    if(objList.length===1){
      const selectedItem = objList[0]
      const resultBookItem = noduleObjectToTemplate(selectedItem, noduleFindingEnum.TEMP1, imageCount)
      resultBookItems.push({ id: selectedItem.id,isActive:currentNum==resultBookItem.id, desc: resultBookItem })
    }else{
  objList.sort((a, b) => {
  if (a.volume > b.volume) return -1;
    if (a.volume < b.volume) return 1;
    return 0;
    });
   const selectedItem = objList[0]
   const resultBookItem = noduleObjectToTemplate(selectedItem, noduleFindingEnum.TEMP2, imageCount)
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
export const noduleDiagnoseEnum = {
  TEMP0:'胸部CT平扫未见明显结节影。',
  TEMP1:'{{lobeSegmentlabel}}{{lobeSegmentname}}',
  TEMP3:'{{lobeSegmentlabel}}{{lobeSegmentname}} 见肿块, 约{{ellipsoidAxisMajor}}mm x {{ellipsoidAxisLeast}}mm。',
  TEMP4:'见肿块，较大者约{{ellipsoidAxisMajor}}mm x {{ellipsoidAxisLeast}}mm。'

}
export function noduleDiagnoseTemplate(objList:Object[], mode:string ) {

  let resultBookItems = []
  if (objList.length == 0) {
   resultBookItems.push({ id: -1, isActive:false,desc: noduleDiagnoseEnum.TEMP0 })
  }else{
   if (mode === 1 ) {
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
        const resultBookItem = noduleObjectToTemplate(selectedItem, noduleDiagnoseEnum.TEMP3)
        resultBookItems.push({ id: selectedItem.id,isActive:false, desc: resultBookItem })
      }else{
        let segments = massList.map(item =>
          noduleObjectToTemplate(item, noduleDiagnoseEnum.TEMP1)
         ).join('、');
        const largestItem = massList.reduce((prev, current) =>
          (prev.volume > current.volume) ? prev : current
         );
         const summary = `${segments}` + noduleObjectToTemplate(largestItem, noduleDiagnoseEnum.TEMP4);
         resultBookItems.push({ id: largestItem.id, isActive:false,desc: summary });
      }

    }

    if(noduleList.length>0){
      if(noduleList.length==1){
        const selectedItem = noduleList[0]
        const resultBookItem = noduleObjectToTemplate(selectedItem, noduleDiagnoseEnum.TEMP1) +'结节。'
        resultBookItems.push({ id: selectedItem.id, isActive:false,desc: resultBookItem })
      }else{
        const typeMap = {};
        // 将objList中的项按type字段进行分类

        noduleList.forEach(item => {
         if (!typeMap[item.lobe.value]) {
          typeMap[item.lobe.value] = item.lobe.label+ item.lobeSegment.label;
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


const fracFindingEnum = {
  TEMP0: '胸廓对称，肋骨走行自然。片中所示骨性肋骨骨质连续性完整，未见中断影像。',
  TEMP1: '{{ribSide}}第{{ribNum}}肋',
  TEMP2: '见{{fracClass}}。'
};

const fracDiagnoseEnum = {
  TEMP0:'肋骨未见明显异常。',
  TEMP1: '{{ribSide}}第{{ribNum}}肋',
  TEMP2: '见{{fracClass}}。',
  TEMP3: '请结合临床，必要时复查。'

}
function fracObjectToTemplate(obj:Object, template:string,ribNum:[]) {
  return template
    .replace('{{ribSide}}', obj.ribSide.label)
    .replace('{{fracClass}}',obj.fracClass.value == 'old'?'骨痂影': obj.fracClass.label)
    .replace('{{ribNum}}',ribNum)
}

function formatRibNums(sortedItems) {
  const uniqueRibNums = [...new Set(sortedItems.map(item => item.ribNum))].sort((a, b) => a - b);

  let result = [];
  let start = uniqueRibNums[0];
  let end = start;

  for (let i = 1; i < uniqueRibNums.length; i++) {
    if (uniqueRibNums[i] === end + 1) {
      end = uniqueRibNums[i];
    } else {
      result.push(start === end ? `${start}` : `${start}-${end}`);
      start = uniqueRibNums[i];
      end = start;
    }
  }
  result.push(start === end ? `${start}` : `${start}-${end}`);

  return result.join('、');
}


export function fracFindingTemplate(objList,currentNum) {
  let resultBookItems = [];
  if (objList.length === 0) {
    resultBookItems.push({ id: -1, isActive: false, desc: fracFindingEnum.TEMP0 });
    return resultBookItems;
  }
  const typeMap = {};
  objList.forEach(item => {
    if (!typeMap[item.fracClass.value]) {
      typeMap[item.fracClass.value] = [];
    }
    typeMap[item.fracClass.value].push(item);
  });

  for (const [type, items] of Object.entries(typeMap)) {
    let categorizedItems = { l: [], r: [] };

    items.forEach(item => {
      if (item.ribSide.value === 'L') {
        categorizedItems.l.push(item);
      } else if (item.ribSide.value === 'R') {
        categorizedItems.r.push(item);
      }
    });

    categorizedItems.l.sort((a, b) => a.ribNum - b.ribNum);
    categorizedItems.r.sort((a, b) => a.ribNum - b.ribNum);

    let leftFormatted = categorizedItems.l.length > 0 ? formatRibNums(categorizedItems.l) : '';
    let rightFormatted = categorizedItems.r.length > 0 ? formatRibNums(categorizedItems.r) : '';

    let finding = '';

    if (leftFormatted) {
      finding += fracObjectToTemplate(categorizedItems.l[0], fracFindingEnum.TEMP1, leftFormatted);
    }
    if (rightFormatted) {
      if (finding) finding += '，';
      finding += fracObjectToTemplate(categorizedItems.r[0], fracFindingEnum.TEMP1, rightFormatted);
    }

    finding += fracObjectToTemplate(items[0], fracFindingEnum.TEMP2);

    let isActive = items.some(item => item.id === currentNum);
    resultBookItems.push({
      id: items[0].id,
      isActive: isActive,
      desc: finding
    });
  }

  return resultBookItems;
}

export function fracDiagnoseTemplate(objList:Object[], currentNum:string) {

  let resultBookItems = [];
  if (objList.length === 0) {
    resultBookItems.push({ id: -1, isActive: false, desc: fracDiagnoseEnum.TEMP0 });
    return resultBookItems;
  }
  const typeMap = {};
  let fracType = { frac: [], buckle: [], old: [] };

  objList.forEach(item => {
      if (item.fracClass.value === 'displaced' || item.fracClass.value === 'nodisplaced') {
        fracType.frac.push(item);
      }  else if (item.fracClass.value === 'buckle') {
        fracType.buckle.push(item);
      }else if (item.fracClass.value === 'old') {
        fracType.old.push(item);
      }
    });
  for (const [type, items] of Object.entries(fracType)) {
    if(items.length >0){
      let categorizedItems = { l: [], r: [] };

      items.forEach(item => {
        if (item.ribSide.value === 'L') {
          categorizedItems.l.push(item);
        } else if (item.ribSide.value === 'R') {
          categorizedItems.r.push(item);
        }
      });

      categorizedItems.l.sort((a, b) => a.ribNum - b.ribNum);
      categorizedItems.r.sort((a, b) => a.ribNum - b.ribNum);

      let leftFormatted = categorizedItems.l.length > 0 ? formatRibNums(categorizedItems.l) : '';
      let rightFormatted = categorizedItems.r.length > 0 ? formatRibNums(categorizedItems.r) : '';

      let finding = '';

      if (leftFormatted) {
        finding += fracObjectToTemplate(categorizedItems.l[0], fracDiagnoseEnum.TEMP1, leftFormatted);
      }
      if (rightFormatted) {
        if (finding) finding += '，';
        finding += fracObjectToTemplate(categorizedItems.r[0], fracDiagnoseEnum.TEMP1, rightFormatted);
      }
      let diagnose = ""
      if(type == 'frac'){
        diagnose = "骨折"
        if(items.length >1){
          diagnose = "多发骨折"
        }
      }else if(type=='buckle'){
        diagnose = "骨折可能"
      }else if(type == 'old'){
        diagnose = "陈旧性骨折"
      }
      finding = finding +diagnose
      resultBookItems.push(finding);
    }

  }
  resultBookItems.push(fracDiagnoseEnum.TEMP3)
  const desc = resultBookItems.join('。')

  return [  { id: -1, isActive: false, desc: desc }
  ];;


}


const pneumoniaFindingEnum = {
  TEMP0: '双肺纹理清晰，未见明显炎性密度影。',
  TEMP1: '{{lobeName}}见{{diseaseClass}}，体积{{diseaseVolume}}cm³，平均CT值为{{intensity}}HU。',
};

const pneumoniaDiagnoseEnum = {
  TEMP0:'胸部CT平扫未见明显炎性密度影。',
  TEMP1: '{{lobeName}}',
  TEMP2: '炎症，建议随诊复查。',

}
function pneumoniaObjectToTemplate(obj:Object, template:string,ribNum:[]=[]) {
  return template
    .replace('{{lobeName}}', obj.lobeName.label)
    .replace('{{diseaseClass}}',obj.diseaseClass.label)
    .replace('{{diseaseVolume}}',obj.fixedDiseaseVolume)
    .replace('{{intensity}}',obj.fixedIntensity)
}


export function pneumoniaFindingTemplate(objList,currentNum) {
  let resultBookItems = [];
  if (objList.length === 0) {
    resultBookItems.push({ id: -1, isActive: false, desc: pneumoniaFindingEnum.TEMP0 });
    return resultBookItems;
  }
  objList.forEach(item=>{
    const resultBookItem = pneumoniaObjectToTemplate(item, pneumoniaFindingEnum.TEMP1)
    resultBookItems.push({ id: item.id, isActive:false,desc: resultBookItem })
  })

  return resultBookItems;
}

export function pneumoniaDiagnoseTemplate(objList,currentNum) {
  let resultBookItems = [];
  if (objList.length === 0) {
    resultBookItems.push({ id: -1, isActive: false, desc: pneumoniaDiagnoseEnum.TEMP0 });
    return resultBookItems;
  }
  const lobeNameList = []
  objList.forEach(item=>{
    lobeNameList.push(pneumoniaObjectToTemplate(item, pneumoniaDiagnoseEnum.TEMP1))
  })
  let desc =''
  if (lobeNameList.length > 2) {
    let allButLast = lobeNameList.slice(0, -1).join('、');
    let lastElement = "及" + lobeNameList[lobeNameList.length - 1];
    desc = allButLast  + lastElement;
  } else {
    desc= lobeNameList.join('、');

  }
  desc += pneumoniaDiagnoseEnum.TEMP2
  resultBookItems.push({ id: -1, isActive: false, desc: desc })
  return resultBookItems;
}



const spineFindingEnum = {
  // TEMP0: 'Cobbe角( {{start}}椎体上缘-{{end}}椎体下缘 )约 {{cobb}} ° '
  TEMP0: '正位片Cobbe角约 {{cobb}} ° '

};

const spineDiagnoseEnum = {
  TEMP0: "未发现明显侧弯，脊柱形态正常。",
  TEMP1: "轻微的脊柱侧弯,建议 6 个月至 1 年复查。",
  TEMP2: "脊柱出现中度侧弯，建议佩戴矫形支具并结合康复训练，定期复查。",
  TEMP3: "脊柱重度侧弯，可能影响身体对称性，建议多学科评估，必要时手术治疗。",
  TEMP4: "脊柱极重度侧弯，可能严重影响心肺功能，建议尽早手术矫正并结合康复治疗。",

}
function spineObjectToTemplate(obj:Object, template:string ) {
  return template
    .replace('{{cobb}}', obj.angle)
    .replace('{{spinePart}}', obj.label)
    .replace('{{start}}', obj.idxs[0])
    .replace('{{end}}', obj.idxs[1])

}


export function spineFindingTemplate(objList) {
  let resultBookItems = [];
  objList.sort((a, b) => a.order - b.order);

  objList.forEach(item=>{
    const resultBookItem = spineObjectToTemplate(item, spineFindingEnum.TEMP0)
    resultBookItems.push({ id: item.id, isActive:false,desc: resultBookItem })

  })

  return resultBookItems;
}

export function spineDiagnoseTemplate(objList) {
  let resultBookItems = [];
  objList.sort((a, b) => a.order - b.order);

  objList.forEach(item=>{
    const angle = item.angle;
  let diagnoseTemplate;

  if (angle <= 10) {
    diagnoseTemplate = spineDiagnoseEnum.TEMP0;
  } else if (angle <= 20) {
    diagnoseTemplate = spineDiagnoseEnum.TEMP1;
  } else if (angle <= 40) {
    diagnoseTemplate = spineDiagnoseEnum.TEMP2;
  } else if (angle <= 60) {
    diagnoseTemplate = spineDiagnoseEnum.TEMP3;
  } else {
    diagnoseTemplate = spineDiagnoseEnum.TEMP4;
  }

  const resultBookItem = spineObjectToTemplate(item, diagnoseTemplate);
  resultBookItems.push({
    id: item.id,
    isActive: false,
    desc: resultBookItem,
  });


  })

  return resultBookItems;
}

