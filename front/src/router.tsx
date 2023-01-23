import * as React from 'react';

import GameApp from './components/Game/Game'
import Profile from './components/Profile/Profile'
import Connection from './components/connection/Connection';
import  Header  from './components/Header/Header';
import Chat from './components/Chat/Chat';
import './styles/styles.scss';
import { createBrowserRouter, Outlet, RouterProvider, } from "react-router-dom";
import NameForm from "./components/connection/form_name_avatar"

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

    },
    {
      path: "/Chat",
      element: <Chat />,
    },
    {
      path: "/Profile/:id",
      element: <Profile />,
    },
    {
      path: "/Game",
      element: <GameApp />,
    },
    ]
  }
]);

export default router;
