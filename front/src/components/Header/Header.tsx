import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/Hook';
import { FaUserAlt } from "react-icons/fa";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { Cookies } from 'react-cookie';
import { delete_user } from '../../redux/user';
import { socket } from '../../App';

export default function Header() {

  const [dropdown, setDropdown] = useState<boolean>(false);
  const [peopleBool, setPeopleBool] = useState<boolean>(false);
  const cookies = new Cookies();

  const dispatch = useAppDispatch();

  const dropdownClick = () => {
    if (dropdown == false)
      setDropdown(true);
    else
      setDropdown(false);
  }

  const peopleclick = () => {

    if (peopleBool == false)
      setPeopleBool(true);
    else
      setPeopleBool(false);
  }

  const logout = () => {
    cookies.remove('Token');
    dispatch(delete_user());
    socket.emit("UpdateSomeone", { idChange: myUser.user?.id, idChange2: 0 });
    socket.disconnect();
  }

  const myUser = useAppSelector(state => state.user);

  return (
    <div className='mynavbar'>

      <div className='navbar-left'>

        <Link to="/">
          <img className='logo' src={require('../../assets/logo.gif')} />
        </Link>

      </div>

      <div className='navbar-right  hover-style' >
        <Link to="/Game" onClick={_ => setDropdown(false)}>
          <span className="font-link" >
            Game
          </span>
        </Link>

        <Link to="/Chat" onClick={_ => setDropdown(false)}>
          <span className="font-link" >
            Chat
          </span>
        </Link>
        {
          myUser.user !== undefined &&
          <div className='dropdown-container'>
            <div className="icon-header" onClick={_ => dropdownClick()} >
              <FaUserAlt />
            </div>
            {
              dropdown == true &&
              <div className="dropdown">
                <ul >
                  <li>
                    <Link to={`/Profile/${myUser.user.id}`} onClick={_ => setDropdown(false)}>
                      profile
                    </Link>
                  </li>
                  <li onClick={_ => { logout(); setDropdown(false); }} >
                    <a>
                      logout
                    </a>
                  </li>
                </ul>
              </div>
            }
          </div>
        }

      </div>
    </div>
  );
}
