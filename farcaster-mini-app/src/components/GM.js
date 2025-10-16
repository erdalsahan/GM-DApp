import { ethers, Contract, parseEther } from "ethers";
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

  // ✅ Birden fazla cüzdan varsa Farcaster'ı seç
  if (window.ethereum?.providers?.length) {
    provider = window.ethereum.providers.find(
      (p) => p.isFarcaster || p.name?.toLowerCase().includes("farcaster")
    ) || window.ethereum.providers[0];
  } else {
    provider = window.ethereum;
  }

  if (!provider) {
    alert("Cüzdan bulunamadı!");
    return;
  }

  // 🔸 Cüzdan ismini logla
  const walletName = provider.name || (provider.isFarcaster ? "Farcaster" : "Bilinmiyor");
  console.log("Aktif Cüzdan:", walletName);

  try {
    await provider.request({ method: "eth_requestAccounts" });

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
      } catch (addError) {
        console.error("Ağı ekleyemedik:", addError);
        alert("Base ağına geçiş yapılmadı.");
        return;
      }
    }

    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    const gmContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const hours = new Date().getHours();
    let greeting = "Good Morning";
    if (hours >= 12 && hours < 18) greeting = "Good Afternoon";
    else if (hours >= 18) greeting = "Good Evening";

    const tx = await gmContract.sendGM(greeting);
    await tx.wait();

    alert(`GM gönderildi ✅\nTx Hash: ${tx.hash}`);
    console.log("Tx başarıyla gönderildi", tx.hash);
  } catch (err) {
    console.error(err);
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
