import React from 'react';
import { RouterProvider } from "react-router-dom";
import { useAppSelector } from './redux/Hook';
import router from './router';
import io from 'socket.io-client';

function App() {
  const myUser = useAppSelector(state => state.user);

  console.log("MY USER", myUser.user);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;