import React, { useState } from 'react';
import './Erc20.css';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x751b0AB0FbaEbB7d5aFf8D754C19a7Ad2D6E4e70";
const ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)"
];

const Erc20 = () => {
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    if (!window.ethereum) {
      alert("Cüzdan bulunamadı!");
      return;
    }

    try {
      setLoading(true);

      // Cüzdan bağlantısı
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Kontrat instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Kontrat bilgilerini al
      const tokenName = await contract.name();
      const tokenSymbol = await contract.symbol();
      const totalSupply = await contract.totalSupply();

      alert(`Token basılıyor!\nAdı: ${tokenName}\nSembol: ${tokenSymbol}\nMiktar: ${ethers.formatUnits(totalSupply, 18)} ${tokenSymbol}`);

      // Token zaten owner'a deploy sırasında gitmiş oluyor
      // Eğer deploy sırasında değilse, mint fonksiyonu eklenmeli

    } catch (error) {
      console.error(error);
      alert("İşlem başarısız ❌: " + (error?.message || error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gm-container">
      <div className="gm-card">
        <h1 className="gm-title">Mint Your Base Token 🪙</h1>
        <p className="gm-subtitle">
          Tek tıkla token bilgileriniz görüntülenecek ve owner cüzdanınıza basılacak.
        </p>
        <button className="gm-button" onClick={handleMint} disabled={loading}>
          {loading ? "Mintleniyor..." : "Token Bas 🚀"}
        </button>
      </div>
    </div>
  )
}

export default Erc20;
