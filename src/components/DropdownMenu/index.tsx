import { CSSTransition } from 'react-transition-group';

import Avvvatars from 'avvvatars-react';

import { DropdownItem } from 'components/DropdownItem';

import { useAuth } from 'hooks/useAuth';
import { useDropdown } from 'hooks/useDropdown';
import { usePhoto } from 'hooks/usePhoto';

import styles from './DropdownMenu.module.scss';

export function DropdownMenu() {
  const { user, isAlexander, isBarbeiro, handleLogout } = useAuth();
  const { activeMenu, dropdownRef, calcHeight, menuHeight } = useDropdown();

  const { photo } = usePhoto(user?.id || '');

  return (
    <div
      className={styles.dropdown}
      style={{ height: menuHeight }}
      ref={dropdownRef}
    >
      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className={styles.menu}>
          <DropdownItem link="/profile">
            {photo === '' &&
            (user?.user_metadata.avatar_url === null ||
              user?.user_metadata.avatar_url === undefined) ? (
              <div className={styles.imgProfile}>
                <Avvvatars value={user?.user_metadata.name || ''} size={30} />
              </div>
            ) : (
              <img
                src={
                  user?.user_metadata.avatar_url || user?.user_metadata.picture
                }
                alt={user?.user_metadata.name}
                className={styles.imgProfile}
              />
            )}
            Meu Perfil
          </DropdownItem>

          {isAlexander && (
            <DropdownItem link="/admin">Painel Admin</DropdownItem>
          )}
          {isBarbeiro && (
            <DropdownItem link="/horarios">Atualizar horários</DropdownItem>
          )}
          {isBarbeiro && (
            <DropdownItem link="/validate">Validar Horário</DropdownItem>
          )}
          <DropdownItem link="/bug">Relatar um bug</DropdownItem>

          <DropdownItem onClick={() => handleLogout()} logout>
            Sair
          </DropdownItem>
        </div>
      </CSSTransition>
    </div>
  );
}
