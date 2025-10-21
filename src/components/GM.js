import { useEffect, useState } from "react";
import { ethers, Contract } from "ethers";
import { sdk } from "@farcaster/miniapp-sdk"; // ✅ Farcaster Mini App SDK
import "./GM.css";

const CONTRACT_ADDRESS = "0x2D8A50649B05e6DFFC821676919e99A3a3528488";
const ABI = [
  "function sendGM(string calldata message) external",
  "function withdraw() external",
  "event GMSent(address indexed from, string message, uint256 timestamp)"
];

export default function GMCard() {
  const [ethProvider, setEthProvider] = useState(null);

  // ✅ Mini App hazır olduğunda provider’ı al
  useEffect(() => {
    const init = async () => {
      try {
        console.log("🟣 Farcaster MiniApp başlatılıyor...");
        await sdk.actions.ready(); // Splash ekranı kapatır

        const provider = await sdk.wallet.getEthereumProvider();
        if (!provider) {
          console.error("❌ Farcaster Ethereum provider alınamadı.");
          return;
        }

        console.log("✅ Farcaster provider başarıyla alındı:", provider);
        setEthProvider(provider);
      } catch (err) {
        console.error("🚨 SDK başlatma hatası:", err);
      }
    };

    init();
  }, []);

  const handleGmClick = async () => {
    if (!ethProvider) {
      alert("❌ Cüzdan bulunamadı. Bu özellik sadece Farcaster Mini App içinde çalışır!");
      return;
    }

    try {
      console.log("🔹 Hesap erişimi isteniyor...");
      await ethProvider.request({ method: "eth_requestAccounts" });

      // 🔹 Base ağı kontrolü
      const chainId = await ethProvider.request({ method: "eth_chainId" });
      if (chainId !== "0x2105") {
        console.log("🌐 Base Mainnet'e geçiliyor...");
        await ethProvider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x2105",
              chainName: "Base Mainnet",
              nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://mainnet.base.org"],
              blockExplorerUrls: ["https://basescan.org"]
            }
          ]
        });
      }

      // 🔹 Ethers.js ile kontrat bağlantısı
      const ethersProvider = new ethers.BrowserProvider(ethProvider);
      const signer = await ethersProvider.getSigner();
      const gmContract = new Contract(CONTRACT_ADDRESS, ABI, signer);

      const hours = new Date().getHours();
      let greeting = "Good Morning";
      if (hours >= 12 && hours < 18) greeting = "Good Afternoon";
      else if (hours >= 18) greeting = "Good Evening";

      console.log("📡 GM gönderiliyor...");
      const tx = await gmContract.sendGM(greeting);
      await tx.wait();

      alert(`✅ GM gönderildi!\nTx Hash: ${tx.hash}`);
      console.log("✅ İşlem başarılı:", tx.hash);
    } catch (err) {
      console.error("❌ Hata:", err);
      alert("Hata: " + (err?.message || err));
    }
  };

  return (
    <div className="gm-container">
      <div className="gm-card">
        <h1 className="gm-title">GM ☀️</h1>
        <p className="gm-subtitle">Farcaster cüzdanınla GM göndermeye hazır mısın?</p>
        <button className="gm-button" onClick={handleGmClick}>
          GM!
        </button>
      </div>
    </div>
  );
}
