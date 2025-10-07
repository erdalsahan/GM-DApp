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

  async function connectMetaMask() {
    if (!window.ethereum) {
      alert("MetaMask bulunamadı. Lütfen tarayıcı cüzdanı kurun.");
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAddress(accounts[0]);
      setConnected(true);
      const chain = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(chain);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Bağlantı başarısız: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  function disconnect() {
    setConnected(false);
    setAddress("");
    setChainId(null);
  }

  useEffect(() => {
    if (!window.ethereum) return;

    function handleAccountsChanged(accounts) {
      if (accounts.length === 0) disconnect();
      else setAddress(accounts[0]);
    }

    function handleChainChanged(chainId) {
      setChainId(chainId);
    }

    window.ethereum.on?.("accountsChanged", handleAccountsChanged);
    window.ethereum.on?.("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, []);

  function shortAddr(addr) {
    if (!addr) return "";
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  }
async function connectCoinbase() {
  try {
    const APP_NAME = "My DApp";
    const APP_LOGO_URL = "https://example.com/logo.png";

    const DEFAULT_ETH_JSONRPC_URL = "https://mainnet.base.org"; // Base RPC
    const DEFAULT_CHAIN_ID = 8453; // Base Mainnet decimal

    // Coinbase Wallet SDK instance
    const coinbaseWallet = new CoinbaseWalletSDK({
      appName: APP_NAME,
      appLogoUrl: APP_LOGO_URL,
      darkMode: false
    });

    // ✅ Correct: makeWeb3Provider expects url and chainId
    const ethereum = coinbaseWallet.makeWeb3Provider(
      DEFAULT_ETH_JSONRPC_URL, // JSON RPC URL
      DEFAULT_CHAIN_ID          // Chain ID decimal
    );

    // request accounts
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setAddress(accounts[0]);
    setConnected(true);

    const chain = await ethereum.request({ method: "eth_chainId" });
    setChainId(chain);
    setShowModal(false);

    // ethers v6 BrowserProvider ile signer
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    console.log("Coinbase Wallet bağlandı:", accounts[0]);
  } catch (err) {
    console.error(err);
    alert("Coinbase Wallet bağlanamadı: " + (err.message || err));
  }
}

  return (
    <div className="wc-container">
      <div className="wc-card">
        <div className="wc-header">
          <div>
            <h3>Connect Wallet</h3>
            <p>DApp'e bağlanmak için bir cüzdan seçin</p>
          </div>

          <div>
            {connected ? (
              <div className="wc-connected">
                <span className="wc-address">{shortAddr(address)}</span>
                <button onClick={disconnect} className="wc-disconnect">Disconnect</button>
              </div>
            ) : (
              <button onClick={() => setShowModal(true)} className="wc-connect-btn">Connect Wallet</button>
            )}
          </div>
        </div>

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

        {showModal && (
          <div className="wc-modal">
            <div className="wc-backdrop" onClick={() => setShowModal(false)}></div>
            <div className="wc-modal-content">
              <div className="wc-modal-header">
                <h4>Choose Wallet</h4>
                <button onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="wc-wallet-buttons">
                <button onClick={connectMetaMask}>MetaMask</button>
                <button disabled={true} onClick={() => alert("WalletConnect placeholder")}>WalletConnect</button>
                <button disabled={true} onClick={connectCoinbase}>Coinbase Wallet</button>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletConnect;
