import * as React from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import App from './App'
import FirstComponent from './components/FirstComponent';
import { Header } from './components/Header';
import SecondComponent from './components/SecondComponent';
import './styles/styles.scss';

export const Router  = () => {
    return (

        <BrowserRouter>
            <div>
                <Header />
                <main>
                    <Route exact={true} path="/" component={App} />
                    <Route path="/FirstComponent" component={FirstComponent} />
                    <Route path="/SecondComponent" component={SecondComponent} />
                    <Redirect from='*' to='/' />
                </main>
            </div>
        </BrowserRouter>

    );
}