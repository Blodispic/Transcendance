import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Router from './router';
import reportWebVitals from './reportWebVitals';
import FirstComponent from './components/FirstComponent';
import  Header  from './components/Header';

 
const game = ReactDOM.createRoot(
  document.getElementById('game') as HTMLElement
);
game.render(
  <Header/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
