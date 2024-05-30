// src/utils/jwtUtils.ts
import * as jose from 'jose';

interface UserDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface JwtPayload {
  userDetails: UserDetails;
  iat: number;
  exp: number;
}

export async function verifyToken(token: string, secretKey: string): Promise<JwtPayload> {
  const secretBytes = new TextEncoder().encode(secretKey);
  const { payload } = await jose.jwtVerify(token, secretBytes) as { payload: JwtPayload };
  return payload;
}
