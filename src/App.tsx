import React from 'react';
import './App.css';
import { TLoginButton, TLoginButtonSize } from 'react-telegram-auth';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TLoginButton
          botName="ProstavaBot"
          buttonSize={TLoginButtonSize.Large}
          lang="en"
          usePic={true}
          cornerRadius={20}
          onAuthCallback={(user) => {
            console.log('Hello, user!', user);
          }}
          requestAccess={'write'}
        />
      </header>
    </div>
  );
}

export default App;
