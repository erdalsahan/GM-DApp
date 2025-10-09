import React, { useState } from 'react'
import './Erc1155.css';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x107DDCC8B338D822dA5247e4C249c0e239d99e74";
const ABI = [
  "function mint(address to, uint256 id, uint256 amount, string memory tokenURI) external",
  "function owner() view returns (address)"
];

const Erc1155 = () => {
    const [loading, setLoading] = useState(false);
  const [tokenId, setTokenId] = useState(1);
  const [amount, setAmount] = useState(1);
  const [tokenURI, setTokenURI] = useState("https://gateway.pinata.cloud/ipfs/YOUR_METADATA.json");

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
      const userAddress = await signer.getAddress();

      // Kontrat instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Sadece owner mint edebilir, kontrol (opsiyonel)
      const ownerAddress = await contract.owner();
      if (ownerAddress.toLowerCase() !== userAddress.toLowerCase()) {
        alert("Sadece kontrat sahibi mint edebilir!");
        return;
      }

      // Mint işlemi
      const tx = await contract.mint(userAddress, tokenId, amount, tokenURI);
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
        <h1 className="gm-title">Mint Your NFT (Erc1155)🪙</h1>
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

export default Erc1155