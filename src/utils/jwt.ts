import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: object,
  secret: Secret,
  expiresIn: SignOptions["expiresIn"]
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

const verifyToken = (token: string, secret: Secret) => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    return {
      success: true,
      data: decoded,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};