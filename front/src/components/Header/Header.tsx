import * as React from 'react';
import '../../styles/nav.scss'
import { Link } from 'react-router-dom';


const Header: React.FC = () => {


  return (
    <div className='mynavbar'>
    <Link to="/">logo</Link>
    <div className='navbar-right'>
      <Link to="/Game"> Game </Link>
      <Link to="/Chat"> Chat </Link>
      <Link to="/Profile"> Profile </Link>
      <Link to="/Home"> Home </Link>
    </div>
  </div>
  );
}

export default Header;