import React from 'react';
import { RouterProvider } from "react-router-dom";
import { useAppSelector } from './redux/Hook';
import router from './router';

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