import React, { useState } from 'react';
import './Erc20.css';
import { ethers } from 'ethers';

const ABI = [
  "constructor(string _name, string _symbol, uint256 _initialSupply)"
];

const DeployToken = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");

  const handleDeploy = async () => {
    if (!window.ethereum) {
      alert("Cüzdan bulunamadı!");
      return;
    }
    if (!name || !symbol || !supply) {
      return alert("Lütfen tüm alanları doldurun!");
    }

    try {
      setLoading(true);

      // Cüzdan bağlantısı
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Factory oluştur
      const factory = new ethers.ContractFactory(ABI,  signer);

      // Deploy işlemi
      const tx = await factory.deploy(name, symbol, ethers.parseUnits(supply, 18));
      alert("Token deploy ediliyor, bekleyin... ⏳");

      const contract = await tx.wait();

      alert(`Token başarıyla deploy edildi!\nAdres: ${contract.contractAddress}`);
    } catch (error) {
      console.error(error);
      alert("Deploy işlemi başarısız ❌: " + (error?.message || error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gm-container">
      <div className="gm-card">
        <h1 className="gm-title">Deploy Your Own Token 🪙</h1>
        {/* <input
          placeholder="Token Adı"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Token Sembolü"
          value={symbol}
          onChange={e => setSymbol(e.target.value)}
        />
        <input
          placeholder="Initial Supply"
          value={supply}
          onChange={e => setSupply(e.target.value)}
        /> */}
        <button className="gm-button" onClick={handleDeploy} disabled={true}>
          {loading ? "Deploy ediliyor..." : "Token Deploy 🚀"}
        </button>
      </div>
    </div>
  );
};

export default DeployToken;
