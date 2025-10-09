import React from 'react'
import './MintNFT.css'

const MintNFT = () => {
  const handleMint = async () => {
    try {
      if (!window.ethereum) {
        alert("Cüzdan bulunamadı!");
        return;
      }

      // 👇 Buraya kendi mint kontrat kodunu ekleyebilirsin
      alert("Mint işlemi başlatıldı 🚀");
    } catch (error) {
      console.error(error);
      alert("Mint işlemi başarısız ❌");
    }
  };

  return (
    <div className="gm-container">
      <div className="gm-card">
        <h1 className="gm-title">Mint Your NFT 🪙</h1>
        <p className="gm-subtitle">
          Sadece bir tıkla NFT’ni mint et ve cüzdanına gönder.
        </p>
        <button className="gm-button" onClick={handleMint}>
          Mint NFT 🚀
        </button>
      </div>
    </div>
  )
}

export default MintNFT
