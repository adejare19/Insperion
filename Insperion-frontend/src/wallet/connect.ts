// wallet/connect.ts
import { ethers } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) {
    alert("Metamask not installed");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  // Attach to window so all modals can access
  (window as any).insperionProvider = provider;
  (window as any).insperionAddress = address;

  return { provider, address };
}
