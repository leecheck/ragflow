import { useListTenantUser, useOrgUsers } from '@/hooks/user-setting-hooks';
import { IModalProps } from '@/interfaces/common';
import { Col, Form, Input, message, Modal, Row, Tag, Tree } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

function disableNodesByKey(treeData, keys) {
  const keySet = new Set(keys);

  function traverse(node) {
    // 如果当前节点需要禁用
    if (keySet.has(node.email)) {
      node.disabled = true;
    }

    // 递归处理子节点（如果存在）
    if (node.children?.length) {
      node.children.forEach(child => traverse(child));
    }
  }

  // 克隆数据并遍历修改
  const clonedTree = _.cloneDeep(treeData);
  clonedTree.forEach(rootNode => traverse(rootNode));
  return clonedTree;
}

const AddingUserModal = ({
  visible,
  hideModal,
  loading,
  onOk,
}: IModalProps<string>) => {
  const { t } = useTranslation();


  const { data } = useListTenantUser();

  const { data: userOrg } = useOrgUsers()

  const treeData = useMemo(() => {
    const emails = data.map(item => item.email)
    //return userOrg
    return disableNodesByKey(userOrg, emails)
  }, [data, userOrg])


  const [checkedNodes, setCheckedNodes] = useState([])

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    const checkedNodes = info.checkedNodes
    setCheckedNodes(checkedNodes)
    console.log('onCheck', checkedKeys, info);
  };

  const handleOk = async () => {
    if (!checkedNodes.length) {
      return message.error("未添加新的团队成员")
    }

    return onOk?.(checkedNodes.filter(item => item.type == "user"));
  };

  return (
    <Modal
      title={t('setting.add')}
      open={visible}
      onOk={handleOk}
      onCancel={hideModal}
      okButtonProps={{ loading }}
      confirmLoading={loading}
    >
      <Row>
        <Col span={12}>
          <Tree
            defaultExpandedKeys={["org-1"]}
            height={600}
            checkable
            selectable={false}
            onCheck={onCheck}
            treeData={treeData}
          />
        </Col>
        <Col offset={1} span={11}>
          {
            checkedNodes.filter(item => item.type == "user").map((item) => {
              return <Row key={item.key}><Tag>{item.title}</Tag></Row>
            })
          }
        </Col>
      </Row>
    </Modal>
  );
};

export default AddingUserModal;
