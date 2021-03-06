import { FC } from 'react';
import { Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { UserRoles } from '../../../../shared/types/user';

import Dropdown from '../../../shared/dropdown';


type TabsProps = {
  tab: number,
  setTab: React.Dispatch<React.SetStateAction<number>>
};


const UserTabs: FC<TabsProps> = ({tab, setTab}) => {
  const { t } = useTranslation();

  const tabAll = [{
    title: t('users.tab_all.title'),
    icon: t('users.tab_all.icon')
  }];
  const tabs = tabAll.concat(
    Object.values(UserRoles).map(role => ({
      title: t(`users.${role.toLowerCase()}.title_tab`),
      icon: t(`users.${role.toLowerCase()}.icon`)
    }))
  );

  return (
    <div className="container users-tabs-container">
      <div className="users-select">
        <Dropdown // Dropdown tabs for mobile
          align="center"
          id="users-select"
          icon={tabs[tab].icon}
          title={tabs[tab].title}
        >
          {tabs.map((tab, i) => (
            <div key={i} onClick={() => setTab(i)}>
              <span className="material-icons-outlined">{tab.icon}</span>
              {tab.title}
            </div>
          ))}
        </Dropdown>
      </div>

      <div className="users-tabs">
        <Tabs // Material tabs for desktop
          value={tab}
          variant="scrollable"
          scrollButtons="auto"
          onChange={(_, tab) => setTab(tab)}
        >
          {tabs.map((tab, i) => (
            <Tab key={i} tabIndex={0} label={tab.title}/>
          ))}
        </Tabs>
      </div>
    </div>
  );
};


export default UserTabs;
