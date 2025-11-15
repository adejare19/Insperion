import { ethers } from "ethers";

export const CREDIT_REGISTRY_ADDRESS =
  "0x7F27898168479faDFAB56ADf57a36834899f80c4";

// Match the *compiled* ABI: encrypted values are bytes32 on-chain
export const CREDIT_REGISTRY_ABI = [
  // core actions
  "function depositCollateral(bytes32 encAmount)",
  "function updateScore(address user, bytes32 encDelta, bool increase)",

  // views
  "function isEligible(address user) view returns (bool)",
  "function getEncCollateral(address user) view returns (bytes32)",
  "function getEncDebt(address user) view returns (bytes32)",
  "function getEncScore(address user) view returns (bytes32)",
];

export function getRegistryContract(provider: ethers.BrowserProvider) {
  const signer = provider.getSigner();
  return new ethers.Contract(
    CREDIT_REGISTRY_ADDRESS,
    CREDIT_REGISTRY_ABI,
    signer
  );
}

export function getRegistryReadOnly(provider: ethers.BrowserProvider) {
  return new ethers.Contract(
    CREDIT_REGISTRY_ADDRESS,
    CREDIT_REGISTRY_ABI,
    provider
  );
}
