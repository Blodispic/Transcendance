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
import Sign from './components/connection/Sign';
import { Log } from './components/connection/Log';
import Home from './components/Home/Home';
import { Channels } from './components/Chat/Channel';
import { DirectMessage } from './components/Chat/DirectMessage';
import PageNotfound from './components/404/PageNotFound';

const Layout = () => (
  <>
    <Header />
    <Outlet />
  </>
);



const ProtectedRoute = (props: { children: any }) => {
  const user = useAppSelector(state => state.user);

  if (user.isLog === false && user.isOauth == false) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return props.children;
};


const PublicRoute = (props: { children: any }) => {
  const user = useAppSelector(state => state.user);
  if (user.isLog === true) {
    // user is authenticated
    return <Navigate to="/Home" />;
  }
  return props.children;
};


const OauthRoute = (props: { children: any }) => {
  const user = useAppSelector(state => state.user);
  if (user.isOauth === false) {
    // user is authenticated
    return <Navigate to="/" />;
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
    path: "/sign",
    element:
      <OauthRoute>
        <Sign />
      </OauthRoute>
  },
  {
    path: "/log",
    element:
      <OauthRoute>
        <Log />
      </OauthRoute>
  },
  {
    element: <Layout />,
    children: [
      {

        path: "/Home",
        element:
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
      },
      {
        path: "/Chat",
        element:
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>,
        children: [
          {
            path: "/Chat/channel",
            element:
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>,
            children: [
              {
                path: "/Chat/channel/:id",
                element:
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>,
              },
            ]
          },
          {
            path: "/Chat/dm",
            element:
              <ProtectedRoute>
                <DirectMessage />
              </ProtectedRoute>,
            children: [
              {
                path: "/Chat/dm/:id",
                element:
                  <ProtectedRoute>
                    <DirectMessage />
                  </ProtectedRoute>,
              },
            ]
          },
        ]
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
            <Queue />
          </ProtectedRoute>,
      },
      {
        path: "/Game/:id",
        element:
          <ProtectedRoute>
            <GameApp />
          </ProtectedRoute>,
      },
      {
        path: "*",
        element:
            <PageNotfound />
      },
    ]
  }

]);

export default router;
