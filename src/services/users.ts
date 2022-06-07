import axios from 'axios';
import { t } from 'i18next';

import { Classroom } from '../shared/types/classroom';
import { apiUrl, getAxiosConfig } from '../shared/api';
import { User, UserRequest } from '../shared/types/user';


const getUsers = async () => {
  try {
    const response = await axios.get(apiUrl + 'users', getAxiosConfig());
    return response.data;
  }

  catch (error: any) {
    return Promise.reject(error?.response?.data || t('api.error'));
  }
};

const getUserById = async (id: User['id']) => {
  try {
    const response = await axios.get(apiUrl + 'users/' + id, getAxiosConfig());
    return response.data;
  }

  catch (error: any) {
    return Promise.reject(error?.response?.data || t('api.error'));
  }
};

const getUsersForTeacher = async (id: User['id']) => {
  try {
    const response = await axios.get(apiUrl + 'users/teacher/' + id, getAxiosConfig());
    return response.data;
  }

  catch (error: any) {
    return Promise.reject(error?.response?.data || t('api.error'));
  }
};

const createUser = async (user: UserRequest) => {
  try {
    const response = await axios.post(apiUrl + 'users', user, getAxiosConfig());
    return response.data;
  }

  catch (error: any) {
    return Promise.reject(error?.response?.data || t('api.error'));
  }
};

const updateUser = async (user: UserRequest) => {
  try {
    const response = await axios.patch(apiUrl + 'users/' + user.id!, user, getAxiosConfig());
    return response.data;
  }

  catch (error: any) {
    return Promise.reject(error?.response?.data || t('api.error'));
  }
};

const updateBannedUser = async (id: UserRequest['id'], banned: UserRequest['banned']) => {
  try {
    const response = await axios.patch(apiUrl + 'users/' + id!, {banned}, getAxiosConfig());
    return response.data;
  }

  catch (error: any) {
    return Promise.reject(error?.response?.data || t('api.error'));
  }
};

const activateUser = async (userId: User['id']) => {
  try {
    const response = await axios.patch(apiUrl + `users/${userId}/activate`, {}, getAxiosConfig());
    return response.data;
  }

  catch (error: any) {
    return Promise.reject(error?.response?.data || t('api.error'));
  }
};

const resetUserPassword = async (userId: User['id'], personalEmail: User['personalEmail']) => {
  try {
    const response = await axios.patch(apiUrl + `users/${userId}/resetpassword`, {personalEmail}, getAxiosConfig());
    return response.data;
  }

  catch (error: any) {
    return Promise.reject(error?.response?.data || t('api.error'));
  }
};

const deleteUser = async (id: User['id'], deleteInAD: boolean) => {
  try {
    if (deleteInAD) await axios.delete(apiUrl + 'users/azure/' + id, getAxiosConfig());

    const response = await axios.delete(apiUrl + 'users/' + id, getAxiosConfig());
    return response.data;
  }

  catch (error: any) {
    return Promise.reject(error?.response?.data || t('api.error'));
  }
};


const addUserToClassrooms = async (id: User['id'], classrooms: (Classroom['id'])[]) => {
  try {
    const response = await axios.post(apiUrl + `users/${id}/classrooms/add`, {classrooms}, getAxiosConfig());
    return response.data;
  }
  
  catch (error: any) {
    return Promise.reject(error?.response?.data || t('api.error'));
  }
};

const removeUserFromClassrooms = async (id: User['id'], classrooms: (Classroom['id'])[]) => {
  try {
    const response = await axios.post(apiUrl + `users/${id}/classrooms/remove`, {classrooms}, getAxiosConfig());
    return response.data;
  }
  
  catch (error: any) {
    return Promise.reject(error?.response?.data || t('api.error'));
  }
};


const userService = {
  getUsers,
  getUserById,
  getUsersForTeacher,
  createUser,
  updateUser,
  updateBannedUser,
  activateUser,
  resetUserPassword,
  deleteUser,
  addUserToClassrooms,
  removeUserFromClassrooms
};

export default userService;
