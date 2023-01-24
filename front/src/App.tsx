import React from 'react';
import { Navigate, Outlet, RouterProvider } from "react-router-dom";
import { useAppSelector } from './redux/Hook';
import { BrowserRouter as Routes, Route } from 'react-router-dom';

import router from './router';



function App() {
  const myUser = useAppSelector(state => state.user);

  return (
    <div>

      <RouterProvider router={router} />
    </div>
  );
}

export default App;