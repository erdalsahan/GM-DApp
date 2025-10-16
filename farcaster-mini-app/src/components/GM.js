import { useEffect, useState } from "react";
import { ethers, Contract } from "ethers";
import { sdk } from "@farcaster/miniapp-sdk";  // SDK’yı projene dahil etmelisin
import './GM.css';

const CONTRACT_ADDRESS = "0x2D8A50649B05e6DFFC821676919e99A3a3528488";
const ABI = [
  "function sendGM(string calldata message) external",
  "function withdraw() external",
  "event GMSent(address indexed from, string message, uint256 timestamp)"
];

export default function GMCard() {
  const [ethProvider, setEthProvider] = useState(null);

  useEffect(() => {
    // Mini App ortam hazır olduğunda SDK’yı hazırla
    const init = async () => {
      await sdk.actions.ready();  // Splash ekranı gizlemek için
      const provider = await sdk.wallet.getEthereumProvider();
      if (!provider) {
        console.error("Farcaster sağlanan Ethereum provider alınamadı");
        return;
      }
      setEthProvider(provider);
    };

    init();
  }, []);

  const handleGmClick = async () => {
    if (!ethProvider) {
      alert("Cüzdan bağlantısı kurulamadı!");
      return;
    }

    try {
      // Hesabı iste
      await ethProvider.request({ method: "eth_requestAccounts" });

      const chainId = await ethProvider.request({ method: "eth_chainId" });
      if (chainId !== "0x2105") {
        // Ağı ekle / geç
        await ethProvider.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0x2105",
            chainName: "Base Mainnet",
            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
            rpcUrls: ["https://mainnet.base.org"],
            blockExplorerUrls: ["https://basescan.org"],
          }]
        });
      }

      // ethers ile provider’ı wrap et
      const ethersProvider = new ethers.BrowserProvider(ethProvider);
      const signer = await ethersProvider.getSigner();
      const gmContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Mesaj hazırlama
      const hours = new Date().getHours();
      let greeting = "Good Morning";
      if (hours >= 12 && hours < 18) greeting = "Good Afternoon";
      else if (hours >= 18) greeting = "Good Evening";

      const tx = await gmContract.sendGM(greeting);
      await tx.wait();

      alert(`GM gönderildi ✅\nTx Hash: ${tx.hash}`);
      console.log("Transaction başarılı:", tx.hash);
    } catch (err) {
      console.error(err);
      alert("Hata: " + (err?.message || err));
    }
  };

  // Zaman temelli greeting (aynı senin önceki kod)
  const hours = new Date().getHours();
  let greeting = "Good Morning";
  if (hours >= 12 && hours < 18) greeting = "Good Afternoon";
  else if (hours >= 18) greeting = "Good Evening";

  return (
    <div className="gm-container">
      <div className="gm-card">
        <h1 className="gm-title">{greeting} ☀️</h1>
        <p className="gm-subtitle">Güne enerjik başlamak için hazır mısın?</p>
        <button className="gm-button" onClick={handleGmClick}>
          GM!
        </button>
      </div>
    </div>
  );
}
