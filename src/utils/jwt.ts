// utils/jwt.js
import { SignJWT, jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || '1681989'); // Use a strong secret key

// Function to create a JWT
export const createToken = async (payload:any) => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h') // Set expiration time
    .sign(secretKey);

  return token;
};

// Function to verify a JWT
export const verifyToken = async (token:string) => {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return { valid: true, payload };
  } catch (error:any) {
    return { valid: false, message: error.message };
  }
};
