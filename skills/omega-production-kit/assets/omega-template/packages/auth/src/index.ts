import { createHmac, timingSafeEqual } from "node:crypto";
export { issueJwt, verifyJwt } from "./jwt";
export type { JwtClaims } from "./jwt";

export interface NodeCredential {
  nodeId: string;
  signature: string;
}

export function signNode(nodeId: string, secret: string): NodeCredential {
  return {
    nodeId,
    signature: createHmac("sha256", secret).update(nodeId).digest("hex")
  };
}

export function verifyNode(credential: NodeCredential, secret: string): boolean {
  const expected = signNode(credential.nodeId, secret).signature;
  const expectedBytes = Buffer.from(expected);
  const actualBytes = Buffer.from(credential.signature);
  return expectedBytes.length === actualBytes.length && timingSafeEqual(expectedBytes, actualBytes);
}
