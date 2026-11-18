import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => {
  const location = useLocation();

  const getIconType = (path: string, end: boolean): 'primary' | 'secondary' => {
    if (end) {
      return location.pathname === path || location.pathname.startsWith('/ingredients/')
        ? 'primary'
        : 'secondary';
    }
    return location.pathname.startsWith(path) ? 'primary' : 'secondary';
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to="/"
            end
            className={clsx(
              styles.link,
              (location.pathname === '/' ||
                location.pathname.startsWith('/ingredients/')) &&
                styles.link_active
            )}
          >
            <BurgerIcon type={getIconType('/', true)} />
            <p className="text text_type_main-default ml-2 mr-10">Конструктор</p>
          </NavLink>
          <NavLink
            to="/feed"
            className={({ isActive }) =>
              clsx(styles.link, isActive && styles.link_active)
            }
          >
            <ListIcon type={getIconType('/feed', false)} />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </NavLink>
        </div>
        <NavLink to="/" end className={styles.logo}>
          <Logo className="" />
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => clsx(styles.link, isActive && styles.link_active)}
        >
          <ProfileIcon type={getIconType('/profile', false)} />
          <p className="text text_type_main-default ml-2">
            {userName ?? 'Личный кабинет'}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};
