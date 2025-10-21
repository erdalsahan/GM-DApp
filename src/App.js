import './App.css';
import React, { useState, useEffect } from "react";
import { sdk } from '@farcaster/miniapp-sdk';
import WalletConnect from './components/WalletConnect';
import GM from './components/GM';
import MintNFT from './components/MintNFT';
import Erc1155 from './components/Erc1155';
import Erc20 from './components/Erc20';
function App() {
  const [activeIndex, setActiveIndex] = useState(0); // 0 = GM, 1 = MintNFT

  useEffect(() => {
    const callReady = async () => {
      while (!sdk || !sdk.actions || !sdk.actions.ready) {
        await new Promise(res => setTimeout(res, 50));
      }
      sdk.actions.ready();
    };
    callReady();
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev === 3 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? 3 : prev - 1));
  };

  return (
    <div className='App'>
      <WalletConnect/>
      
      <div className="slider-container">
        <button className="slider-btn left" onClick={handlePrev}>◀</button>
        <div className="slider-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          <div className="slider-item">
            <GM/>
          </div>
          <div className="slider-item">
            <MintNFT/>
          </div>
          <div className="slider-item">
            <Erc1155/>
          </div>
          <div className="slider-item">
            <Erc20/>
          </div>
        </div>
        <button className="slider-btn right" onClick={handleNext}>▶</button>
      </div>
    </div>
  );
}

export default App;
