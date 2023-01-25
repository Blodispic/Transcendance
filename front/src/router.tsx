import * as React from 'react';

import GameApp from './components/Game/Game'
import Profile from './components/Profile/Profile'
import Connection from './components/connection/Connection';
import Header from './components/Header/Header';
import Chat from './components/Chat/Chat';
import './styles/styles.scss';
import { createBrowserRouter, Outlet, RouterProvider, } from "react-router-dom";
import NameForm from "./components/connection/form_name_avatar"
import Queue from './components/Game/Queue';
import { Navigate } from "react-router-dom";
import { useAppSelector } from './redux/Hook';

const Layout = () => (
  <>
    <Header />
    <Outlet />
  </>
);


const ProtectedRoute = (props: { children: any }) => {
  const user = useAppSelector(state => state.user);
  if (!user.user) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return props;
};

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
        element: <Queue />,
      },
      {
        path: "/Game/:id",
        element: <GameApp />,
      },
      {
        path: "/Game/1",
        element: <GameApp />,
      },
    ]
  }
]);

export default router;
