import React from 'react';
import { counterReducer } from './redux/test';
import { Reducer } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import router from './router';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import { useAppSelector } from './redux/Hook';

const store = configureStore({ reducer: counterReducer })

console.log(store.getState())
// {value: 0}
function App() {
  const myUser = useAppSelector(state => state.user);

  console.log("MY USER", myUser.user);
  
  return (
    <div>


<RouterProvider router={router} />

    </div>
  );
}

export default App;