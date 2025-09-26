
export interface Certificate {
  id: string;
  studentName: string;
  studentId: string;
  degree: string;
  major: string;
  issuingUniversity: string;
  issueDate: string;
  isRevoked: boolean;
  verificationUrl: string;
}

export enum Role {
  Student = "Student",
  University = "University",
  Verifier = "Verifier",
  Admin = "Admin",
}
