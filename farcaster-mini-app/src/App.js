import './App.css';
import React, { useEffect } from "react";
import { FrameSDK } from "@farcaster/frame-sdk";
import { sdk } from '@farcaster/miniapp-sdk';
import WalletConnect from './components/WalletConnect'
import GM from './components/GM'
function App() {

  useEffect(() => {
  const callReady = async () => {
    while (!sdk || !sdk.actions || !sdk.actions.ready) {
      await new Promise(res => setTimeout(res, 50));
    }
    sdk.actions.ready();
  };
  callReady();
}, []);
  return (
    <div className='App'>
      <WalletConnect/>
      <GM/>
    </div>
  );
}

export default App;
