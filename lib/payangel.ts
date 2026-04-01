import { PayAngel } from "payangel";

let client: PayAngel | null = null;

export function getClient(publicKey?: string, secretKey?: string, env?: string): PayAngel {
  const pk = publicKey || process.env.PAYANGEL_PUBLIC_KEY || "";
  const sk = secretKey || process.env.PAYANGEL_SECRET_KEY || "";
  const environment = (env || process.env.PAYANGEL_ENV || "sandbox") as "sandbox" | "production";

  if (!client || publicKey || secretKey) {
    const baseURL = process.env.PAYANGEL_BASE_URL;
    client = new PayAngel({
      publicKey: pk,
      secretKey: sk,
      env: environment,
      ...(baseURL ? { baseURL } : {}),
    });
  }
  return client;
}
