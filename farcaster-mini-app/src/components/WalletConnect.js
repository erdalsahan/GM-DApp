import React, { useEffect, useState } from "react";
import './WalletConnect.css'; // saf CSS
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { ethers } from "ethers";
function WalletConnect() {
    const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [domainName, setDomainName] = useState(null);

  // Cüzdanı bağla
  async function connectMetaMask() {
    if (!window.ethereum) {
      alert("MetaMask bulunamadı. Lütfen tarayıcı cüzdanı kurun.");
      return;
    }

    try {
      setLoading(true);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const addr = accounts[0];
      setAddress(addr);
      setConnected(true);

      const chain = await window.ethereum.request({
        method: "eth_chainId",
      });
      setChainId(chain);

      // Ethereum mainnet için ENS çözümle
      if (chain === "0x1") {
        await resolveENS(addr);
      }

      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Bağlantı başarısız: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  // ENS çözümle
  async function resolveENS(addr) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const name = await provider.lookupAddress(addr); // ENS name
      setDomainName(name);
    } catch (err) {
      console.error("ENS adı alınamadı:", err);
      setDomainName(null);
    }
  }

  function disconnect() {
    setConnected(false);
    setAddress("");
    setChainId(null);
    setDomainName(null);
  }

  // Hesap ve chain değişikliklerini dinle
  useEffect(() => {
    if (!window.ethereum) return;

    async function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        disconnect();
      } else {
        const addr = accounts[0];
        setAddress(addr);

        // Ethereum mainnetse ENS çöz
        if (chainId === "0x1") {
          await resolveENS(addr);
        } else {
          setDomainName(null);
        }
      }
    }

    function handleChainChanged(chainId) {
      setChainId(chainId);
      setDomainName(null); // zincir değişirse domain sıfırla
    }

    window.ethereum.on?.("accountsChanged", handleAccountsChanged);
    window.ethereum.on?.("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [chainId]);

  function shortAddr(addr) {
    if (!addr) return "";
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  }


return (
  <div className="wc-container">
    {/* Sağ üstteki Connect butonu */}
    <div className="wc-topbar">
      {connected ? (
        <div className="wc-connected">
          <span className="wc-address">{shortAddr(address)}</span>
          <button onClick={disconnect} className="wc-disconnect">
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowModal(!showModal)}
          className="wc-connect-btn"
        >
          Connect Wallet
        </button>
      )}

      {/* Sağ üstte açılan panel */}
      {showModal && !connected && (
        <div className="wc-dropdown">
          <div className="wc-dropdown-header">
            <h4>Choose Wallet</h4>
            <button onClick={() => setShowModal(false)}>✕</button>
          </div>
          <div className="wc-wallet-buttons">
            <button onClick={connectMetaMask}>🦊 MetaMask</button>
            <button disabled>🌐 WalletConnect</button>
            <button disabled>💼 Coinbase Wallet</button>
          </div>
        </div>
      )}
    </div>

    {/* Ortadaki kart */}
    {/* <div className="wc-card">
      <h3>Connect Wallet</h3>
      <p>DApp'e bağlanmak için bir cüzdan seçin</p>

      <div className="wc-status">
        <div>Durum:</div>
        {connected ? (
          <>
            <div>Bağlı: {shortAddr(address)}</div>
            <div>Chain ID: {chainId}</div>
          </>
        ) : (
          <div>Henüz cüzdan bağlı değil.</div>
        )}
      </div>
    </div> */}
  </div>
);


}

export default WalletConnect;
