import copy from 'fast-copy';
import { toast } from 'react-toastify';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { Close, Replay } from '@mui/icons-material';
import { FC, useEffect, useRef, useState } from 'react';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, styled, TextField } from '@mui/material';

import { useAppDispatch } from '../../../../../../store/store';
import { updateTool } from '../../../../../../store/features/tools/slice';
import { ToolCategory, ToolLink } from '../../../../../../shared/types/tool';
import { allowedFileTypes, maxImageSize } from '../../../../../../shared/utils/values';
import { Dialog, DialogActions, DialogContent, DialogTitle, MainDialogButton } from '../../../../../shared/dialog';


type Props = {
  open: boolean,
  tool: ToolLink,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
};


const Input = styled('input')({display: 'none'});


const UpdateTool: FC<Props> = ({open, tool, setOpen}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const image = useRef<File>();
  const [loading, setLoading] = useState(false);
  const [newTool, setNewTool] = useState(copy(tool));


  const handleAddImage = (e: React.FormEvent<HTMLInputElement>) => {
    const result = e.target as HTMLInputElement;
    const file = result.files?.[0];

    if (file && file.size > maxImageSize) {
      toast.error(t('tools.image_too_large', {size: maxImageSize/1024/1024})); // bytes to megabytes
      return;
    }

    if (!file) {
      setNewTool({...newTool, img: ''});
      image.current = undefined;
      return;
    }

    image.current = file;
    setNewTool({...newTool, img: file.name});
  };

  const handleRemoveImage = () => {
    image.current = undefined;
    setNewTool({...newTool, img: ''});
  };

  const handleResetImage = () => {
    image.current = undefined;
    setNewTool({...newTool, img: tool.img});
  };

  const handleUpdateTool = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);

    const toolData = new FormData();
    toolData.append('img', newTool.img);
    toolData.append('url', newTool.url);
    toolData.append('title', newTool.title);
    toolData.append('category', newTool.category);
    toolData.append('description', newTool.description);
    if (image.current) toolData.append('file', image.current);

    try {
      await dispatch(updateTool({id: tool.id!, toolData})).unwrap();

      setOpen(false);
      toast.success(t('tools.update.success', {tool: tool.title}));
    }
    catch (error: any) {
      toast.error(error);
    };

    setLoading(false);
  };


  useEffect(() => {
    // Reset state on new dialog open
    if (open) setNewTool(copy(tool));
  }, [open, tool]);


  return (
    <Dialog
      fullWidth maxWidth="sm"
      components={{Root: 'form'}}
      open={open} onSubmit={handleUpdateTool}
      onClose={() => loading ? null : setOpen(false)}
    >
      <DialogTitle>{t('tools.update.title', {tool: tool.title})}</DialogTitle>

      <DialogContent>
        <FormControl sx={{mb: 2}}>
          <InputLabel id="tool-select-category">{t('tools.update.category')}</InputLabel>
          <Select
            size="small" value={newTool.category}
            labelId="tool-select-category" label={t('tools.update.category')}
            onChange={e => setNewTool({...newTool, category: e.target.value as ToolCategory})}
          >
            {Object.values(ToolCategory).map(category => (
              <MenuItem key={category} value={category}>
                {t(`tools.${category}.title`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box className="MuiDialogContent-row">
          <TextField
            required
            autoFocus
            margin="dense"
            variant="standard"
            name="cb-tool-name"
            value={newTool.title ?? ''}
            label={t('tools.update.name')}
            onChange={e => setNewTool({...newTool, title: e.target.value})}
          />
          <TextField
            required
            margin="dense"
            variant="standard"
            name="cb-tool-url"
            value={newTool.url ?? ''}
            label={t('tools.update.url')}
            onChange={e => setNewTool({...newTool, url: e.target.value})}
          />
        </Box>

        <TextField
          name="cb-tool-description"
          sx={{mb: 2}} margin="normal"
          required fullWidth multiline
          value={newTool.description ?? ''}
          label={t('tools.update.description')}
          onChange={e => setNewTool({...newTool, description: e.target.value})}
        />

        <Box sx={{display: 'grid', gap: '10px'}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <label htmlFor="file-btn">
              <Input
                disabled={loading}
                onInput={handleAddImage}
                type="file" id="file-btn"
                accept={allowedFileTypes.tools.join(', ')}
              />
              <Button variant="contained" component="span">
                {t('tools.update.image')}
              </Button>
            </label>

            <IconButton
              onClick={handleRemoveImage}
              disabled={loading || !newTool.img}
              sx={{p: '6px', ml: 2}} color="error"
            >
              <Close/>
            </IconButton>

            <IconButton
              sx={{p: '6px', ml: 1}}
              onClick={handleResetImage}
              disabled={loading || tool.img === newTool.img}
            >
              <Replay/>
            </IconButton>
          </Box>

          <p className="text-overflow" title={newTool.img}>
            {newTool.img || t('tools.update.no_image')}
          </p>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button color="error" disabled={loading} onClick={() => setOpen(false)}>
          {t('global.cancel')}
        </Button>

        <MainDialogButton
          type="submit" variant="contained" loading={loading}
          disabled={isEqual(tool, newTool) || !(newTool.title && newTool.description && newTool.url)}
        >
          {t('global.confirm')}
        </MainDialogButton>
      </DialogActions>
    </Dialog>
  );
};


export default UpdateTool;
