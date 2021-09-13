import React from 'react';
import logo from './logo.svg';
import './App.css';
import TelegramLoginButton from 'react-telegram-login';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <TelegramLoginButton dataOnauth={(response: any)=>console.log(response)} botName="ProstavaBot" />
      </header>
    </div>
  );
}

export default App;
