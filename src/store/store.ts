import storageSession from 'redux-persist/lib/storage/session';
import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { CombinedState, combineReducers, configureStore } from '@reduxjs/toolkit';

import { values } from '../shared/utils';

// Global features
import appReducer, { AppState } from './features/app/slice';
import authReducer, { AuthState } from './features/auth/slice';

// Individual features
import toolsReducer, { ToolsState } from './features/tools/slice';


type CombinedReducers = {
  // Global features
  app: AppState,
  auth: AuthState,

  // Individual features
  tools: ToolsState
};

const rootReducer = combineReducers({
  // Global features
  app: appReducer,
  auth: authReducer,

  // Individual features
  tools: toolsReducer
});


const persistConfig: PersistConfig<CombinedState<CombinedReducers>, any, any, any> = {
  key: values.authPersistKey,
  storage: storageSession,
  whitelist: ['auth']
};
// Persist user auth state + data between page refreshes
const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  // Azure authentication data gives some values of type "Date" which is technically mutable,
  // however, state shouldn't be mutated directly. Only update state with the store reducers!
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
});

export const persistor = persistStore(store);


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
