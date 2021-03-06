import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';

import { useAppDispatch } from '../../../../../../store/store';
import { deleteTool } from '../../../../../../store/features/tools/slice';
import { ToolLinkBase64Image } from '../../../../../../shared/types/tool';
import { Dialog, DialogActions, DialogContent, DialogTitle, MainDialogButton } from '../../../../../shared/dialog';


type Props = {
  open: boolean,
  tool: ToolLinkBase64Image,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
};


const DeleteTool: FC<Props> = ({tool, open, setOpen}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [toolTitle, setToolTitle] = useState('');


  const handleDeleteTool = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(deleteTool(tool.id!)).unwrap();

      setOpen(false);
      toast.success(t('tools.delete.success', {tool: tool.title}));
    }
    catch (error: any) {
      toast.error(error);
    };

    setLoading(false);
  };


  useEffect(() => {
    // Reset state on new dialog open
    if (open) setToolTitle('');
  }, [open]);


  return (
    <Dialog
      fullWidth maxWidth="sm"
      components={{Root: 'form'}}
      open={open} onSubmit={handleDeleteTool}
      onClose={() => loading ? null : setOpen(false)}
    >
      <DialogTitle>{t('tools.delete.title', {tool: tool.title})}</DialogTitle>

      <DialogContent>
        <p>{t('tools.delete.text')}</p>

        <TextField
          required autoFocus sx={{my: 1}}
          margin="dense" variant="standard"
          onChange={e => setToolTitle(e.target.value)}
          label={t('tools.delete.name')} value={toolTitle}
        />
      </DialogContent>

      <DialogActions>
        <Button color="primary" disabled={loading} onClick={() => setOpen(false)}>
          {t('global.cancel')}
        </Button>

        <MainDialogButton
          type="submit" color="error" variant="contained"
          loading={loading} disabled={tool.title !== toolTitle}
        >
          {t('global.confirm')}
        </MainDialogButton>
      </DialogActions>
    </Dialog>
  );
};


export default DeleteTool;
