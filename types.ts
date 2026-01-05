
export interface Student {
  id: string;
  name: string;
  marks: number;
  attendance: number;
  studyHours: number;
}

export interface AnalysisSummary {
  averageMarks: number;
  averageAttendance: number;
  averageStudyHours: number;
  passCount: number;
  failCount: number;
  totalStudents: number;
}

export interface StudentResult extends Student {
  status: 'Pass' | 'Fail';
  performanceScore: number;
}
