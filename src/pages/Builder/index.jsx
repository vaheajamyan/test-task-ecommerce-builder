import React from 'react';
import { Layout, Card, Button } from 'antd';
const { Content, Footer } = Layout;

import styled from 'styled-components';
import Groups from './components/Groups';
import { addGroups } from '../../redux/slices/builderSlice';
import { useDispatch } from 'react-redux';

const bodyStyle = {
  overflowY: 'auto',
  height: 'calc(100% - 80px)',
  paddingBottom: 0,
};

const StyledLayout = styled(Layout)`
  height: 100vh;
`;

const StyledContent = styled(Content)`
  padding: 24px 48px 0;
`;

const StyledCard = styled(Card)`
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

function Builder() {
  const dispatch = useDispatch();

  return (
    <StyledLayout>
      <StyledContent>
        <StyledCard title="Groups" bordered={false} bodyStyle={bodyStyle}>
          <Groups />
        </StyledCard>
      </StyledContent>
      <Footer>
        <Button type="primary" onClick={() => dispatch(addGroups())}>
          New Group
        </Button>
      </Footer>
    </StyledLayout>
  );
}

export default Builder;
