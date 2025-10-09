import React, { useState } from 'react';
import './MintNFT.css';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x303D8e109143D6e44E5e1DFb0c2A03756C0B998d";
const ABI = [
  "function mint(string memory _uri) payable",
  "function mintPrice() view returns (uint256)"
];

const MintNFT = () => {
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    try {
      if (!window.ethereum) {
        alert("Cüzdan bulunamadı!");
        return;
      }

      setLoading(true);

      // Cüzdan bağlantısı
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Kontrat instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Mint fiyatını al
      const mintPrice = await contract.mintPrice();

      // Örnek tokenURI (sen IPFS linki ile değiştirebilirsin)
      const tokenURI = "https://gateway.pinata.cloud/ipfs/YOUR_METADATA.json";

      // Mint işlemi
      const tx = await contract.mint(tokenURI, { value: mintPrice });
      alert("Mint işlemi gönderildi, bekleyin... ⏳");

      await tx.wait(); // On-chain olmasını bekle
      alert(`NFT başarıyla mintlendi! TxHash: ${tx.hash}`);

    } catch (error) {
      console.error(error);
      alert("Mint işlemi başarısız ❌: " + (error?.message || error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gm-container">
      <div className="gm-card">
        <h1 className="gm-title">Mint Your NFT 🪙</h1>
        <p className="gm-subtitle">
          Sadece bir tıkla NFT’ni mint et ve cüzdanına gönder.
        </p>
        <button className="gm-button" onClick={handleMint} disabled={loading}>
          {loading ? "Mintleniyor..." : "Mint NFT 🚀"}
        </button>
      </div>
    </div>
  )
}

export default MintNFT;
