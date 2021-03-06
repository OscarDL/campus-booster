import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';

import { UserRoles } from '../../../../shared/types/user';
import { ToolCategory } from '../../../../shared/types/tool';
import { useStateWithCallback } from '../../../../shared/hooks';
import { getTools } from '../../../../store/features/tools/slice';
import { getLoggedInAuthState } from '../../../../shared/functions';
import { ContentBody, ContentHeader } from '../../../shared/content';
import { useAppDispatch, useAppSelector } from '../../../../store/store';

import ToolTabs from './Tabs';
import ToolTab from './tool/Tab';
import Loader from '../../../shared/loader';
import CreateTool from './tool/dialogs/Create';


const Tools: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(getLoggedInAuthState);
  const { toolsList } = useAppSelector(state => state.tools);

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useStateWithCallback(0);


  useEffect(() => {
    if (!toolsList) dispatch(getTools());
  }, [toolsList, dispatch]);


  return (
    <>
      <ContentHeader
        title={t('tools.title')}
        underHeaderComponent={<ToolTabs tab={tab} setTab={setTab}/>}
      >
        {user.role === UserRoles.CampusBoosterAdmin && (
          <Button
            className="button"
            onClick={() => setOpen(true)}
            startIcon={<span className="material-icons">add_circle_outline</span>}
          >
            {t('tools.create.button')}
          </Button>
        )}
      </ContentHeader>

      {toolsList ? (
        Object.values(ToolCategory).map((category, key) => (tab === key && (
          <ContentBody key={key} className="tools-tab" id={`tools-tab-${tab}`}>
            <ToolTab key={tab} tools={toolsList.filter(tool => tool.category === category)}/>
          </ContentBody>
        )))
      ) : (
        <Loader fullSize clickThrough/>
      )}

      <CreateTool open={open} setOpen={setOpen}/>
    </>
  );
};


export default Tools;
