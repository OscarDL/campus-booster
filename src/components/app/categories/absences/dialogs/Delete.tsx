import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';

import { useAppDispatch } from '../../../../../store/store';
import { Absence } from '../../../../../shared/types/absence';
import { deleteAbsence } from '../../../../../store/features/absences/slice';
import { Dialog, DialogActions, DialogContent, DialogTitle, MainDialogButton } from '../../../../shared/dialog';


type Props = {
  open: boolean,
  absence: Absence,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
};


const DeleteAbsence: FC<Props> = ({absence, open, setOpen}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [studentDate, setStudentDate] = useState('');
  const userFullName = `${absence.User.firstName} ${absence.User.lastName}`;
  const textTemplate = `${userFullName} (${dayjs(absence.Planning.date).format(t('global.date.mm-dd-yyyy'))})`;


  const handleDeleteAbsence = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(deleteAbsence(absence.id)).unwrap();

      setOpen(false);
      toast.success(t('absences.delete.success', {user: userFullName}));
    }
    catch (error: any) {
      toast.error(error);
    };

    setLoading(false);
  };


  useEffect(() => {
    // Reset state on new dialog open
    if (open) setStudentDate('');
  }, [open]);


  return (
    <Dialog
      fullWidth maxWidth="sm"
      components={{Root: 'form'}}
      open={open} onSubmit={handleDeleteAbsence}
      onClose={() => loading ? null : setOpen(false)}
    >
      <DialogTitle>{t('absences.delete.title', {user: userFullName})}</DialogTitle>

      <DialogContent>
        <p>{t('absences.delete.text')}</p>

        <TextField
          required autoFocus sx={{my: 1}}
          margin="dense" variant="standard"
          label={textTemplate} value={studentDate}
          onChange={e => setStudentDate(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button color="primary" disabled={loading} onClick={() => setOpen(false)}>
          {t('global.cancel')}
        </Button>

        <MainDialogButton
          type="submit" color="error" variant="contained"
          loading={loading} disabled={studentDate !== textTemplate}
        >
          {t('global.confirm')}
        </MainDialogButton>
      </DialogActions>
    </Dialog>
  );
};


export default DeleteAbsence;
