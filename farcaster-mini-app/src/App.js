import './App.css';
import React, { useEffect } from "react";
import { FrameSDK } from "@farcaster/frame-sdk";
import { sdk } from '@farcaster/miniapp-sdk';
import WalletConnect from './components/WalletConnect'
import GM from './components/GM'
function App() {
//   useEffect(() => {
//   const sdk = new FrameSDK();
//   sdk.actions.ready(); // Farcaster’a “ben hazırım” sinyali gönder
// }, []);
// useEffect(() => {
//    sdk.actions.ready()
// }, [])
  useEffect(() => {
    const interval = setInterval(() => {
      if (sdk && sdk.actions && sdk.actions.ready) {
        sdk.actions.ready();
        clearInterval(interval);
      }
    }, 50); // her 50ms kontrol et
  }, []);
  return (
    <div className='App'>
      <WalletConnect/>
      <GM/>
    </div>
  );
}

export default App;
