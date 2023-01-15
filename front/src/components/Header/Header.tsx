import * as React from 'react';
import '../../styles/nav.scss'
import { Link } from 'react-router-dom';


export default function Header() {


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

        <Link to="/Profile">
          <span className="font-link">
            Profile
          </span>  
        </Link>

    </div>

  </div>
  );
}
