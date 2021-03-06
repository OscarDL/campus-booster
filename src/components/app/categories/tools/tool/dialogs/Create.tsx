import { toast } from 'react-toastify';
import { Close } from '@mui/icons-material';
import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, styled, TextField } from '@mui/material';

import { createTool } from '../../../../../../store/features/tools/slice';
import { useAppDispatch, useAppSelector } from '../../../../../../store/store';
import { ToolCategory, ToolRequest } from '../../../../../../shared/types/tool';
import { allowedFileTypes, maxImageSize } from '../../../../../../shared/utils/values';
import { Dialog, DialogActions, DialogContent, DialogTitle, MainDialogButton } from '../../../../../shared/dialog';


type Props = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
};

const newToolRequest = (): ToolRequest => ({
  img: '', url: '', title: '', category: ToolCategory.General, description: ''
});

const Input = styled('input')({display: 'none'});


const CreateTool: FC<Props> = ({open, setOpen}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { toolsList } = useAppSelector(state => state.tools);

  const image = useRef<File>();
  const [loading, setLoading] = useState(false);
  const [tool, setTool] = useState(newToolRequest());


  const handleAddImage = (e: React.FormEvent<HTMLInputElement>) => {
    const result = e.target as HTMLInputElement;
    const file = result.files?.[0];

    if (file && file.size > maxImageSize) {
      toast.error(t('tools.image_too_large', {size: maxImageSize/1024/1024})); // bytes to megabytes
      return;
    }

    if (!file) {
      setTool({...tool, img: ''});
      image.current = undefined;
      return;
    }

    image.current = file;
    setTool({...tool, img: file.name});
  };

  const handleRemoveImage = () => {
    image.current = undefined;
    setTool({...tool, img: ''});
  };

  const handleCreateTool = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);

    const toolData = new FormData();
    toolData.append('url', tool.url);
    toolData.append('title', tool.title);
    toolData.append('category', tool.category);
    toolData.append('description', tool.description);
    if (image.current) toolData.append('file', image.current);

    try {
      await dispatch(createTool(toolData)).unwrap();

      setOpen(false);
      setTool(newToolRequest());
      toast.success(t('tools.create.success', {tool: tool.title}));
    }
    catch (error: any) {
      toast.error(error);
    };

    setLoading(false);
  };


  return (
    <Dialog
      fullWidth maxWidth="sm"
      components={{Root: 'form'}}
      open={open} onSubmit={handleCreateTool}
      onClose={() => loading ? null : setOpen(false)}
    >
      <DialogTitle>{t('tools.create.title')}</DialogTitle>

      <DialogContent>
        <FormControl sx={{mb: 2}}>
          <InputLabel id="tool-select-category">{t('tools.create.category')}</InputLabel>
          <Select
            size="small" value={tool.category}
            labelId="tool-select-category" label={t('tools.create.category')}
            onChange={e => setTool({...tool, category: e.target.value as ToolCategory})}
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
            value={tool.title ?? ''}
            label={t('tools.create.name')}
            onChange={e => setTool({...tool, title: e.target.value})}
          />
          <TextField
            required
            margin="dense"
            variant="standard"
            name="cb-tool-url"
            value={tool.url ?? ''}
            label={t('tools.create.url')}
            onChange={e => setTool({...tool, url: e.target.value})}
          />
        </Box>

        <TextField
          name="cb-tool-description"
          sx={{mb: 2}} margin="normal"
          required fullWidth multiline
          value={tool.description ?? ''}
          label={t('tools.create.description')}
          onChange={e => setTool({...tool, description: e.target.value})}
        />

        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center'}}>
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
            sx={{p: '6px'}} color="error"
            disabled={loading || !tool.img}
          >
            <Close/>
          </IconButton>

          <p className="text-overflow" title={tool.img}>
            {tool.img || t('tools.create.no_image')}
          </p>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button color="error" disabled={loading} onClick={() => setOpen(false)}>
          {t('global.cancel')}
        </Button>

        <MainDialogButton
          type="submit" variant="contained" loading={loading}
          disabled={!toolsList || !(tool.title && tool.description && tool.url)}
        >
          {t('global.confirm')}
        </MainDialogButton>
      </DialogActions>
    </Dialog>
  );
};


export default CreateTool;
