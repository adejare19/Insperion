import { ethers } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) {
    alert("Metamask not installed");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  return provider;
}
