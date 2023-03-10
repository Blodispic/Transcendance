import { RouterProvider, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from './redux/Hook';
import { io, Socket } from 'socket.io-client';
import router from './router';
import { Cookies } from 'react-cookie';
import { setUser, set_status } from './redux/user';
import { useEffect, useState } from "react";
import { IUser, UserStatus } from "./interface/User";
import InviteGame from "./components/utils/InviteGame";
import { Player } from "./components/Game/Game";

export let socket: Socket;

function App() {
  const myUser = useAppSelector(state => state.user);
  const myToken = useAppSelector(state => state.user.myToken);

  const dispatch = useAppDispatch();
  const cookies = new Cookies();
  const token = cookies.get('Token');
  let timeOutId: any;

  const [trigger, setTrigger] = useState<boolean> (false);
  const [infoGame, setInfoGame] = useState<any | undefined> (undefined);


  useEffect(() => {
    if (myUser.isLog == true && token != undefined && myUser.user && myUser.user.username) {
      socket = io(`${process.env.REACT_APP_BACK}`, {
        auth: {
          token: token,
          user: myUser.user,
        }
      });
      socket.emit("UpdateSomeone", { idChange: myUser.user?.id, idChange2: 0 })

      if (socket)
      {
          socket.on("RoomStart", (roomId: number, player: Player) => {
              if (timeOutId)
                clearTimeout(timeOutId);
          });
      }

      socket.on("invitationInGame", (payload: any) => {
        setInfoGame(payload);
        setTrigger(true);
        timeOutId = setTimeout(() => {
					setTrigger(false)
          socket.emit("declineCustomGame", payload);
				  }, 10000)
      })
    }
  }, [myUser.isLog])


  const get_user = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACK}user/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${myToken}`,
      },
      body: JSON.stringify({ token: token }),
    })
    .then(async response => {
      const data = await response.json();
      // check for error response

      if (response.ok && data.username !== "") {
        dispatch(setUser(data))
        dispatch(set_status(UserStatus.ONLINE))
        // socket.emit("UpdateSomeone", { idChange: myUser.user?.id, idChange2: 0 })
      }
      else {
        cookies.remove('Token');
      }
    })
  }
  if (myUser.user === undefined) {
    if (token !== undefined)
      get_user();
  }

  return (

    <>
      <RouterProvider router={router} />
      {
        trigger === true && infoGame !== undefined &&
        <InviteGame infoGame={infoGame} setTrigger={setTrigger} />
      }
    </>
  );
}

export default App;
