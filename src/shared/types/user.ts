import { AccountInfo } from '@azure/msal-browser';

import { Grade } from './grade';
import { Campus } from './campus';
import { Classroom, UserHasClassroom } from './classroom';


export type AzureData = AccountInfo;

export enum UserRoles {
  Student = 'STUDENT',
  Professor = 'PROFESSOR',
  FullProfessor = 'FULL_PROFESSOR',
  Company = 'COMPANY',
  Assistant = 'ASSISTANT',
  CampusManager = 'CAMPUS_MANAGER',
  CampusBoosterAdmin = 'CAMPUS_BOOSTER_ADMIN'
};

export type User = {
  id: number,
  role: UserRoles,
  active: boolean,
  banned: boolean,

  email: string,
  credits: number,
  avatar?: string,
  address: string,
  gender?: string,
  birthday: string,
  lastName: string,
  firstName: string,
  promotion?: number,
  personalEmail: string,
  campusId?: Campus['id'],

  Campus?: Campus,
  Grades?: Grade[],
  UserHasClassrooms?: UserHasClassroom[],

  azureData: AzureData // azure authentication data
};

export type PublicUser = {
  id: number,
  email: string,
  role: UserRoles,
  lastName: string,
  firstName: string
};

export type UserRequest = {
  id?: User['id'],
  role: UserRoles,
  avatar?: string,
  banned?: boolean,
  birthday: string,
  lastName: string,
  firstName: string,

  email: string,
  gender?: string,
  address: string,
  promotion?: number,
  personalEmail: string,

  campusId?: Campus['id'], // campus id
  classrooms: (Classroom['id'])[], // classrooms
};
