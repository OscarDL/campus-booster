import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';

import { Course } from '../../../../../shared/types/course';
import { useAppDispatch } from '../../../../../store/store';
import { deleteCourse } from '../../../../../store/features/courses/slice';
import { Dialog, DialogActions, DialogContent, DialogTitle, MainDialogButton } from '../../../../shared/dialog';


type Props = {
  course: Course,
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
};


const DeleteCourse: FC<Props> = ({course, open, setOpen}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [courseName, setCourseName] = useState('');


  const handleDeleteCourse = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(deleteCourse(course.id)).unwrap();

      setOpen(false);
      toast.success(t('courses.delete.success'));
    }
    catch (error: any) {
      toast.error(error);
    };

    setLoading(false);
  };


  useEffect(() => {
    // Reset state on new dialog open
    if (open) setCourseName('');
  }, [open]);


  return (
    <Dialog
      components={{Root: 'form'}}
      onClose={() => setOpen(false)}
      onSubmit={handleDeleteCourse}
      open={open} fullWidth maxWidth="sm"
    >
      <DialogTitle>{t('courses.delete.title', {course: course.name})}</DialogTitle>

      <DialogContent>
        <p>{t('courses.delete.text')}</p>

        <TextField
          required autoFocus
          label={t('courses.delete.name')}
          margin="dense" variant="standard"
          onChange={e => setCourseName(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={() => setOpen(false)}>
          {t('global.cancel')}
        </Button>

        <MainDialogButton
          type="submit" color="error" variant="contained" 
          loading={loading} disabled={courseName !== course.name}
        >
          {t('global.confirm')}
        </MainDialogButton>
      </DialogActions>
    </Dialog>
  );
};


export default DeleteCourse;