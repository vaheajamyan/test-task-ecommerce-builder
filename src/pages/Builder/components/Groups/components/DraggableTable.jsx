import React, { useCallback, useRef } from 'react';
import { Table, Button, Switch, InputNumber, Input, Modal } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UploadImage from './UploadImage';
import { useDispatch } from 'react-redux';
import {
  addNewItem,
  deleteItem,
  editItem,
  reorderItems,
} from '../../../../../redux/slices/builderSlice';

const type = 'DraggableBodyRow';

const DraggableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: item => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

const DraggableTable = ({ selectionType, items, groupId, isImagesVisible }) => {
  const dispatch = useDispatch();

  const columns = [
    ...(isImagesVisible
      ? [
          {
            title: 'Item Image',
            width: 50,
            dataIndex: 'image',
            render: (image, item) => (
              <UploadImage
                image={image}
                onAddImage={image =>
                  dispatch(editItem({ groupId, newItem: { ...item, image } }))
                }
              />
            ),
          },
        ]
      : []),
    {
      title: 'Item Name',
      dataIndex: 'name',
      render: (name, item) => (
        <Input
          value={name}
          onChange={e =>
            dispatch(
              editItem({
                groupId,
                newItem: { ...item, name: e.target.value },
              }),
            )
          }
        />
      ),
    },
    {
      title: 'Additional Price (opt)',
      dataIndex: 'price',
      render: (price, item) => (
        <InputNumber
          defaultValue={price}
          min={0}
          formatter={value =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          onChange={value =>
            dispatch(
              editItem({
                groupId,
                newItem: { ...item, price: value },
              }),
            )
          }
        />
      ),
    },
    {
      title: 'In Stock',
      dataIndex: 'inStock',
      render: (checked, item) => {
        return (
          <Switch
            checked={checked}
            onChange={value =>
              dispatch(
                editItem({
                  groupId,
                  newItem: { ...item, inStock: value },
                }),
              )
            }
          />
        );
      },
    },
    {
      title: '',
      key: 'action',
      render: item => (
        <Button
          icon={<DeleteOutlined />}
          type="text"
          onClick={() => {
            Modal.confirm({
              title: 'Delete item',
              okButtonProps: { danger: true },
              maskClosable: true,
              content: 'Are you sure you want to delete the item',
              icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
              okText: 'Delete',
              onOk: () => {
                dispatch(deleteItem({ groupId, key: item.key }));
              },
              cancelText: 'Cancel',
              centered: true,
            });
          }}
        />
      ),
    },
  ];

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      if (!items.length) {
        return;
      }

      const dragRow = items[dragIndex];
      dispatch(
        reorderItems({
          groupId,
          items: update(items, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, dragRow],
            ],
          }),
        }),
      );
    },
    [items],
  );

  function handleAddItem() {
    dispatch(addNewItem(groupId));
  }

  const rowSelection = {
    type: selectionType,
    hideSelectAll: true,
    columnTitle: 'Default',
    checkStrictly: true,
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Table
          style={{ minHeight: 221 }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={items}
          components={components}
          pagination={false}
          onRow={(_, index) => ({
            index,
            moveRow,
          })}
        />
      </DndProvider>
      <Button type="link" onClick={handleAddItem}>
        Add New Item
      </Button>
    </>
  );
};

export default DraggableTable;
