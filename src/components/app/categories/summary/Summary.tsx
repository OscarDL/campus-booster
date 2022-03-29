import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import './Summary.css';


const Summary: FC = () => {
  const { t } = useTranslation();


  useEffect(() => {
    document.title = `${t('brand')} - ${t('summary.title')}`;
  }, [t]);


  return (
    <>
      <p>Summary</p>
    </>
  );
};


export default Summary;
