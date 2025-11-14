// wallet/connect.ts
import { ethers } from 'ethers';

export async function connectWallet() {
  const anyWindow = window as any;

  if (!anyWindow.ethereum) {
    alert('No wallet found. Please install MetaMask.');
    throw new Error('No ethereum provider');
  }

  // Ask user to connect
  const accounts: string[] = await anyWindow.ethereum.request({
    method: 'eth_requestAccounts',
  });

  const address = accounts[0];

  // Wrap in ethers BrowserProvider
  const provider = new ethers.BrowserProvider(anyWindow.ethereum);

  // Store globally so DepositModal can grab it
  anyWindow.insperionProvider = provider;

  return { provider, address };
}
