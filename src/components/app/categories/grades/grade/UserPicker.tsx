import ReactSelect from 'react-select';
import { useTranslation } from 'react-i18next';
import React, { FC, useEffect, useState } from 'react';

import { useAppSelector } from '../../../../../store/store';
import { User, UserRoles } from '../../../../../shared/types/user';
import { Grade, GradeRequest } from '../../../../../shared/types/grade';


type Props = {
  type: 'user' | 'teacher',
  grade: Grade | GradeRequest,
  setGrade: React.Dispatch<React.SetStateAction<any>>
};

type Option = {
  user: User,
  value: any,
  label: string
};


const GradeUserPicker: FC<Props> = ({type, grade, setGrade}) => {
  const { t } = useTranslation();
  const { usersList } = useAppSelector(state => state.users);
  
  const typeId = type === 'user' ? 'userId' : 'teacherId';
  const [userOptions, setUserOptions] = useState<Option[]>([]);


  useEffect(() => {
    if (usersList) {
      const userOptions: Option[] = usersList
        .filter(user => user.role === UserRoles[type === 'user' ? 'Student' : 'Professor'])
        .map(user => ({
          user,
          value: user.id,
          label: `${user.firstName} ${user.lastName}`
        }));

      setUserOptions(userOptions);
    }
  }, [usersList, type]);


  return (
    <ReactSelect
      isSearchable
      options={userOptions}
      isLoading={!usersList}
      className="react-select-component"
      classNamePrefix="react-select-component"
      isDisabled={!usersList || type === 'teacher'}
      onChange={user => setGrade({...grade, [typeId]: user?.value})}
      value={userOptions.find(option => option.user.id === grade[typeId])}
      formatOptionLabel={option => `${option.label} (${option.user.email})`}
      placeholder={t('grades.' + (type === 'user' ? 'select_user' : 'fields.teacher'))}
    />
  );
};


export default GradeUserPicker;
