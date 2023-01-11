import * as React from 'react';

import Game from './components/Game/Game'
import FirstComponent from './components/connection/FirstComponent';
import  Header  from './components/Header/Header';
import SecondComponent from './components/Chat/SecondComponent';
import './styles/styles.scss';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
  },
  {
    path: "/Home",
    element: <FirstComponent />,
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
]);

export default router;
