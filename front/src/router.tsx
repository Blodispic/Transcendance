import * as React from 'react';
import App from './App'
import FirstComponent from './components/FirstComponent';
import { Header } from './components/Header';
import SecondComponent from './components/SecondComponent';
import './styles/styles.scss';
import { BrowserRouter , Route, Link } from 'react-router-dom';


const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/components/FirstComponent">About</Link>
            </li>
            <li>
              <Link to="/components/SecondComponent">Contact</Link>
            </li>
          </ul>
        </nav>


          <Route path="/components/FirstComponent">
            < FirstComponent />
          </Route>
          <Route path="/components/SecondComponent">
            <SecondComponent />
          </Route>
      </div>
    </BrowserRouter>
  );
};

export default Router;
