import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { authReducer } from './auth/authSlice'
import { preferenceReducer } from './preferenceState/preferenceSlice'
import { filterReducer } from './filter/filterSlice'
import { clickReducer } from './clickState/clickSlice'

const rootReducer = combineReducers({
    auth: authReducer,
    preference: preferenceReducer,
    clickState: clickReducer,
    filterState: filterReducer,
})

const persistConfig = {
  key: 'root',
  storage,
};

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export const Store = configureStore({
  reducer: persistedRootReducer,
});

export const persister = persistStore(Store);