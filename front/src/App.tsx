import { RouterProvider } from "react-router-dom";
import { useAppDispatch, useAppSelector } from './redux/Hook';
import { io, Socket } from 'socket.io-client';
import router from './router';
import { Cookies } from 'react-cookie';
import { setUser, set_status } from './redux/user';
import { useEffect } from "react";
import { IUser, UserStatus } from "./interface/User";

export let socket: Socket;

function App() {
  const myStore = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const cookies = new Cookies();
  const token = cookies.get('Token');


  useEffect(() => {
    if (myStore.isLog == true && token != undefined && myStore.user && myStore.user.username) {
        socket = io(`${process.env.REACT_APP_BACK}`, {
        auth: {
          token: token,
          user: myStore.user,
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
    .then(async response => {
      const data = await response.json();
      // check for error response
      if (response.ok) {
        dispatch(setUser(data))
        dispatch(set_status(UserStatus.ONLINE))
        socket.emit("UpdateSomoene", {id: myStore.user?.id})
      }
      else {
        cookies.remove('Token');
      }
    })
    .catch( function() {
      console.log("token inexistant or expired")
      cookies.remove('Token');
    }
    )
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