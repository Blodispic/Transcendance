import { RouterProvider } from "react-router-dom";
import { useAppDispatch, useAppSelector } from './redux/Hook';
import { io, Socket } from 'socket.io-client';
import router from './router';
import { Cookies } from 'react-cookie';
import { log_unlog, setUser } from './redux/user';
import { useEffect } from "react";
import { IUser } from "./interface/User";

export let socket: Socket;

function App() {
  const myStore = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const cookies = new Cookies();
  const token = cookies.get('Token');


  useEffect(() => {
    console.log(myStore);
    if (myStore.isLog == true && token != undefined) {
        socket = io("http://" + window.location.hostname + ":4000", {
        auth: {
          token: token,
        }
      });
    }
  }, [myStore.isLog])


  const get_user = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACK}user/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token }),
    })
    const data: IUser = await response.json();
    console.log("data=", data);
    
    console.log(myStore.user);
    dispatch(setUser(data));
    dispatch(log_unlog());
    console.log(myStore.user);
    
  }
  if (myStore.user === undefined) {
    if (token !== undefined)
      get_user();
  }

  return (

      <RouterProvider router={router} />

  );
}

export default App;