import { ethers } from "ethers";

export const CREDIT_REGISTRY_ADDRESS =
  "0x7F27898168479faDFAB56ADf57a36834899f80c4";

export const CREDIT_REGISTRY_ABI = [
  "function depositCollateral(euint64 encAmount)",
  "function borrow(euint64 encAmount)",
  "function repay(euint64 encAmount)",
  "function isEligible(address user) view returns (bool)",
];

export function getRegistryContract(provider: ethers.BrowserProvider) {
  return new ethers.Contract(
    CREDIT_REGISTRY_ADDRESS,
    CREDIT_REGISTRY_ABI,
    provider.getSigner()
  );
}
