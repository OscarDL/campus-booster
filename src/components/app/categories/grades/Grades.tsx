import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGridApiRef } from '@mui/x-data-grid-pro';
import { FC, useEffect, useMemo, useState } from 'react';

import { Grade } from '../../../../shared/types/grade';
import { UserRoles } from '../../../../shared/types/user';
import { getGradesColumns } from '../../../../shared/utils/columns';
import { ContentBody, ContentHeader } from '../../../shared/content';
import { getCourses } from '../../../../store/features/courses/slice';
import { getMuiDataGridLocale } from '../../../../shared/utils/locales';
import { setDataGridValue } from '../../../../store/features/app/slice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { getUsers, getUsersForTeacher } from '../../../../store/features/users/slice';
import { getCurrentUserYear, getLoggedInAuthState } from '../../../../shared/functions';
import { DataGridFooter, DataGridHeader, StyledDataGrid } from '../../../shared/datagrid';
import { clearGrades, getGrades, getTeacherAsUserGrades, getUserGrades } from '../../../../store/features/grades/slice';

import GradeSum from './Sum';
import YearTabs from './Tabs';
import CreateGrade from './grade/Create';
import UpdateGrade from './grade/Update';
import DeleteGrade from './grade/Delete';
import Loader from '../../../shared/loader';


const Grades: FC = () => {
  const { t } = useTranslation();
  const apiRef = useGridApiRef();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(getLoggedInAuthState);
  const { settings } = useAppSelector(state => state.app);
  const { usersList } = useAppSelector(state => state.users);
  const { gradesList } = useAppSelector(state => state.grades);
  const { coursesList } = useAppSelector(state => state.courses);

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [tab, setTab] = useState(getCurrentUserYear(user));
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const columns = useMemo(() => (
    getGradesColumns({user, setOpenUpdate, setOpenDelete, setSelectedRow: setSelectedGrade})
  ), [user]);

  const showUserGradeSum = useMemo(() => (
    gradesList && tab > 0 && user.role === UserRoles.Student
  ), [gradesList, user, tab]);


  useEffect(() => {
    const initData = async () => {
      if (!coursesList) await dispatch(getCourses());

      if (!gradesList) {
        switch (user.role) {
          case UserRoles.Student: {
            if (!usersList) await dispatch(getUsersForTeacher(user.id));
            await dispatch(getUserGrades(user.id));
            break;
          }

          case UserRoles.Company:
          case UserRoles.Professor:
          case UserRoles.FullProfessor: {
            if (!usersList) await dispatch(getUsersForTeacher(user.id));
            await dispatch(getTeacherAsUserGrades(user.id));
            break;
          }

          case UserRoles.Assistant:
          case UserRoles.CampusManager:
          case UserRoles.CampusBoosterAdmin: {
            if (!usersList) await dispatch(getUsers());
            await dispatch(getGrades());
          }
        };
      }
    };

    // Do NOT include useEffect dependencies from initData() prior to grades list
    // to avoid calling the API with other dispatch calls multiple times unnecessarily.
    initData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradesList, user.id, user.role, dispatch]);

  useEffect(() => {
    apiRef.current.setColumnVisibility('year', tab === 0);
  }, [apiRef, tab]);


  return (
    <>
      <ContentHeader title={t('grades.title')}>
        {(user.role !== UserRoles.Student || (usersList && usersList?.length > 0)) && (
          <Button
            className="button"
            onClick={() => setOpenCreate(true)}
            startIcon={<span className="material-icons">add_circle_outline</span>}
          >
            {t('grades.create.button')}
          </Button>
        )}
      </ContentHeader>

      <YearTabs tab={tab} setTab={setTab}/>

      <ContentBody>
        <StyledDataGrid
          apiRef={apiRef}
          checkboxSelection
          disableColumnPinning
          disableSelectionOnClick

          columns={columns}
          loading={!gradesList}
          rows={(gradesList ?? [])
            .filter(grade => tab > 0 ? grade.ClassroomHasCourse?.Course?.year === tab : true)
            .sort((a, b) => (a.ClassroomHasCourse?.Course?.name ?? '').localeCompare(b.ClassroomHasCourse?.Course?.name ?? ''))
          }
          pageSize={settings.dataGrid.pageSize} pagination={settings.dataGrid.pagination}
          onPageSizeChange={value => dispatch(setDataGridValue({key: 'pageSize', value}))}

          components={{
            LoadingOverlay: Loader,

            Toolbar: () => (
              <DataGridHeader
                loading={!gradesList} refreshData={() => dispatch(clearGrades())}
                title={t('grades.fields.title', {count: apiRef.current.getVisibleRowModels().size})}
              />
            ),

            Footer: () => <DataGridFooter/>
          }}

          localeText={getMuiDataGridLocale(settings.lang)}
        />

        {showUserGradeSum && <GradeSum tab={tab}/>}
      </ContentBody>

      <CreateGrade open={openCreate} setOpen={setOpenCreate}/>

      {selectedGrade && <>
        <UpdateGrade grade={selectedGrade} open={openUpdate} setOpen={setOpenUpdate}/>
        <DeleteGrade grade={selectedGrade} open={openDelete} setOpen={setOpenDelete}/>
      </>}
    </>
  );
};


export default Grades;
