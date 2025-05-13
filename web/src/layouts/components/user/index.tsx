import { useFetchUserInfo } from '@/hooks/user-setting-hooks';
import { Avatar } from 'antd';
import React from 'react';
import { history } from 'umi';

import styles from '../../index.less';
import { UserOutlined } from '@ant-design/icons';

const App: React.FC = () => {
  const { data: userInfo } = useFetchUserInfo();

  const toSetting = () => {
    history.push('/user-setting');
  };

  return (

    userInfo.avatar ? <Avatar
      size={32}
      onClick={toSetting}
      className={styles.clickAvailable}
      src={
        userInfo.avatar
      }
    /> : <Avatar style={{ backgroundColor: '#727272' }}
      className={styles.clickAvailable}
      onClick={toSetting} icon={<UserOutlined />} />
  );
};

export default App;
