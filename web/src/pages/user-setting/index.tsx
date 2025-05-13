import { Flex } from 'antd';
import { Outlet } from 'umi';
import SideBar from './sidebar';
import { history } from 'umi';
import styles from './index.less';
import { useFetchUserInfo } from '@/hooks/user-setting-hooks';
import { useEffect } from 'react';

const UserSetting = () => {

  const { data: userInfo } = useFetchUserInfo();

  useEffect(() => {
  }, [])


  return (
    <Flex className={styles.settingWrapper}>
      <SideBar></SideBar>
      <Flex flex={1} className={styles.outletWrapper}>
        <Outlet></Outlet>
      </Flex>
    </Flex>
  );
};

export default UserSetting;
