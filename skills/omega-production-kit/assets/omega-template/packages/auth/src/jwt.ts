import { createHmac, timingSafeEqual } from "node:crypto";

export interface JwtClaims {
  sub: string;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  scope: string[];
}

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

function sign(input: string, secret: string): string {
  return createHmac("sha256", secret).update(input).digest("base64url");
}

export function issueJwt(claims: JwtClaims, secret: string): string {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = b64url(JSON.stringify(claims));
  const signature = sign(`${header}.${payload}`, secret);
  return `${header}.${payload}.${signature}`;
}

export function verifyJwt(token: string, secret: string, nowSeconds = Math.floor(Date.now() / 1000)): JwtClaims {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) {
    throw new Error("invalid JWT format");
  }

  const expected = sign(`${header}.${payload}`, secret);
  const expectedBytes = Buffer.from(expected);
  const actualBytes = Buffer.from(signature);
  if (expectedBytes.length !== actualBytes.length || !timingSafeEqual(expectedBytes, actualBytes)) {
    throw new Error("invalid JWT signature");
  }

  const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as JwtClaims;
  if (claims.exp <= nowSeconds) {
    throw new Error("JWT expired");
  }
  return claims;
}
