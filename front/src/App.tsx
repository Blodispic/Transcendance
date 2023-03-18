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
import swal from "sweetalert";
import { setChannels } from "./redux/chat";

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

      if (socket) {
        socket.on("RoomStart", (roomId: number, player: Player) => {
          if (timeOutId)
            clearTimeout(timeOutId);
        });
        socket.on("RequestSent", () => {
          console.log("status myuser dans App socket.on RequestSent", myUser.user!.status);
          if (myUser && myUser.user && myUser.user.status != UserStatus.INGAME)
            swal("Friend Request Received", "You can accept or refuse it from your profile page");
        });

        socket.on("RequestAccepted", () => {
          if (myUser && myUser.user && myUser.user.status != UserStatus.INGAME)
            swal("Friend Request Accepted", "One of your friend request has been accepted", "success");
        });

        socket.on("RequestDeclined", () => {
          if (myUser && myUser.user && myUser.user.status != UserStatus.INGAME)
            swal("Friend Request Declined", "One of your friend request has been declined", "error");
        });

        socket.on("invitationInGame", (payload: any) => {
          setInfoGame(payload);
          setTrigger(true);
          timeOutId = setTimeout(() => {
            setTrigger(false)
            socket.emit("declineCustomGame", payload);
          }, 10000)
        })
      }
        return () => {
          socket.off("RoomStart");
          socket.off("RequestSent");
          socket.off("RequestAccepted");
          socket.off("RequestDeclined");
          socket.off("invitationInGame");
        }
    }
  }, [myUser.isLog])

  // need to check with manu on this -- a function for setting initial values on channels store
  const get_channels = async() => {
    const response = await fetch(`${process.env.REACT_APP_BACK}channel`, {
      method: 'GET',
    }).then(async response => {
      const data = await response.json();

      if (response.ok) {
        dispatch(setChannels(data));
      }
    })
  }

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
      get_channels(); //added
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
