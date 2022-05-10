import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import { Button, Tab, Tabs } from '@mui/material';

import { getTools } from '../../../../store/features/tools/slice';
import { getLoggedInAuthState } from '../../../../shared/functions';
import { ContentBody, ContentHeader } from '../../../shared/content';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { DispatchWithCallback, useStateWithCallback } from '../../../../shared/hooks';

import ToolTab from './tool/Tab';
import Loader from '../../../shared/loader';
import CreateTool from './tool/dialogs/Create';
import Dropdown from '../../../shared/dropdown';

import './Tools.css';


type TabsProps = {
  tab: number,
  setTab: DispatchWithCallback<React.SetStateAction<number>>
};

type TabDivProps = {
  tab: number,
  children: React.ReactNode
};


const ToolTabs: FC<TabsProps> = ({tab, setTab}) => {
  const { t } = useTranslation();

  const tabs = [{
    title: t('tools.general'),
    icon: 'language'
  }, {
    title: t('tools.development'),
    icon: 'terminal'
  }, {
    title: t('tools.infrastructure'),
    icon: 'storage'
  }, {
    title: t('tools.net-sec'),
    icon: 'security'
  }];

  const animateNewTab = (_: any, newTab: any) => {
    setTab(newTab, () => {
      const tabElement = document.getElementById('tools-tab-' + newTab);
      tabElement?.classList.add(`tab-slide-${tab > newTab ? 'left' : 'right'}`);
    });
  };

  return (
    <div className="container tools-tabs-container">
      <div className="tools-select">
        <Dropdown // Dropdown tabs for mobile
          align="center"
          id="tools-select"
          icon={tabs[tab].icon}
          title={tabs[tab].title}
        >
          {tabs.map((tab, i) => <div key={i} onClick={() => setTab(i)}>{tab.title}</div>)}
        </Dropdown>
      </div>

      <div className="tools-tabs">
        <Tabs // Material tabs for desktop
          value={tab}
          variant="scrollable"
          scrollButtons={false}
          onChange={animateNewTab}
        >
          {tabs.map((tab, i) => (
            <Tab key={i} tabIndex={0} label={tab.title}/>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

const TabDiv: FC<TabDivProps> = ({children, tab}) => (
  <div className="tools-tab" id={`tools-tab-${tab}`}>
    {children}
  </div>
);


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
      <ContentHeader title={t('tools.title')}>
        {user.role === 'CAMPUS_BOOSTER_ADMIN' && (
          <Button
            className="button"
            onClick={() => setOpen(true)}
            startIcon={<span className="material-icons">add_circle_outline</span>}
          >
            {t('tools.add')}
          </Button>
        )}
      </ContentHeader>

      <ToolTabs tab={tab} setTab={setTab}/>

      <ContentBody>
        {toolsList ? (
          <>
            {tab === 0 && (
              <TabDiv tab={tab}>
                <ToolTab tools={toolsList.filter(tool => tool.category === 'general')}/>
              </TabDiv>
            )}
            {tab === 1 && (
              <TabDiv tab={tab}>
                <ToolTab tools={toolsList.filter(tool => tool.category === 'development')}/>
              </TabDiv> 
            )}
            {tab === 2 && (
              <TabDiv tab={tab}>
                <ToolTab tools={toolsList.filter(tool => tool.category === 'infrastructure')}/>
              </TabDiv>
            )}
            {tab === 3 && (
              <TabDiv tab={tab}>
                <ToolTab tools={toolsList.filter(tool => tool.category === 'net-sec')}/>
              </TabDiv>
            )}
          </>
        ) : (
          <Loader fullSize clickThrough/>
        )}
      </ContentBody>

      <CreateTool open={open} setOpen={setOpen}/>
    </>
  );
};


export default Tools;
