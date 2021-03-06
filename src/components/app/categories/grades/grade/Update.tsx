import copy from 'fast-copy';
import { toast } from 'react-toastify';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import { Box, Button, InputAdornment, TextField } from '@mui/material';

import { Grade } from '../../../../../shared/types/grade';
import { useAppDispatch } from '../../../../../store/store';
import { updateGrade } from '../../../../../store/features/grades/slice';
import { Dialog, DialogActions, DialogContent, DialogTitle, MainDialogButton } from '../../../../shared/dialog';

import GradeUserPicker from './pickers/UserPicker';
import GradeCoursePicker from './pickers/CoursePicker';
import GradeTeacherPicker from './pickers/TeacherPicker';


type Props = {
  grade: Grade,
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
};


const UpdateGrade: FC<Props> = ({grade, open, setOpen}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [newGrade, setNewGrade] = useState(copy(grade));


  const handleChangeGrade = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;

    setNewGrade({...newGrade, average: value});
  };

  const handleUpdateGrade = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const grade: Partial<Grade> = {
        id: newGrade.id,
        average: newGrade.average,
        comment: newGrade.comment
      };
      await dispatch(updateGrade(grade)).unwrap();

      setOpen(false);
      toast.success(t('grades.update.success'));
    }
    catch (error: any) {
      toast.error(error);
    };

    setLoading(false);
  };


  useEffect(() => {
    if (open) setNewGrade(copy(grade));
  }, [grade, open]);


  return (
    <Dialog
      fullWidth maxWidth="sm"
      components={{Root: 'form'}}
      open={open} onSubmit={handleUpdateGrade}
      onClose={() => loading ? null : setOpen(false)}
    >
      <DialogTitle>{t('grades.update.title')}</DialogTitle>

      <DialogContent>
        <Box sx={{mb: 2}}>
          <GradeUserPicker grade={newGrade} setGrade={setNewGrade}/>
        </Box>

        <Box sx={{mb: 2}}>
          <GradeCoursePicker grade={newGrade} setGrade={setNewGrade}/>
        </Box>

        <Box sx={{mb: 2}}>
          <GradeTeacherPicker grade={newGrade} setGrade={setNewGrade}/>
        </Box>

        <Box sx={{mb: 2}}>
          <TextField
            type="number"
            required fullWidth
            name="cb-grade-grade"
            onChange={handleChangeGrade}
            value={newGrade.average ?? ''}
            label={t('grades.fields.grade')}
            inputProps={{inputMode: 'numeric', pattern: '[0-9]*', min: 0, max: 20, step: 0.01}}
            InputProps={{
              autoComplete: Date.now().toString(), // requires a unique value to be disabled
              endAdornment: <InputAdornment position="end">/ 20</InputAdornment>
            }}
          />
        </Box>

        <TextField
          multiline fullWidth
          name="cb-grade-comment"
          value={newGrade.comment ?? ''}
          label={t('grades.fields.comment')}
          onChange={e => setNewGrade({...newGrade, comment: e.target.value})}
        />
      </DialogContent>

      <DialogActions>
        <Button color="error" disabled={loading} onClick={() => setOpen(false)}>
          {t('global.cancel')}
        </Button>

        <MainDialogButton
          type="submit" variant="contained" loading={loading}
          disabled={isEqual(grade, newGrade) || !newGrade.teacherId}
        >
          {t('global.confirm')}
        </MainDialogButton>
      </DialogActions>
    </Dialog>
  );
};


export default UpdateGrade;
