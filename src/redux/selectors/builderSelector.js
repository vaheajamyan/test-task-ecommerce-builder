import { createSelector } from '@reduxjs/toolkit';

export const getGroups = createSelector(
  state => state.builderSlice,
  entities => entities.groups,
);
