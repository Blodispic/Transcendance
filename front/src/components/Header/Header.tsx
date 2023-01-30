import React, { useState } from 'react';
import '../../styles/nav.scss'
import '../../styles/profile.scss'
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/Hook';
import { FaUserAlt } from "react-icons/fa";
import { Cookies } from 'react-cookie';
import { delete_user } from '../../redux/user';
export default function Header() {

  const [dropdown, setDropdown] = useState<boolean>(false);

  const cookies = new Cookies();
  const dispatch = useAppDispatch();
  
  const dropdownClick = () => {
    if (dropdown == false)
      setDropdown(true);
    else
      setDropdown(false);
  }
  
  const logout = () => {
    cookies.remove('Token');
    dispatch(delete_user())
  }

  const myUser = useAppSelector(state => state.user);
  console.log(myUser);

  return (
    <div className='mynavbar'>

      <div className='navbar-left'>

        <Link to="/">
          <img className='logo' src={require('../../assets/logo.gif')} />
        </Link>

      </div>

      <div className='navbar-right'>

        <Link to="/Game">
          <span className="font-link">
            Game
          </span>
        </Link>

        <Link to="/Chat">
          <span className="font-link">
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
                    <Link to={`/Profile/${myUser.user.id}`}>
                      profile
                    </Link>
                  </li>
                  <li onClick={_ => logout()} >
                    logout
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
