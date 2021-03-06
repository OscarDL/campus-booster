import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';

import { Grade } from '../../../../../shared/types/grade';
import { useAppDispatch } from '../../../../../store/store';
import { deleteGrade } from '../../../../../store/features/grades/slice';
import { Dialog, DialogActions, DialogContent, DialogTitle, MainDialogButton } from '../../../../shared/dialog';


type Props = {
  grade: Grade,
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
};


const DeleteGrade: FC<Props> = ({grade, open, setOpen}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [studentGrade, setStudentGrade] = useState('');

  const textTemplate = `${grade.User?.firstName} ${grade.User?.lastName} (${grade.ClassroomHasCourse?.Course?.name} - ${grade.average}/20)`;


  const handleDeleteGrade = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(deleteGrade(grade.id)).unwrap();

      setOpen(false);
      toast.success(t('grades.delete.success'));
    }
    catch (error: any) {
      toast.error(error);
    };

    setLoading(false);
  };


  useEffect(() => {
    // Reset state on new dialog open
    if (open) setStudentGrade('');
  }, [open]);


  return (
    <Dialog
      fullWidth maxWidth="sm"
      components={{Root: 'form'}}
      open={open} onSubmit={handleDeleteGrade}
      onClose={() => loading ? null : setOpen(false)}
    >
      <DialogTitle>{t('grades.delete.title')}</DialogTitle>

      <DialogContent>
        <p>{t('grades.delete.text', {text: textTemplate})}</p>

        <TextField
          required autoFocus sx={{my: 1}}
          margin="dense" variant="standard"
          label={textTemplate} value={studentGrade}
          onChange={e => setStudentGrade(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button color="primary" disabled={loading} onClick={() => setOpen(false)}>
          {t('global.cancel')}
        </Button>

        <MainDialogButton
          type="submit" color="error" variant="contained" 
          loading={loading} disabled={studentGrade !== textTemplate}
        >
          {t('global.confirm')}
        </MainDialogButton>
      </DialogActions>
    </Dialog>
  );
};


export default DeleteGrade;
