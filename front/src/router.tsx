import * as React from 'react';

import Game from './components/Game/Game'
import Connection from './components/connection/Connection';
import  Header  from './components/Header/Header';
import SecondComponent from './components/Chat/SecondComponent';
import './styles/styles.scss';
import { createBrowserRouter, Outlet, RouterProvider, } from "react-router-dom";

const Layout = () => (
  <>
    <Header />
    <Outlet />
  </>
);


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
    {
      path: "/",
      element: <Connection />,
    },
    {
      path: "/Home",
      element: <SecondComponent />,
    },
    {
      path: "/Chat",
      element: <SecondComponent />,
    },
    {
      path: "/Profile",
      element: <SecondComponent />,
    },
    {
      path: "/Game",
      element: <Game />,
    },
    ]
  }
]);

export default router;
