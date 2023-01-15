import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import  Header  from './components/Header/Header';
import router from './router';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import reportWebVitals from './reportWebVitals';

 
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <div  className='container' >
    <RouterProvider router={router} />
  </div>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
