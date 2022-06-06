import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';

import { useAppDispatch } from '../../../../../../store/store';
import { Teacher } from '../../../../../../shared/types/teacher';
import { deleteTeacher } from '../../../../../../store/features/teachers/slice';
import { Dialog, DialogActions, DialogContent, DialogTitle, MainDialogButton } from '../../../../../shared/dialog';


type Props = {
  open: boolean,
  teacher: Teacher,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
};


const DeleteTeacher: FC<Props> = ({teacher, open, setOpen}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const userFullName = `${teacher.User.firstName} ${teacher.User.lastName}`;


  const handleDeleteTeacher = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(deleteTeacher(teacher.id)).unwrap();

      setName('');
      setOpen(false);
      toast.success(t('admin.teachers.remove.success', {teacher: userFullName}));
    }
    catch (error: any) {
      toast.error(error);
    };

    setLoading(false);
  };


  useEffect(() => {
    // Reset state on new dialog open
    if (open) setName('');
  }, [open]);


  return (
    <Dialog
      components={{Root: 'form'}}
      onSubmit={handleDeleteTeacher}
      onClose={() => setOpen(false)}
      open={open} fullWidth maxWidth="sm"
    >
      <DialogTitle>{t('admin.teachers.remove.title', {user: userFullName})}</DialogTitle>

      <DialogContent>
        <p>{t('admin.teachers.remove.text')}</p>

        <TextField
          required autoFocus
          margin="dense" variant="standard"
          onChange={e => setName(e.target.value)}
          label={t('admin.teachers.remove.name_course', {
            user: userFullName, course: teacher.ClassroomHasCourse.Course?.name
          })}
        />
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={() => setOpen(false)}>
          {t('global.cancel')}
        </Button>

        <MainDialogButton
          type="submit" color="error" variant="contained"
          loading={loading} disabled={name !== userFullName}
        >
          {t('global.confirm')}
        </MainDialogButton>
      </DialogActions>
    </Dialog>
  );
};


export default DeleteTeacher;