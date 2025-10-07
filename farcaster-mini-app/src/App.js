import './App.css';
import React, { useEffect } from "react";
import { FrameSDK } from "@farcaster/frame-sdk";
import WalletConnect from './components/WalletConnect'
import GM from './components/GM'
function App() {
  useEffect(() => {
  const sdk = new FrameSDK();
  sdk.actions.ready(); // Farcaster’a “ben hazırım” sinyali gönder
}, []);
  return (
    <div className='App'>
      <WalletConnect/>
      <GM/>
    </div>
  );
}

export default App;
