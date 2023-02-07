import * as React from 'react';

import GameApp from './components/Game/Game'
import Profile from './components/Profile/Profile'
import Connection from './components/connection/Connection';
import Header from './components/Header/Header';
import Chat from './components/Chat/Chat';
import { createBrowserRouter, Outlet } from "react-router-dom";
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
  console.log(user);

  if (user.isLog == false) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return props.children;
};


const PublicRoute = (props: { children: any }) => {
  const user = useAppSelector(state => state.user);
  if (user.isLog == true) {
    // user is authenticated
    return <Navigate to="/Home" />;
  }
  return props.children;
};


const router = createBrowserRouter([
  {

    path: "/",
    element:
      <PublicRoute>
        <Connection />
      </PublicRoute>
  },
  {
    element: <Layout />,
    children: [
      {

        path: "/Home",
        element:
          <ProtectedRoute>

          </ProtectedRoute>
      },
      {
        path: "/Chat",
        element:
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
      },
      {
        path: "/Profile/:id",
        element:
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>,
      },
      {
        path: "/Game",
        element:
          <ProtectedRoute>
            <Queue />,
          </ProtectedRoute>,
      },
      {
        path: "/Game/:id",
        element:
          <ProtectedRoute>
            <GameApp />,
          </ProtectedRoute>,
      },
    ]
  }

]);

export default router;
