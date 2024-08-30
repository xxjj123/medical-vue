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
export const LungTemplateEnum = {
  TEMP0:'双肺纹理清晰，未见明显结节影。',
  TEMP1: '{{lobeSegment}} 见{{type}},【{{im}}/{{imageCount}}】,大小约{{ellipsoidAxisMajor}}mm x {{ellipsoidAxisLeast}}mm，体积约{{volume}}mm³，平均CT值约{{ctMeasuresMean}}HU。',//1
  TEMP2: '双肺见多发结节，其中最大者【{{im}}/{{imageCount}}】，大小约{{ellipsoidAxisMajor}}mm x {{ellipsoidAxisLeast}}mm， 体积约{{volume}}mm³，平均CT值约{{ctMeasuresMean}}HU。',//1
  TEMP3: '{{lobeSegment}} 【{{im}}/{{imageCount}}】 见{{type}},大小约{{ellipsoidAxisMajor}}mm x {{ellipsoidAxisLeast}}mm，体积约{{volume}}mm³，平均CT值约{{ctMeasuresMean}}HU。',//1-limit or more-limit
  TEMP4: '，较大者大小约{{ellipsoidAxisMajor}}mm x {{ellipsoidAxisLeast}}mm，体积约{{volume}}mm³，平均CT值约{{ctMeasuresMean}}HU。',//汇总-模版前缀-动画插入格式：（左肺上叶前段【50/209】、右肺上叶前段【83/209】见2个实性结节，）
};

export function mapObjectToTemplate(obj:Object, template:string) {
  console.log(obj)
  return template
    .replace('{{lobeSegment}}', obj.lobeSegment.label)
    .replace('{{type}}', obj.type.name)
    .replace('{{im}}', obj.im)
    .replace('{{imageCount}}', 'TotalImages') // Replace 'TotalImages' with the actual value
    .replace('{{ellipsoidAxisMajor}}', obj.ellipsoidAxisMajor)
    .replace('{{ellipsoidAxisLeast}}', obj.ellipsoidAxisLeast)
    .replace('{{volume}}', obj.volume)
    .replace('{{ctMeasuresMean}}', obj.ctMeasuresMean);

}
// 诊断
export const LungTemplateDiagnoseEnum = {
  TEMP1: '多发结节',//select 无，前缀拼接格式（xxxx前段、xxx后段）
}

