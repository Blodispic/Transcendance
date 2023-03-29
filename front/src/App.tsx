import * as React from 'react';
import { RouterProvider } from "react-router-dom";
import { useAppDispatch, useAppSelector } from './redux/Hook';
import { io, Socket } from 'socket.io-client';
import router from './router';
import { Cookies } from 'react-cookie';
import { setToken, setUser, set_status } from './redux/user';
import { useEffect, useState } from "react";
import { UserStatus } from "./interface/User";
import InviteGame from "./components/utils/InviteGame";
import swal from "sweetalert";
import { addDM, addMember, addMessage, removeMember, removePass, setChannels, setPass } from "./redux/chat";
import { IMessage } from "./interface/Message";

export let socket: Socket;

function App() {
  const myUser = useAppSelector(state => state.user);

  const dispatch = useAppDispatch();
  const cookies = new Cookies();
  const token = cookies.get('Token');
  
  const [trigger, setTrigger] = useState<boolean> (false);
  const [infoGame, setInfoGame] = useState<any | undefined> (undefined);
  let timeOutId : any = undefined;


  useEffect(() => {
    if (myUser.isLog === true && token !== undefined && myUser.user && myUser.user.username) {
      socket = io(`${process.env.REACT_APP_BACK}`, {
        auth: {
          token: token,
        }
      });
      socket.emit("UpdateSomeone", { idChange: myUser.user?.id, idChange2: 0 })

      if (socket) {
        socket.on("RoomStart", () => {
          if (timeOutId)
            clearTimeout(timeOutId);
        });

        socket.on("RequestSent", () => {
          if (myUser && myUser.user && myUser.user.status !== UserStatus.INGAME)
            swal("Friend Request Received", "You can accept or refuse it from your profile page");
        });

        socket.on("RequestAccepted", () => {
          if (myUser && myUser.user && myUser.user.status !== UserStatus.INGAME)
            swal("Friend Request Accepted", "One of your friend request has been accepted", "success");
        });

        socket.on("RequestDeclined", () => {
          if (myUser && myUser.user && myUser.user.status !== UserStatus.INGAME)
            swal("Friend Request Declined", "One of your friend request has been declined", "error");
        });

        socket.on("GameDeclined", (username: string) => {
          if (timeOutId)
            clearTimeout(timeOutId);
          if (username !== "You")
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

        /* Chat */
        socket.on("joinChannel", ({ chanid, user }) => {
          const newMessage: IMessage = {
            chanid: chanid,
            message: user.username + " has joined the channel",
          }
          dispatch(addMessage(newMessage));
          dispatch(addMember({ chanid: chanid, user: user }));
        });

        socket.on("leaveChannel", ({ chanid, user }) => {
          const newMessage: IMessage = {
            chanid: chanid,
            message: user.username + " has left the channel",
          }
          dispatch(addMessage(newMessage));
          dispatch(removeMember({ chanid: chanid, userid: user.id }));
        });

        socket.on('sendMessageChannelOK', (messageDto) => {
          dispatch(addMessage(messageDto));
        });

        socket.on('sendDmOK', (sendDmDto) => {
          const newMessage: IMessage = sendDmDto;
          newMessage.sender = myUser.user;
          newMessage.chanid = sendDmDto.IdReceiver;
          dispatch(addDM(newMessage));
        });
        
        socket.on('ReceiveDM', (receiveDmDto) => {
          const newMessage: IMessage = receiveDmDto;
          newMessage.chanid = receiveDmDto.sender.id;
          dispatch(addDM(receiveDmDto));
        });

        socket.on("addPasswordOK", (chanId) => {
          dispatch(setPass(chanId));
        });

        socket.on("rmPasswordOK", (chanId) => {
          dispatch(removePass(chanId));
        });

        // I m on it
        // socket.on('exception', (error_message) => {
        //   swal("Format Error", "( -> pop up quand une variable dans un DTO ne correspond pas a son class-validator (exemple chanid = 'bonjour' alors que chanid est @IsNumber )    est-ce que c'est bon pour vous ?");
        // });

      }
        return () => {
          socket.off("RoomStart");
          socket.off("RequestSent");
          socket.off("RequestAccepted");
          socket.off("RequestDeclined");
          socket.off("invitationInGame");
          socket.off("GameDeclined");
          socket.off("GameCancelled");

          socket.off("joinChannel");
          socket.off("leaveChannel");
          socket.off('sendMessageChannelOK');
          socket.off('sendDmOK');
          socket.off('ReceiveDM');
          socket.off("addPasswordOK");
          socket.off("rmPasswordOK");

        }
    }
  }, [myUser.isLog])

  const get_channels = async() => {
    await fetch(`${process.env.REACT_APP_BACK}channel`, {
      method: 'GET',
    }).then(async response => {
      const data = await response.json();

      if (response.ok) {
        dispatch(setChannels(data));
      }
    })
  }

  const get_user = async () => {
    await fetch(`${process.env.REACT_APP_BACK}user/access_token`, {
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
        dispatch(setUser(data))
        dispatch(setToken(token));
        dispatch(set_status(UserStatus.ONLINE));

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
      get_channels();
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
