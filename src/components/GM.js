import { ethers } from "ethers";
import './GM.css';

const CONTRACT_ADDRESS = "0x2D8A50649B05e6DFFC821676919e99A3a3528488";
const ABI = [
  "function sendGM(string calldata message) external",
  "function withdraw() external",
  "event GMSent(address indexed from, string message, uint256 timestamp)"
];

export default function GMCard() {
  const hours = new Date().getHours();
  let greeting = "Good Morning";
  if (hours >= 12 && hours < 18) greeting = "Good Afternoon";
  else if (hours >= 18) greeting = "Good Evening";

  const handleGmClick = async () => {
    let provider;

    // ✅ 1️⃣ Önce Farcaster cüzdanı kontrol et
    if (window.ethereum?.providers?.length) {
      const farcaster = window.ethereum.providers.find(
        (p) =>
          p.isFarcaster ||
          p.name?.toLowerCase().includes("farcaster") ||
          p.providerInfo?.name?.toLowerCase().includes("farcaster")
      );

      if (farcaster) {
        console.log("🎯 Farcaster cüzdanı bulundu ve seçildi!");
        provider = farcaster;
      } else {
        console.log("⚙️ Farcaster yok, varsayılan provider seçildi.");
        provider = window.ethereum.providers[0];
      }
    } else if (window.ethereum) {
      provider = window.ethereum;
    } else {
      alert("❌ Cüzdan bulunamadı! Lütfen Farcaster veya MetaMask yükleyin.");
      return;
    }

    // 🧠 Bilgi: seçilen cüzdanı logla
    const walletName = provider.isFarcaster ? "Farcaster" : provider.name || "Bilinmiyor";
    console.log("🔹 Aktif cüzdan:", walletName);

    try {
      await provider.request({ method: "eth_requestAccounts" });

      // 🔸 2️⃣ Base ağı kontrol et
      const chainId = await provider.request({ method: "eth_chainId" });
      if (chainId !== "0x2105") {
        console.log("Base ağına geçiliyor...");
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x2105",
              chainName: "Base Mainnet",
              nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://mainnet.base.org"],
              blockExplorerUrls: ["https://basescan.org"],
            },
          ],
        });
      }

      // 🔹 3️⃣ Ethers.js ile işlem
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const gmContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

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
        <h1 className="gm-title">{greeting} ☀️</h1>
        <p className="gm-subtitle">Güne enerjik başlamak için hazır mısın?</p>
        <button className="gm-button" onClick={handleGmClick}>
          GM!
        </button>
      </div>
    </div>
  );
}
