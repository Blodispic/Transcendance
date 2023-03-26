import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/Hook';
import { FaUserAlt } from "react-icons/fa";
import { Cookies } from 'react-cookie';
import { delete_user } from '../../redux/user';
import { socket } from '../../App';

export default function Header() {

  const [dropdown, setDropdown] = useState<boolean>(false);
  const cookies = new Cookies();

  const dispatch = useAppDispatch();

  const dropdownClick = () => {
    if (dropdown === false)
      setDropdown(true);
    else
      setDropdown(false);
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
          <img className='logo' src={require('../../assets/logo.gif')} alt=""/>
        </Link>

      </div>

      <div className='navbar-right  hover-style' >
        <Link to="/Game" onClick={() => setDropdown(false)}>
          <span className="font-link" >
            Game
          </span>
        </Link>

        <Link to="/Chat" onClick={() => setDropdown(false)}>
          <span className="font-link" >
            Chat
          </span>
        </Link>
        {
          myUser.user !== undefined &&
          <div className='dropdown-container'>
            <div className="icon-header" onClick={() => dropdownClick()} >
              <FaUserAlt />
            </div>
            {
              dropdown === true &&
              <div className="dropdown">
                <ul >
                  <li>
                    <Link to={`/Profile/${myUser.user.id}`} onClick={() => setDropdown(false)}>
                      profile
                    </Link>
                  </li>
                  <li onClick={() => { logout(); setDropdown(false); }} >
                    <span>
                      logout
                    </span>
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
