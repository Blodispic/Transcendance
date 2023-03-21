import { RouterProvider, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from './redux/Hook';
import { io, Socket } from 'socket.io-client';
import router from './router';
import { Cookies, useCookies } from 'react-cookie';
import { setToken, setUser, set_status } from './redux/user';
import { useEffect, useState } from "react";
import { IUser, UserStatus } from "./interface/User";
import InviteGame from "./components/utils/InviteGame";
import { Player } from "./components/Game/Game";
import swal from "sweetalert";

export let socket: Socket;

function App() {
  const myUser = useAppSelector(state => state.user);
  const myToken = useAppSelector(state => state.user.myToken);
  const [, setCookie] = useCookies(['Token']);

  const dispatch = useAppDispatch();
  const cookies = new Cookies();
  const token = cookies.get('Token');
  
  const [trigger, setTrigger] = useState<boolean> (false);
  const [infoGame, setInfoGame] = useState<any | undefined> (undefined);
  let timeOutId : any = undefined;


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

        socket.on("GameDeclined", (username: string) => {
          if (timeOutId)
            clearTimeout(timeOutId);
          if (username != "You")
            swal("Invitation Declined", username + " declined your game", "error");
        });

        socket.on("GameCancelled", (username: string) => {
          swal("Game Cancelled", username + " is not available", "error");
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
          socket.off("GameDeclined");
          socket.off("GameCancelled");
        }
    }
  }, [myUser.isLog])


  const get_user = async () => {
    console.log("check si ca rentre ici")
    const response = await fetch(`${process.env.REACT_APP_BACK}user/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${myToken}`,
      },
      body: JSON.stringify({ token: token }),
    })
    .then(async response => {
      const data = await response.json();
      // check for error response

      if (response.ok && data.username !== "") {
        console.log("connection avec cookies", data);
        dispatch(setUser(data))
        dispatch(set_status(UserStatus.ONLINE));
        dispatch(setToken(token));

        // setCookie('Token', data.access_token, { path: '/' });

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
