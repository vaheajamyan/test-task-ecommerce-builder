import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import appReducer from './reducers';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['persistReducer'],
};

const persistedReducer = persistReducer(persistConfig, appReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const configureStore = initialState => {
  const enhancer = composeEnhancers(applyMiddleware(thunkMiddleware));
  return createStore(persistedReducer, initialState, enhancer);
};

const store = configureStore({});

export const persistor = persistStore(store);

export default store;
