import { GeneralMediaAccessGrantFragment } from "@/mikro-next/api/graphql";


export async function signS3Request(url: string, method: string, credentials: GeneralMediaAccessGrantFragment) {
  const { accessKey, secretKey, sessionToken, region } = credentials;
  const parsedUrl = new URL(url);
  const endpoint = parsedUrl.host; // e.g., "jhnnsrs-la" or "minio"
  const path = parsedUrl.pathname;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const service = "s3";

  // 1. Helper for HMAC-SHA256 using Web Crypto
  const hmac = async (key, data) => {
    const encoder = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
      "raw", typeof key === 'string' ? encoder.encode(key) : key,
      { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    return await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
  };

  const hash = async (data) => {
    const encoder = new TextEncoder();
    const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // 2. Create Canonical Request
  const signedHeaders = "host;x-amz-date;x-amz-security-token";
  const payloadHash = "UNSIGNED-PAYLOAD"; // Standard for GET requests
  const canonicalRequest = [
    method,
    path,
    "", // Query string (empty for simple GET)
    `host:${endpoint}\nx-amz-date:${amzDate}\nx-amz-security-token:${sessionToken}\n`,
    signedHeaders,
    payloadHash
  ].join("\n");

  // 3. Create String to Sign
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    await hash(canonicalRequest)
  ].join("\n");

  // 4. Calculate Derived Signing Key
  const kDate = await hmac(`AWS4${secretKey}`, dateStamp);
  const kRegion = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  const kSigning = await hmac(kService, "aws4_request");

  // 5. Final Signature
  const signatureBuffer = await hmac(kSigning, stringToSign);
  const signature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  // 6. Construct Authorization Header
  const authHeader = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    "Authorization": authHeader,
    "x-amz-date": amzDate,
    "x-amz-security-token": sessionToken,
    "x-amz-content-sha256": payloadHash
  };
}
