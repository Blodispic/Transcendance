import { RouterProvider } from "react-router-dom";
import { useAppDispatch, useAppSelector } from './redux/Hook';
import router from './router';
import { Cookies } from 'react-cookie';
import { setUser } from './redux/user';



function App() {
  const myUser = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const cookies = new Cookies();
  const token = cookies.get('Token');

  const get_user = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACK}/user/access_token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ toekn: token }),
    })
    const data = await response.json();
    dispatch(setUser(data));
  }

  if (myUser.user === undefined) {
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