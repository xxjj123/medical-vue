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
