import * as React from 'react';

import GameApp from './components/Game/Game'
import Profile from './components/Profile/Profile'
import Connection from './components/connection/Connection';
import Header from './components/Header/Header';
import Chat from './components/Chat/Chat';
import { createBrowserRouter, Outlet, useRouteError } from "react-router-dom";
import Queue from './components/Game/Queue';
import { Navigate } from "react-router-dom";
import { useAppSelector } from './redux/Hook';
import Sign from './components/connection/Sign';
import { Log } from './components/connection/Log';
import Home from './components/Home/Home';
import { DirectMessage } from './components/Chat/DirectMessage';
import PageNotfound from './components/404/PageNotFound';

const Layout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  // Uncaught ReferenceError: path is not defined
  return <span>dang</span>;
}


const ProtectedRoute = (props: { children: any }) => {
  const user = useAppSelector(state => state.user);

  if (user.isLog === false && user.isOauth === false) {
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
      </PublicRoute>,
      errorElement: <ErrorBoundary />,
  },
  {
    path: "/sign",
    element:
      <OauthRoute>
        <Sign />
      </OauthRoute>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/log",
    element:
      <OauthRoute>
        <Log />
      </OauthRoute>,
    errorElement: <ErrorBoundary />,
  },
  {
    element: <Layout />,
    children: [
      {

        path: "/Home",
        element:
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>,
         errorElement: <ErrorBoundary />,
      },
      {
        path: "/Chat",
        element:
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "/Chat/channel",
            element:
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>,
            errorElement: <ErrorBoundary />,
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
          errorElement: <ErrorBoundary />,
      },
      {
        path: "/Game",
        element:
          <ProtectedRoute>
            <Queue />
          </ProtectedRoute>,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/Game/:id",
        element:
          <ProtectedRoute>
            <GameApp />
          </ProtectedRoute>,
        errorElement: <ErrorBoundary />,
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
