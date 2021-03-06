import ReactSelect from 'react-select';
import { useTranslation } from 'react-i18next';
import React, { FC, useEffect, useState } from 'react';

import { useAppSelector } from '../../../../../store/store';
import { Classroom } from '../../../../../shared/types/classroom';
import { UserRequest, UserRoles } from '../../../../../shared/types/user';


type Props = {
  user: UserRequest,
  setUser: React.Dispatch<React.SetStateAction<UserRequest>>
};

type Option = {
  classroom: Classroom,
  label: string,
  value: number
};


const UserClassroomPicker: FC<Props> = ({user, setUser}) => {
  const { t } = useTranslation();
  const { campusList } = useAppSelector(state => state.campus);
  const { classroomsList } = useAppSelector(state => state.classrooms);

  const [classroomOptions, setClassroomOptions] = useState<Option[]>([]);


  useEffect(() => {
    if (campusList && classroomsList) {
      const classroomOptions: Option[] = classroomsList
        .filter(classroom => !classroom.campusId || classroom.campusId === user.campusId)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(classroom => ({
          classroom,
          value: classroom.id,
          label: classroom.name
        }));

      setClassroomOptions(classroomOptions);
    }
  }, [campusList, classroomsList, user.campusId]);


  return (!user.campusId || user.role !== UserRoles.Student) ? (
    <div>
      <ReactSelect
        isMulti
        isDisabled
        isSearchable
        menuPosition="fixed"
        closeMenuOnSelect={false}
        options={classroomOptions}
        className="react-select-component"
        classNamePrefix="react-select-component"
        placeholder={t('users.select_classrooms')}
        isLoading={!(campusList && classroomsList)}
        noOptionsMessage={() => t('users.no_classrooms')}
        onChange={classrooms => setUser({...user, classrooms: classrooms.map(c => c.value)})}
      />
    </div>
  ) : (
    <ReactSelect
      isMulti isSearchable
      menuPosition="fixed"
      closeMenuOnSelect={false}
      options={classroomOptions}
      className="react-select-component"
      classNamePrefix="react-select-component"
      placeholder={t('users.select_classrooms')}
      noOptionsMessage={() => t('users.no_classrooms')}
      value={classroomOptions.filter(option => user.classrooms.includes(option.value))}
      onChange={classrooms => setUser({...user, classrooms: classrooms.map(c => c.value)})}
    />
  );
};


export default UserClassroomPicker;
