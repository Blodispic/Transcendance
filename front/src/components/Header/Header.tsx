import * as React from 'react';
import '../../styles/nav.scss'
import { Link } from 'react-router-dom';


const Header: React.FC = () => {


  return (
   <div className='mynavbar'>
     {/* <div className='logo'> */}
       <a href="/Home">logo</a>
     {/* </div> */}
     <div className='navbar-right'>
        <a href="/Game"> Game </a>
        <a href="/Chat"> Chat </a>
        <a href="/Profile"> Profile </a>
     </div>
   </div>
  );
 
}

export default Header;