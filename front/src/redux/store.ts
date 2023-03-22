import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import { chatSlice } from './chat'

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch