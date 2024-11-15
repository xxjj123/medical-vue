class TextReport {
	id: string;
	computeSeriesId: string;
	patientId: string;
	accessionNumber: string;
	studyDate: string;
	patientName: string;
	patientSex: string;
	patientAge: string;
	examinedName: string;
	finding: string;
	diagnosis: string;
	reportDate: string;
	reportDoctor: string;
	auditDoctor: string;

	constructor(
		id: string = "",
		computeSeriesId: string = "",
		patientId: string = "",
		accessionNumber: string = "",
		studyDate: string = "",
		patientName: string = "",
		patientSex: string = "",
		patientAge: string = "",
		examinedName: string = "",
		finding: string = "",
		diagnosis: string = "",
		reportDate: string = "",
		reportDoctor: string = "",
		auditDoctor: string = ""
	) {
		this.id = id;
		this.computeSeriesId = computeSeriesId;
		this.patientId = patientId;
		this.accessionNumber = accessionNumber;
		this.studyDate = studyDate;
		this.patientName = patientName;
		this.patientSex = patientSex;
		this.patientAge = patientAge;
		this.examinedName = examinedName;
		this.finding = finding;
		this.diagnosis = diagnosis;
		this.reportDate = reportDate;
		this.reportDoctor = reportDoctor;
		this.auditDoctor = auditDoctor;
	}
}

export { TextReport };
