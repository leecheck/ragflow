import { Domain } from '@/constants/common';
import { useTranslate } from '@/hooks/common-hooks';
import { useLogout } from '@/hooks/login-hooks';
import { useSecondPathName } from '@/hooks/route-hook';
import { useFetchSystemVersion, useFetchUserInfo } from '@/hooks/user-setting-hooks';
import type { MenuProps } from 'antd';
import { Flex, Menu } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'umi';
import {
  UserSettingBaseKey,
  UserSettingIconMap,
  UserSettingRouteKey,
} from '../constants';
import styles from './index.less';

type MenuItem = Required<MenuProps>['items'][number];

const SideBar = () => {
  const navigate = useNavigate();
  const pathName = useSecondPathName();
  const { logout } = useLogout();
  const { t } = useTranslate('setting');
  const { version, fetchSystemVersion } = useFetchSystemVersion();

  const { data: userInfo } = useFetchUserInfo();
  const superMenus = [UserSettingRouteKey.Model, UserSettingRouteKey.System, UserSettingRouteKey.Api, UserSettingRouteKey.Password]

  useEffect(() => {
    if (location.host !== Domain) {
      fetchSystemVersion();
    }
  }, [fetchSystemVersion]);
  UserSettingRouteKey
  function getItem(
    label: string,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
  ): MenuItem {
    if (userInfo.email == "superuser") {
      return {
        key,
        icon,
        children,
        label: (
          <Flex justify={'space-between'}>
            {t(label)}
            <span className={styles.version}>
              {label === 'system' && version}
            </span>
          </Flex>
        ),
        type,
      } as MenuItem;
    } else {
      if (!superMenus.includes(key)) {
        return {
          key,
          icon,
          children,
          label: (
            <Flex justify={'space-between'}>
              {t(label)}
              <span className={styles.version}>
                {label === 'system' && version}
              </span>
            </Flex>
          ),
          type,
        } as MenuItem;
      }
    }

  }

  const items: MenuItem[] = Object.values(UserSettingRouteKey).map((value) =>
    getItem(value, value, UserSettingIconMap[value]),
  ).filter(item => item);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === UserSettingRouteKey.Logout) {
      logout();
    } else {
      navigate(`/${UserSettingBaseKey}/${key}`);
    }
  };

  const selectedKeys = useMemo(() => {
    return [pathName];
  }, [pathName]);

  return (
    <section className={styles.sideBarWrapper}>
      <Menu
        selectedKeys={selectedKeys}
        mode="inline"
        items={items}
        onClick={handleMenuClick}
        style={{ width: 312 }}
      />
    </section>
  );
};

export default SideBar;
