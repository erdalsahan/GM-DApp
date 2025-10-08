import { ethers, Contract, parseEther } from "ethers";
import './GM.css';

const CONTRACT_ADDRESS = "0x1c7E6832199883ffF593b111ee8b1ce974c7dB67";
const ABI = [
  "function sendGM(string calldata message) external payable",
  "function lastMessage(address) view returns (string)",
  "event GMSent(address indexed from, string message, uint256 tip, uint256 timestamp)"
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

      // 🚀 JsonRpcProvider kullanıyoruz, ENS çözümlemesi yok
      

const provider = new ethers.BrowserProvider(window.ethereum); // read-only provider
const signer = await provider.getSigner();                   // signer ile write mümkün

const gmContract = new Contract(CONTRACT_ADDRESS, ABI, signer); // signer ile kontrat oluştur
const tx = await gmContract.sendGM("GM ☀️", { value: parseEther("0.00001") });
await tx.wait();

console.log("Transaction on-chain oldu!", tx.hash);

      alert("GM gönderildi! TxHash: " + tx.hash);

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
