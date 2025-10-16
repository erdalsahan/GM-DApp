// GMCard-Farcaster.js
import React, { useEffect, useState } from "react";
import { ethers, Contract } from "ethers";
import { sdk } from "@farcaster/miniapp-sdk";
import "./GM.css";

const CONTRACT_ADDRESS = "0x2D8A50649B05e6DFFC821676919e99A3a3528488";
const ABI = [
  "function sendGM(string calldata message) external",
  "function withdraw() external",
  "event GMSent(address indexed from, string message, uint256 timestamp)"
];

export default function GMCardFarcaster() {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // MiniApp ortamına hazır olduğunu bildir
        if (sdk?.actions?.ready) {
          await sdk.actions.ready();
        }

        // Farcaster gömülü provider al
        const ethProvider = await sdk.wallet.getEthereumProvider();
        if (!ethProvider) {
          console.warn("Farcaster provider alınamadı — miniapp ortamında olduğunuzdan emin olun.");
          setProvider(null);
          return;
        }

        // Bazı provider'larda name veya custom flag olabilir
        const name = ethProvider.name || ethProvider.providerName || (ethProvider.isFarcaster ? "Farcaster" : null);
        console.log("Alınan provider adı:", name);
        setProvider(ethProvider);
      } catch (err) {
        console.error("SDK init hatası:", err);
        setProvider(null);
      }
    };

    init();
  }, []);

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours >= 18) return "Good Evening";
    if (hours >= 12) return "Good Afternoon";
    return "Good Morning";
  };

  const handleGmClick = async () => {
    // 1) Provider kontrol
    if (!provider) {
      alert("Farcaster cüzdan sağlayıcısı alınamadı. Lütfen miniapp ortamında olduğunuzdan ve Farcaster Wallet'ın tercih edildiğinden emin olun.");
      return;
    }

    // 2) (İsteğe bağlı) Provider'ın gerçekten Farcaster olup olmadığını kontrol et
    const maybeName = provider.name || provider.providerName || "";
    const isFarcasterProvider = !!(
      provider.isFarcaster ||
      maybeName.toString().toLowerCase().includes("farcaster") ||
      maybeName.toString().toLowerCase().includes("warpcast")
    );

    if (!isFarcasterProvider) {
      // Kullanıcı ayarlarında başka bir cüzdan seçili olabilir — uyar
      const wantToContinue = window.confirm(
        "Bu miniapp için tercih edilen cüzdan Farcaster değil. Devam etmek istersen mevcut cüzdan ile işlem yapılacaktır. Farcaster ile yapmak istiyorsan miniapp Settings → Preferred wallet'dan Farcaster'ı seç ve tekrar dene."
      );
      if (!wantToContinue) return;
    }

    setLoading(true);
    try {
      // Hesap iste
      await provider.request({ method: "eth_requestAccounts" });

      // Zincir kontrolü (Base chainId: 0x2105)
      const chainId = await provider.request({ method: "eth_chainId" });
      if (chainId !== "0x2105") {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: "0x2105",
              chainName: "Base Mainnet",
              nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://mainnet.base.org"],
              blockExplorerUrls: ["https://basescan.org"],
            }]
          });
        } catch (addErr) {
          console.error("Ağı ekleyememe hatası:", addErr);
          alert("Base ağına geçiş yapılamadı. İşlem iptal edildi.");
          setLoading(false);
          return;
        }
      }

      // ethers ile provider'ı sarmala ve signer al
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();

      // Kontrat ile etkileşim
      const gmContract = new Contract(CONTRACT_ADDRESS, ABI, signer);

      // Mesaj
      const greeting = getGreeting();

      // Gönder
      const tx = await gmContract.sendGM(greeting);
      // opsiyonel: kullanıcıya tx onayı göster (miniapp veya farcaster wallet kendi UI'sını gösterecektir)
      await tx.wait();

      alert(`GM gönderildi ✅\nTx: ${tx.hash}`);
      console.log("Tx success:", tx.hash);
    } catch (err) {
      console.error("Gönderme hatası:", err);
      // SDK/Provider hataları bazen objeyi .message ile vermeyebilir
      alert("Hata: " + (err?.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gm-container">
      <div className="gm-card">
        <h1 className="gm-title">{getGreeting()} ☀️</h1>
        <p className="gm-subtitle">Farcaster gömülü cüzdan ile GM gönder</p>

        <button
          className="gm-button"
          onClick={handleGmClick}
          disabled={loading}
        >
          {loading ? "İşlem gönderiliyor..." : "GM!"}
        </button>

        {!provider && (
          <p style={{ color: "orange", marginTop: 12 }}>
            Not: Farcaster miniapp ortamında değilsiniz ya da provider alınamadı. Miniapp içinde ve Prefered Wallet → Farcaster seçili olduğunda çalışır.
          </p>
        )}
      </div>
    </div>
  );
}
