import { FhevmRelayerBrowserClient } from "@zama-fhe/relayer-sdk/browser";

let client: FhevmRelayerBrowserClient | null = null;

async function getClient() {
  if (!client) {
    client = await FhevmRelayerBrowserClient.init({
      relayerUrl: "https://relayer.testnet.zama.cloud",
      chainId: 11155111,
    });
  }
  return client;
}

export async function decrypt(ciphertext: any) {
  const c = await getClient();
  const result = await c.decryptU64(ciphertext);
  return result;
}
