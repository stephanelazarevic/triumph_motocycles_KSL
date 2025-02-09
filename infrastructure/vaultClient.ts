import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";
const env = await load();

const VAULT_URL = env.VAULT_URL;
const VAULT_TOKEN = env.VAULT_TOKEN;

export async function getSecret(secretPath: string): Promise<any> {
  const url = `${VAULT_URL}/v1/${secretPath}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${VAULT_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching secret from Vault: ${response.statusText}`);
  }

  const jsonResponse = await response.json();
  return jsonResponse.data.data;
}
