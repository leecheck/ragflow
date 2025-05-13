import { useLogin } from '@/hooks/login-hooks';
import { Result, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'umi';
import RightPanel from './right-panel';

import styles from './index.less';
import { rsaPsw } from '@/utils';

const SSOLogin = () => {

  const { username } = useParams();
  const navigate = useNavigate();
  const { login, loading: signLoading } = useLogin();

  const [msg, setMsg] = useState("")

  const ssoLogin = async () => {
    if (username) {
      const rsaPassWord = rsaPsw("123456")
      const code = await login({
        email: `${username}`.trim(),
        password: rsaPassWord,
      })
      if (code === 0) {
        navigate('/knowledge');
      } else {
        setMsg("登录凭证无效")
      }
    } else {
      setMsg("登录凭证无效")
    }
  }

  useEffect(() => {
    if (username) {
      ssoLogin()
    }

  }, [username])



  return (
    <div className={styles.loginPage}>
      <div className={styles.loginLeft}>
        <div className={styles.leftContainer}>
          {
            !msg ? <Spin spinning={signLoading}></Spin> : <Result
              status="warning"
              title={msg}
            />
          }
        </div>
      </div>
      <div className={styles.loginRight}>
        <RightPanel></RightPanel>
      </div>
    </div>
  );
};

export default SSOLogin;
