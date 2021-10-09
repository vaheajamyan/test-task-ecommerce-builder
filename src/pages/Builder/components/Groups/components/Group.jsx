import React from 'react';
import {
  Typography,
  Select,
  Input,
  Switch,
  Form,
  Space,
  Row,
  Col,
  Button,
  Tooltip,
  Divider,
  Modal,
} from 'antd';
import styled from 'styled-components';
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  QuestionCircleFilled,
} from '@ant-design/icons';
import DraggableTable from './DraggableTable';
import {
  deleteGroup,
  editGroup,
} from '../../../../../redux/slices/builderSlice';
import { useDispatch } from 'react-redux';

const { Title, Text } = Typography;
const { Option } = Select;

const StyledForm = styled(Form)`
  display: flex;
  flex-wrap: wrap;
`;

const StyledFormItem = styled(Form.Item)`
  width: ${props => props.width || '270px'};
`;

const Label = styled(Text)`
  width: 96px;
  display: block;
`;

const StyledSpace = styled(Space)`
  width: 100%;
`;

const Wrapper = styled.div`
  padding: 24px 24px 0;
  background-color: #ffffff;
`;

const itemChoices = [
  { value: 'checkbox', name: 'Multiple Items' },
  { value: 'radio', name: 'Single Item' },
];

function Group({ options, items, id, title }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  function handleValueChange(e) {
    const [[key, value]] = Object.entries(e);

    dispatch(editGroup({ id, key, value }));
  }

  return (
    <Wrapper>
      <Space align="start">
        <Title level={3}>{title}</Title>

        <Tooltip title="Prompt Text">
          <QuestionCircleFilled style={{ color: '#CCCCCC' }} />
        </Tooltip>
      </Space>
      <Row>
        <Col span={23}>
          <StyledForm
            layout="vertical"
            form={form}
            initialValues={options}
            onValuesChange={handleValueChange}>
            <StyledSpace wrap size={32}>
              <StyledFormItem label={options.name} name="name">
                <Input />
              </StyledFormItem>
              <StyledFormItem label="Item Choice" name="itemChoice">
                <Select>
                  {itemChoices.map(item => (
                    <Option value={item.value} key={item.value}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </StyledFormItem>
            </StyledSpace>

            <StyledSpace wrap size={42}>
              <Form.Item name="showImages">
                <Space size="middle">
                  <Text>Show Images</Text>
                  <Switch
                    checked={options.showImages}
                    onChange={value => {
                      dispatch(editGroup({ id, key: 'showImages', value }));
                      form.setFieldsValue({ showImages: value });
                    }}
                  />
                </Space>
              </Form.Item>
              <StyledFormItem name="visibleIfOtherItemsSelected" width="100px">
                <Space size="middle">
                  <Label>Visible if other items selected</Label>
                  <Switch
                    checked={options.visibleIfOtherItemsSelected}
                    onChange={value => {
                      dispatch(
                        editGroup({
                          id,
                          key: 'visibleIfOtherItemsSelected',
                          value,
                        }),
                      );
                      form.setFieldsValue({
                        visibleIfOtherItemsSelected: value,
                      });
                    }}
                  />
                </Space>
              </StyledFormItem>
            </StyledSpace>
          </StyledForm>
        </Col>
        <Col span={1} style={{ top: 36 }}>
          <Button
            icon={<DeleteOutlined />}
            type="text"
            onClick={() => {
              Modal.confirm({
                title: 'Delete Group',
                okButtonProps: { danger: true },
                maskClosable: true,
                content: 'Are you sure you want to delete the Group',
                icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
                okText: 'Delete',
                onOk: () => {
                  dispatch(deleteGroup(id));
                },
                cancelText: 'Cancel',
                centered: true,
              });
            }}
          />
        </Col>
      </Row>
      <Divider />
      <DraggableTable
        isImagesVisible={options.showImages}
        selectionType={options.itemChoice}
        items={items}
        groupId={id}
      />

      <Divider />
    </Wrapper>
  );
}

export default Group;
