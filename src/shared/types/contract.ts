import { Teacher } from './teacher';
import { PublicUser, User } from './user';


export enum ContractType {
  PartTimeInternship = 'PART_TIME_INTERNSHIP',
  FullTimeInternship = 'FULL_TIME_INTERNSHIP',
  ApprenticeContract = 'APPRENTICE_CONTRACT',
  ProfessionalContract = 'PROFESSIONAL_CONTRACT'
};


export type Contract = {
  id: number,
  email: string,
  phone: string,
  address: string,
  type: ContractType,

  company: string,
  mission: string,
  endDate: string,
  startDate: string,
  userId: User['id'],
  supervisorId: Teacher['id'],

  fileKeys: string[],
  fileBase64: string[],

  User: PublicUser,
  Supervisor: Teacher,
};

export type ContractRequest = {
  id?: number,
  email: string,
  phone: string,
  address: string,
  type: ContractType,

  company: string,
  mission: string,
  endDate: string,
  startDate: string,
  userId: User['id'],
  supervisorId: Teacher['id'],
};
