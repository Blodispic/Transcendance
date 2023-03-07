import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import tokenReducer from './access_token';
import channelReducer from './channel'

export const store = configureStore({
  reducer: {
    user: userReducer,
    channel: channelReducer,
    access_token: tokenReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch