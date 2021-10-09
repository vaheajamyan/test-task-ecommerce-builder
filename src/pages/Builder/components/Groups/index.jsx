import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGroups } from '../../../../redux/selectors/builderSelector';
import Group from './components/Group';
import { Empty } from 'antd';
import styled from 'styled-components';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { reorderGroups } from '../../../../redux/slices/builderSlice';
import { MenuOutlined } from '@ant-design/icons';

const EmptyWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const DraggableArea = styled.div`
  position: absolute;
  top: 102px;
  left: -4px;
`;

function Groups() {
  const dispatch = useDispatch();
  const groups = useSelector(getGroups);

  function onDragEnd(result) {
    // skip when drag ends outside or on the same  item
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    const newOrdering = [...groups];
    const draggedItem = newOrdering.splice(result.source.index, 1)[0];
    newOrdering.splice(result.destination.index, 0, draggedItem);

    dispatch(reorderGroups(newOrdering));
  }

  if (!groups.length) {
    return (
      <EmptyWrapper>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </EmptyWrapper>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {groups.map((group, index) => (
              <Draggable key={group.id} draggableId={group.id} index={index}>
                {provided => (
                  <div ref={provided.innerRef} {...provided.draggableProps}>
                    <div style={{ position: 'relative' }}>
                      <DraggableArea {...provided.dragHandleProps}>
                        <MenuOutlined style={{ color: '#D3D3E3' }} />
                      </DraggableArea>
                      <Group key={group.id} {...group} />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Groups;
