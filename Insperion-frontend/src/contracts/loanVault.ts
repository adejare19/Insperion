import { ethers } from "ethers";

export const LOAN_VAULT_ADDRESS =
  "0x86f5Ae8B4Dc2Dc2eF5b5f3734633CFe886A29E4C";

export const LOAN_VAULT_ABI = [
  // Frontend-facing methods
  "function borrow(bytes32 encAmount)",
  "function repay(bytes32 encAmount)",
];

export function getLoanVaultContract(provider: ethers.BrowserProvider) {
  const signer = provider.getSigner();
  return new ethers.Contract(LOAN_VAULT_ADDRESS, LOAN_VAULT_ABI, signer);
}
