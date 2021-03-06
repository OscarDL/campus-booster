import copy from 'fast-copy';
import { toast } from 'react-toastify';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';

import { Campus } from '../../../../../../shared/types/campus';
import { useAppDispatch } from '../../../../../../store/store';
import { updateCampus } from '../../../../../../store/features/campus/slice';
import { Dialog, DialogActions, DialogContent, DialogTitle, MainDialogButton } from '../../../../../shared/dialog';


type Props = {
  open: boolean,
  campus: Campus,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
};


const UpdateCampus: FC<Props> = ({campus, open, setOpen}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [newCampus, setNewCampus] = useState(copy(campus));


  const formIsComplete = () => {
    if (!newCampus.virtual) return newCampus.name && newCampus.address && newCampus.city;
    return newCampus.name;
  };

  const handleUpdateCampus = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(updateCampus(newCampus)).unwrap();

      setOpen(false);
      toast.success(t('admin.campus.update.success', {campus: campus.name}));
    }
    catch (error: any) {
      toast.error(error);
    };

    setLoading(false);
  };


  useEffect(() => {
    // Reset state on new dialog open
    if (open) setNewCampus(copy(campus));
  }, [campus, open]);


  return (
    <Dialog
      fullWidth maxWidth="sm"
      components={{Root: 'form'}}
      open={open} onSubmit={handleUpdateCampus}
      onClose={() => loading ? null : setOpen(false)}
    >
      <DialogTitle>{t('admin.campus.update.title', {campus: campus.name})}</DialogTitle>

      <DialogContent>
        <Box sx={{mb: 2}}>
          <b>{t('admin.campus.update.select_campus_manager')}</b>
        </Box>

        <TextField
          required
          margin="dense"
          variant="standard"
          name="cb-campus-name"
          value={newCampus.name}
          label={t('admin.campus.fields.name')}
          onChange={e => setNewCampus({...newCampus, name: e.target.value})}
        />

        <TextField
          margin="dense"
          variant="standard"
          name="cb-campus-address"
          value={newCampus.address}
          required={!newCampus.virtual}
          label={t('admin.campus.fields.address')}
          onChange={e => setNewCampus({...newCampus, address: e.target.value})}
        />

        <Box className="MuiDialogContent-row">
          <TextField
            margin="dense"
            variant="standard"
            name="cb-campus-post-code"
            value={newCampus.postCode}
            required={!newCampus.virtual}
            label={t('admin.campus.fields.post_code')}
            onChange={e => setNewCampus({...newCampus, postCode: e.target.value})}
          />
          <TextField
            margin="dense"
            variant="standard"
            name="cb-campus-city"
            value={newCampus.city}
            required={!newCampus.virtual}
            label={t('admin.campus.fields.city')}
            onChange={e => setNewCampus({...newCampus, city: e.target.value})}
          />
        </Box>

        <Box className="MuiDialogContent-row" sx={{mt: 2}}>
          <FormGroup>
            <FormControlLabel
              label={t('admin.campus.fields.open')}
              control={<Checkbox
                checked={newCampus.open}
                onChange={e => setNewCampus({...newCampus, open: e.target.checked})}
              />}
            />
          </FormGroup>

          <FormGroup>
            <FormControlLabel
              label={t('admin.campus.fields.virtual')}
              control={<Checkbox
                checked={newCampus.virtual}
                onChange={e => setNewCampus({...newCampus, virtual: e.target.checked})}
              />}
            />
          </FormGroup>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button color="error" disabled={loading} onClick={() => setOpen(false)}>
          {t('global.cancel')}
        </Button>

        <MainDialogButton
          type="submit" variant="contained" loading={loading}
          disabled={isEqual(campus, newCampus) || !formIsComplete()}
        >
          {t('global.confirm')}
        </MainDialogButton>
      </DialogActions>
    </Dialog>
  );
};


export default UpdateCampus;
