import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ContentHeader } from '../../components/shared/content';
import Accounting from '../../components/app/categories/accounting/Accounting';


const AccountingView: FC = () => {
  const { t } = useTranslation();


  useEffect(() => {
    document.title = `${t('brand')} - ${t('accounting.title')}`;
  }, [t]);


  return (
    <div className="accounting-view">
      <ContentHeader>
        <h2>{t('accounting.title')}</h2>
      </ContentHeader>

      <Accounting/>
    </div>
  );
};


export default AccountingView;
