import React from 'react';
import { RouterProvider } from "react-router-dom";
import { io } from 'socket.io-client';
import { useAppSelector } from './redux/Hook';
import router from './router';

// export const socket = io("http://" + window.location.hostname + ":4000", {
//   auth: {
//     user: useAppSelector(state => state.user)
//   }
// });

function App() {
  const myUser = useAppSelector(state => state.user);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;