import React from 'react';
import router from './router';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import { counterReducer } from './redux/test';
import { Reducer } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit'
// import store from './redux/store'
// import { Provider } from 'react-redux'


const store = configureStore({ reducer: counterReducer })

console.log(store.getState())
// {value: 0}
function App() {
  return (
    <>
<RouterProvider router={router} />


    </>
  );
}

export default App;