import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Router from './router';
import reportWebVitals from './reportWebVitals';
import FirstComponent from './components/FirstComponent';
import SecondComponent from './components/SecondComponent';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Router />,
  },
  {
    path: "/components/FirstComponent",
    element: <FirstComponent />,
  },
  {
    path: "/components/SecondComponent",
    element: <SecondComponent />,
  },
]);
 
const game = ReactDOM.createRoot(
  document.getElementById('game') as HTMLElement
);
game.render(
    <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
