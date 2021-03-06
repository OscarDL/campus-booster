import ReactSelect from 'react-select';
import { useTranslation } from 'react-i18next';
import React, { FC, useEffect, useState } from 'react';

import { useAppSelector } from '../../../../../../../store/store';
import { TeacherRequest } from '../../../../../../../shared/types/teacher';
import { Classroom, ClassroomHasCourse } from '../../../../../../../shared/types/classroom';


type Props = {
  teacher: TeacherRequest,
  classroom: Classroom | undefined,
  setTeacher: React.Dispatch<React.SetStateAction<TeacherRequest>>
};

type Option = {
  value: any,
  label: string,
  ClassroomHasCourse: ClassroomHasCourse
};


const TeacherCoursePicker: FC<Props> = ({classroom, teacher, setTeacher}) => {
  const { t } = useTranslation();
  const { usersList } = useAppSelector(state => state.users);
  const { coursesList } = useAppSelector(state => state.courses);
  const { teachersList } = useAppSelector(state => state.teachers);
  
  const [coursesOptions, setCoursesOptions] = useState<Option[]>([]);


  useEffect(() => {
    if (classroom) {
      const courses = teachersList
        ?.filter(t => t.userId === teacher.userId)
        ?.map(teacher => teacher.ClassroomHasCourse.Course?.id ?? 0) ?? [];

      const coursesOptions: Option[] = (classroom.ClassroomHasCourses ?? [])
        .filter(chc => !courses.includes(chc.Course?.id ?? 0))
        .sort((a, b) => a.Course?.name?.localeCompare(b.Course?.name ?? '') ?? 1)
        .concat(teacher.id ? (classroom.ClassroomHasCourses?.find(chc => chc.id === teacher.classroomHasCourseId) ?? []) : [])
        .map(chc => ({
          ClassroomHasCourse: chc,
          value: chc.id,
          label: `${chc.Course?.name} (${chc.Course?.description})`
        }));

      setCoursesOptions(coursesOptions);
    }
  }, [classroom, teacher, teachersList]);


  return !teacher.classroomHasCourseId ? (
    // We have to do it this way because for some reason, setting the value
    // to undefined doesn't refresh the value shown in the component's view
    <div>
      <ReactSelect
        isSearchable
        menuPosition="fixed"
        options={coursesOptions}
        className="react-select-component"
        isLoading={!(coursesList && usersList)}
        classNamePrefix="react-select-component"
        placeholder={t('admin.teachers.add.select_course')}
        isDisabled={!(coursesList && usersList) || !classroom}
        onChange={option => setTeacher({...teacher, classroomHasCourseId: option?.value ?? 0})}
      />
    </div>
  ) : (
    <ReactSelect
      isSearchable
      menuPosition="fixed"
      options={coursesOptions}
      className="react-select-component"
      placeholder={t('grades.select_course')}
      classNamePrefix="react-select-component"
      onChange={option => setTeacher({...teacher, classroomHasCourseId: option?.value ?? 0})}
      value={coursesOptions.find(option => option.ClassroomHasCourse.id === teacher.classroomHasCourseId)}
    />
  );
};


export default TeacherCoursePicker;
