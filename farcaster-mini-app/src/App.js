import './App.css';
import React, { useEffect } from "react";
import { FrameSDK } from "@farcaster/frame-sdk";
import { sdk as miniSdk } from '@farcaster/miniapp-sdk';
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
    const frame = new FrameSDK();
    frame.actions.ready();   // Frame SDK için hazır sinyali
    miniSdk.actions.ready(); // Mini app SDK için hazır sinyali (isteğe bağlı)
  }, []);
  return (
    <div className='App'>
      <WalletConnect/>
      <GM/>
    </div>
  );
}

export default App;
