import { RouterProvider } from "react-router-dom";
import { useAppDispatch, useAppSelector } from './redux/Hook';
import router from './router';
import { Cookies } from 'react-cookie';
import { setUser } from './redux/user';
import { useEffect } from "react";



function App() {
  const myStore = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const cookies = new Cookies();
  const token = cookies.get('Token');


  useEffect(() => {
    if (myStore.isLog == true) {
      // export const socket = io("http://" + window.location.hostname + ":4000", {
      //   auth: {
      //     user: useAppSelector(state => state.user)
      //   }
      // });
    }
  }, [myStore.isLog])


  const get_user = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACK}/user/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token }),
    })
    const data = await response.json();
    console.log("data=", data);
    
    dispatch(setUser(data));

  }
  if (myStore.user === undefined) {
    if (token !== undefined)
      get_user();
  }

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;