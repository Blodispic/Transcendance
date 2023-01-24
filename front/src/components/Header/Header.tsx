import * as React from 'react';
import '../../styles/nav.scss'
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/Hook';


export default function Header() {


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

        <div>
          {
            myUser.user != undefined &&
            <Link to={`/Profile/${myUser.user.id}`}>
              <span className="font-link">
                Profile
              </span>
            </Link>
          }

          {
             myUser.user == undefined &&
             <Link to={`/`}>
            <span className="font-link">
              Profile
            </span>
            </Link>
          }
        </div>
      </div>

    </div>
  );
}
