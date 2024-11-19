export const dicomTagDescriptions = {
    "AccessionNumber": "x00080050" ,  // 访问号
    "PatientID": "x00100020" ,  // 患者 ID
    "PatientName": "x00100010" ,  // 患者姓名
    "PatientAge": "x00101010" ,  // 患者年龄
    "PatientSex": "x00100040" ,  // 患者性别
    "StudyInstanceUID": "x0020000d" ,  // 研究实例 UID
    "SeriesInstanceUID": "x0020000e" ,  // 序列实例 UID
    "SeriesDescription": "x0008103e" ,  // 序列描述
    "Modality": "x00080060" ,  // 成像方式
    "SpecificCharacterSet": "x00080005" ,  // 指定字符集
    "ImageType": "x00080008" ,  // 图像类型
    "InstanceCreationDate": "x00080012" ,  // 实例创建日期
    "InstanceCreationTime": "x00080013" ,  // 实例创建时间
    "SOPClassUID": "x00080016" ,  // SOP 类别唯一标识符
    "SOPInstanceUID": "x00080018" ,  // SOP 实例唯一标识符
    "StudyDate": "x00080020" ,  // 研究日期
    "SeriesDate": "x00080021" ,  // 序列日期
    "AcquisitionDate": "x00080022" ,  // 采集日期
    "ContentDate": "x00080023" ,  // 内容日期
    "StudyTime": "x00080030" ,  // 研究时间
    "SeriesTime": "x00080031" ,  // 序列时间
    "AcquisitionTime": "x00080032" ,  // 采集时间
    "ContentTime": "x00080033" ,  // 内容时间
    "Manufacturer": "x00080070" ,  // 制造商
    "InstitutionName": "x00080080" ,  // 机构名称
    "ReferringPhysicianName": "x00080090" ,  // 参考医生的名字
    "StationName": "x00081010" ,  // 站点名称
    "StudyDescription": "x00081030" ,  // 研究描述
    "PerformingPhysicianName": "x00081050" ,  // 执行医生的名字
    "NameOfPhysiciansReadingStudy": "x00081060" ,  // 研究读取医生的名字
    "OperatorsName": "x00081070" ,  // 操作员的名字
    "ManufacturersModelName": "x00081090" ,  // 制造商的型号名称
    "PatientBirthDate": "x00100030" ,  // 患者出生日期
    "OtherPatientIDs": "x00101000" ,  // 其他患者 ID
    "AdditionalPatientHistory": "x001021B0" ,  // 额外患者历史
    "ScanOptions": "x00180022" ,  // 扫描选项（螺旋模式）
    "SliceThickness": "x00180050" ,  // 切片厚度
    "KVP": "x00180060" ,  // 管电压
    "SpacingBetweenSlices": "x00180088" ,  // 切片间距
    "DataCollectionDiameter": "x00180090" ,  // 数据采集直径
    "SoftwareVersions": "x00181020" ,  // 软件版本
    "ProtocolName": "x00181030" ,  // 协议名称
    "ReconstructionDiameter": "x00181100" ,  // 重建直径
    "DistanceSourceToDetector": "x00181110" ,  // 源到探测器的距离
    "DistanceSourceToPatient": "x00181111" ,  // 源到患者的距离
    "GantryDetectorTilt": "x00181120" ,  // 机架/探测器倾斜度
    "TableHeight": "x00181130" ,  // 台面高度
    "RotationDirection": "x00181140" ,  // 旋转方向
    "ExposureTime": "x00181150" ,  // 曝光时间
    "XRayTubeCurrent": "x00181151" ,  // X 射线管电流
    "Exposure": "x00181152" ,  // 曝光量
    "FilterType": "x00181160" ,  // 滤波器类型
    "GeneratorPower": "x00181170" ,  // 发电机功率
    "FocalSpots": "x00181190" ,  // 焦点大小
    "ConvolutionKernel": "x00181210" ,  // 卷积核
    "PatientPosition": "x00185100" ,  // 患者位置
    "ReconstructionAlgorithm": "x00189307" ,  // 重建算法
    "CTExposureSequence": "x00189309" ,  // CT 曝光序列
    "ExposureModulationType": "x00189310" ,  // 曝光调制类型
    "EstimatedDoseSaving": "x00189311" ,  // 估计剂量节省
    "StudyID": "x00200010" ,  // 研究 ID
    "SeriesNumber": "x00200011" ,  // 序列号
    "AcquisitionNumber": "x00200012" ,  // 采集号
    "InstanceNumber": "x00200013" ,  // 实例号
    "ImagePositionPatient": "x00200032" ,  // 图像位置（患者位置）
    "ImageOrientationPatient": "x00200037" ,  // 图像方向（患者方向）
    "FrameOfReferenceUID": "x00200052" ,  // 参考框架 UID
    "PositionReferenceIndicator": "x00201040" ,  // 位置参考指示器
    "SliceLocation": "x00201041" ,  // 切片位置
    "SamplesPerPixel": "x00280002" ,  // 每像素采样数
    "PhotometricInterpretation": "x00280004" ,  // 光度学解释
    "Rows": "x00280010" ,  // 行
    "Columns": "x00280011" ,  // 列
    "PixelSpacing": "x00280030" ,  // 像素间距
    "BitsAllocated": "x00280100" ,  // 分配的比特数
    "BitsStored": "x00280101" ,  // 存储的比特数
    "HighBit": "x00280102" ,  // 高位
    "PixelRepresentation": "x00280103" ,  // 像素表示
    "PixelPaddingValue": "x00280120" ,  // 像素填充值
    "WindowCenter": "x00281050" ,  // 窗中心
    "WindowWidth": "x00281051" ,  // 窗宽
    "RescaleIntercept": "x00281052" ,  // 重缩放截距
    "RescaleSlope": "x00281053" ,  // 重缩放斜率
    "RescaleType": "x00281054" ,  // 重缩放类型
    "PerformedProcedureStepStartDate": "x00400244" ,  // 执行程序步骤开始日期
    "PerformedProcedureStepStartTime": "x00400245" ,  // 执行程序步骤开始时间
    "PPSID": "x00400253" ,  // PPS 编号
    "PPSDescription": "x00400254" ,  // PPS 描述"
  }
