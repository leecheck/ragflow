import { useSetModalState, useShowDeleteConfirm } from '@/hooks/common-hooks';
import {
  useAddTenantUser,
  useAgreeTenant,
  useDeleteTenantUser,
  useFetchUserInfo,
} from '@/hooks/user-setting-hooks';
import { message } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useAddUser = () => {
  const { addTenantUser } = useAddTenantUser();
  const {
    visible: addingTenantModalVisible,
    hideModal: hideAddingTenantModal,
    showModal: showAddingTenantModal,
  } = useSetModalState();

  const handleAddUserOk = useCallback(
    async (users: any[]) => {
      const success = [];
      const failed = [];

      const key = 'inviteUser';

      message.loading({ content: '处理中...', key });

      for (const user of users) {
        if (!user.email) {
          failed.push(user);
          continue;
        }
        try {
          const code = await addTenantUser(user.email);
          if (code === 0) {
            message.loading({ content: `添加：${user.title}成功`, key });
            success.push(user);
          } else {
            failed.push(user);
          }
        } catch (error) {
          failed.push(user);
        }
      }

      hideAddingTenantModal();

      // 显示结果反馈
      if (failed.length > 0) {
        message.warning({
          content: `部分失败：${failed.map((item) => item.title).join(', ')}`,
          key,
        });
      }
      if (success.length > 0) {
        message.success({
          content: `成功添加：${success.map((item) => item.title).join(', ')}`,
          key,
        });
      }
    },
    [addTenantUser, hideAddingTenantModal],
  );

  return {
    addingTenantModalVisible,
    hideAddingTenantModal,
    showAddingTenantModal,
    handleAddUserOk,
  };
};

export const useHandleDeleteUser = () => {
  const { deleteTenantUser, loading } = useDeleteTenantUser();
  const showDeleteConfirm = useShowDeleteConfirm();
  const { t } = useTranslation();

  const handleDeleteTenantUser = (userId: string) => () => {
    showDeleteConfirm({
      title: t('setting.sureDelete'),
      onOk: async () => {
        const code = await deleteTenantUser({ userId });
        if (code === 0) {
        }
        return;
      },
    });
  };

  return { handleDeleteTenantUser, loading };
};

export const useHandleAgreeTenant = () => {
  const { agreeTenant } = useAgreeTenant();
  const { deleteTenantUser } = useDeleteTenantUser();
  const { data: user } = useFetchUserInfo();

  const handleAgree = (tenantId: string, isAgree: boolean) => () => {
    if (isAgree) {
      agreeTenant(tenantId);
    } else {
      deleteTenantUser({ tenantId, userId: user.id });
    }
  };

  return { handleAgree };
};

export const useHandleQuitUser = () => {
  const { deleteTenantUser, loading } = useDeleteTenantUser();
  const showDeleteConfirm = useShowDeleteConfirm();
  const { t } = useTranslation();

  const handleQuitTenantUser = (userId: string, tenantId: string) => () => {
    showDeleteConfirm({
      title: t('setting.sureQuit'),
      onOk: async () => {
        deleteTenantUser({ userId, tenantId });
      },
    });
  };

  return { handleQuitTenantUser, loading };
};
