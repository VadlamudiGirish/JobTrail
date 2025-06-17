import { STATUS, PLATFORM, Method } from "@/generated/prisma";

export type Application = {
  id: string;
  applicationDate: string;
  companyName: string;
  jobTitle: string;
  applicationMethod: Method;
  applicationStatus: STATUS;
  contactPerson?: string;
  location: string;
  platform: PLATFORM;
  interviewRound: number;
  notes?: string;
  jobLink?: string;
  jobDescription?: string;
  interviewDates?: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
};
