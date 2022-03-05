import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getAuthStateWithUser } from '../../../shared/utils';
import { logout } from '../../../store/features/auth/authSlice';

import './Header.css';


function Header() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector(getAuthStateWithUser);

  const toggleDropdown = (id: string) => {
    document.querySelector('#' + id)?.classList.toggle('open');
    document.querySelectorAll('.dropdown > ul').forEach((dropdown) => (
      dropdown.id !== id && dropdown.classList.remove('open') // close other dropdowns if any
    ));
  };


  useEffect(() => {
    const dropdown = (e: any) => {
      if (!e.target.className.includes('dropdown')) {
        document.querySelector('#user')?.classList.remove('open');
        document.querySelector('#admin')?.classList.remove('open');
      }
    };
    document.addEventListener('click', dropdown);

    return () => document.removeEventListener('click', dropdown);
  }, [t]);

  
  return (
    <div className="header">
      <div className="branding">
        <img src="/assets/images/logo192.png" alt="Logo SUPINFO"/>
        <span>SUPINFO</span>
      </div>

      <div className="nav">
        <nav>
          <Link to="/reporting" className={window.location.pathname === '/' ? 'selected' : ''}>
            <span className="material-icons-round">bar_chart</span>
            <span>{t('header.reporting')}</span>
          </Link>
          <Link to="/realtime" className={window.location.pathname.startsWith('/marks') ? 'selected' : ''}>
            <span className="material-icons-outlined">timer</span>
            <span>{t('header.realtime')}</span>
          </Link>
        </nav>
        
        <div className={window.location.pathname.startsWith('/settings') ? 'dropdown selected' : 'dropdown'}>
          <ul className="dropdown__list" id="user">
            <li><Link to="/settings">{t('header.user.settings')}</Link></li>
            <li onClick={() => dispatch(logout())}><span>{t('header.user.logout')}</span></li>
          </ul>

          <div className="dropdown__content" onClick={() => toggleDropdown('user')}>
            <span className="dropdown__open material-icons-outlined dropdown__icon">account_circle</span>
            <span className="dropdown__open dropdown__title">{user.name}</span>
            <span className="dropdown__open material-icons-round dropdown__arrow">expand_more</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
