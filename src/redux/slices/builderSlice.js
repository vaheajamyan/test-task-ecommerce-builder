import { createSlice } from '@reduxjs/toolkit';
import { generateRandomId } from '../../utils/helper';

const generateDraftGroup = number => ({
  id: generateRandomId(),
  title: 'Group Details ' + number || '',
  options: {
    name: 'Group Name',
    itemChoice: 'checkbox',
    showImages: true,
    visibleIfOtherItemsSelected: false,
  },
  items: [],
});

const generateDraftItem = () => ({
  image: null,
  name: '',
  price: 0,
  inStock: false,
  key: generateRandomId(),
});

const initialState = {
  groups: [],
};

const builderSlice = createSlice({
  name: 'builderSlice',
  initialState,
  reducers: {
    addGroups(state) {
      state.groups.push(
        generateDraftGroup(state.groups.length ? state.groups.length + 1 : ''),
      );
    },
    deleteGroup(state, action) {
      const groupIndex = state.groups.findIndex(
        group => group.id === action.payload,
      );

      state.groups.splice(groupIndex, 1);
    },
    reorderGroups(state, action) {
      state.groups = action.payload;
    },
    editGroup(state, action) {
      const { id, key, value } = action.payload;
      const group = state.groups.find(group => group.id === id);

      group.options[key] = value;
    },
    addNewItem(state, action) {
      const groupIndex = state.groups.findIndex(
        group => group.id === action.payload,
      );

      state.groups[groupIndex].items.push(generateDraftItem());
    },
    reorderItems(state, action) {
      const groupIndex = state.groups.findIndex(
        group => group.id === action.payload.groupId,
      );

      state.groups[groupIndex].items = action.payload.items;
    },
    deleteItem(state, action) {
      const { key, groupId } = action.payload;
      const groupIndex = state.groups.findIndex(group => group.id === groupId);

      const { items } = state.groups[groupIndex];

      const itemIndex = items.findIndex(item => item.key === key);

      items.splice(itemIndex, 1);
    },
    editItem(state, action) {
      const { newItem, groupId } = action.payload;

      const groupIndex = state.groups.findIndex(group => group.id === groupId);
      const { items } = state.groups[groupIndex];

      const itemIndex = items.findIndex(item => item.key === newItem.key);

      items[itemIndex] = newItem;
    },
  },
});

const { reducer, actions } = builderSlice;

export const {
  addGroups,
  deleteGroup,
  reorderGroups,
  editGroup,
  addNewItem,
  reorderItems,
  deleteItem,
  editItem,
} = actions;

export default reducer;
