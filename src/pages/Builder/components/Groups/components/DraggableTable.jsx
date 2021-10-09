import React, { useCallback, useRef, useState } from 'react';
import { Table, Space, Button, Col } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { DeleteOutlined } from '@ant-design/icons';

const type = 'DraggableBodyRow';

const columns = [
  {
    title: 'Item Image',
    dataIndex: 'image',
  },
  {
    title: 'Item Name',
    dataIndex: 'name',
  },
  {
    title: 'Additional Price (opt)',
    dataIndex: 'price',
  },
  {
    title: 'In Stock',
    dataIndex: 'inStock',
  },
  {
    title: 'Action',
    key: 'action',
    render: () => <Button icon={<DeleteOutlined />} type="text" />,
  },
];

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
const DraggableTable = ({ selectionType }) => {
  const [data, setData] = useState([
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ]);

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = data[dragIndex];
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [data],
  );

  const rowSelection = {
    type: selectionType,
    hideSelectAll: true,
    columnTitle: 'default',
    checkStrictly: true,
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        components={components}
        pagination={false}
        onRow={(_, index) => ({
          index,
          moveRow,
        })}
      />
    </DndProvider>
  );
};

export default DraggableTable;
