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
  if (!window.ethereum) {
    alert("Cüzdan bulunamadı!");
    return;
  }

  // ✅ Hangi wallet kullanılıyor kontrol et
  const walletName = window.ethereum?.name || window.ethereum?.providerInfo?.name;
  console.log("Aktif Wallet:", walletName);

  if (walletName && walletName.toLowerCase().includes("farcaster")) {
    console.log("Farcaster Wallet kullanılıyor ✅");
  } else {
    console.log("Farcaster Wallet değil, normal provider 🚀");
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== "0x2105") {
      try {
        await window.ethereum.request({
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

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
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
