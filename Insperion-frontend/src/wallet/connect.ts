// src/wallet/connect.ts

import { ethers } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not installed");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  await provider.send("eth_requestAccounts", []);

  // Install into global namespace
  (window as any).insperionProvider = provider;

  return provider;
}
