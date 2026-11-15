import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { Link, useLocation } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => {
  const pathname = useLocation();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to="/"
            className={clsx(
              styles.link,
              pathname.pathname === '/' && styles.link_active
            )}
          >
            <BurgerIcon type={'primary'} />
            <p className="text text_type_main-default ml-2 mr-10">Конструктор</p>
          </Link>
          <Link
            to="/feed"
            className={clsx(
              styles.link,
              pathname.pathname === '/feed' && styles.link_active
            )}
          >
            <ListIcon type={'primary'} />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </Link>
        </div>
        <Link to="/" className={styles.logo}>
          <Logo className="" />
        </Link>
        <Link
          to="/profile"
          className={clsx(
            styles.link,
            pathname.pathname === '/profile' && styles.link_active
          )}
        >
          <ProfileIcon type={'primary'} />
          <p className="text text_type_main-default ml-2">
            {userName ?? 'Личный кабинет'}
          </p>
        </Link>
      </nav>
    </header>
  );
};
